"""数据源开通向导核心（spec R-003，plan §2.2）。

五步：prepare（预填/缺项）→ submit（注册页与逐项指引）→ key_input（用户粘贴）→ verify（真实验证）→ done。
程序**不提交注册表单、不读取邮箱**：本模块没有任何向注册页发 POST 的代码路径。
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from data import creds

from data.adapters.eia import eia_adapter

from settings.profile import Profile, SECTORS, load as load_profile, missing_for_registration

REGISTRATION_URL = "https://www.eia.gov/opendata/register.php"
SOURCE_ID = "eia"
CREDENTIAL_REF = "eia_api_key"  # 与内置 eia manifest 的 credentials.credential_ref 一致
STATE_DIR = "profile"
STATE_FILE = "state.json"

# 向导错误码（供界面/CLI 给可操作提示）
ERR_INVALID_KEY = "invalid_key"
ERR_RATE_LIMITED = "rate_limited"
ERR_UNREACHABLE = "unreachable"
ERR_SERVER = "server_error"
ERR_BAD_RESPONSE = "bad_response"


@dataclass
class Step:
    key: str  # prepare | submit | verify | done
    title: str
    detail: dict = field(default_factory=dict)


def state_path(root: Path) -> Path:
    return Path(root) / STATE_DIR / STATE_FILE


def read_state(root: Path) -> dict:
    p = state_path(root)
    if not p.is_file():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def _write_json_atomic(path: Path, payload: dict) -> None:
    """临时文件 + 原子替换：并发/中断不会留下半截 JSON（读侧不会把损坏当空）。"""
    import os
    import tempfile

    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=1)
        os.replace(tmp, path)
    except OSError:
        Path(tmp).unlink(missing_ok=True)
        raise


def write_state(root: Path, source_id: str, **fields) -> None:
    """记录开通状态（不含任何凭证内容）；写入用临时文件 + 原子替换（崩溃安全）。"""
    data = read_state(root)
    entry = data.setdefault(source_id, {})
    entry.update(fields)
    _write_json_atomic(state_path(root), data)


ONBOARD_KEY = "onboard"


def onboard_state(root: Path) -> dict:
    """首次启动引导状态：{completed: bool, skipped: bool}（不存在 = 未完成）。"""
    entry = read_state(root).get(ONBOARD_KEY) or {}
    return {"completed": bool(entry.get("completed")), "skipped": bool(entry.get("skipped"))}


def set_onboard_state(root: Path, *, completed: bool, skipped: bool = False) -> None:
    write_state(root, ONBOARD_KEY, completed=completed, skipped=skipped)


def prepare(root: Path) -> Step:
    """第 1 步：用档案预填。档案缺注册所需字段时 detail["missing"] 非空（不出现空表单）。"""
    profile = load_profile(root)
    missing = missing_for_registration(profile)
    return Step(
        "prepare",
        "准备注册信息",
        {
            "missing": missing,
            "prefill": guide_fields(profile),
            "hint": "先补齐档案中的缺项，再继续注册（档案可在 profile set 中修改）" if missing else "",
        },
    )


def guide_fields(profile: Profile) -> list[dict]:
    """注册表单的逐项指引：界面/CLI 照抄到浏览器（值来自档案）。"""
    return [
        {"label": "First Name", "value": profile.first_name},
        {"label": "Last Name", "value": profile.last_name},
        {"label": "Email", "value": profile.email},
        {"label": "Category that best describes you/your organization", "value": SECTORS.get(profile.sector, "")},
        {"label": "Reason for use（可选）", "value": profile.reason_for_use},
    ]


def registration_hint() -> Step:
    """第 2 步：给出注册页与操作要点（由用户在浏览器自行核对并提交，程序不代提交）。"""
    return Step(
        "submit",
        "在浏览器中提交注册",
        {
            "url": REGISTRATION_URL,
            "notes": [
                "打开上面的地址，按「逐项指引」填写；条款与勾选由你本人确认",
                "提交后 key 会发送到你在表单里填写的邮箱（注意查收垃圾邮件）",
                "本程序不会代替你提交表单，也不会读取你的邮箱",
            ],
        },
    )


class _ProbeError(Exception):
    """验证失败（自带向导错误码，便于界面给出可操作提示）。"""

    def __init__(self, code: str):
        super().__init__(code)
        self.code = code


def _probe(key: str) -> None:
    """真实验证：用该 key 调一次 EIA API（可注入）。

    错误按向导错误码区分：invalid_key / rate_limited / unreachable / server_error / bad_response。
    请求期间抑制 HTTP 客户端 DEBUG 日志（key 在查询参数里）。
    """
    import requests

    params = {
        "api_key": key,
        "frequency": "weekly",
        "data[0]": "value",
        "facets[series][]": "WDISTUS1",
        "length": 1,
    }
    try:
        eia_adapter.protect_secrets()  # 日志脱敏（一次性 Filter）
        resp = requests.get(
            "https://api.eia.gov/v2/petroleum/stoc/wstk/data/", params=params, timeout=20
        )
    except requests.exceptions.RequestException:
        raise _ProbeError(ERR_UNREACHABLE) from None  # 切断异常链（requests 文本含 api_key）
    if resp.status_code in (401, 403):
        raise _ProbeError(ERR_INVALID_KEY)
    if resp.status_code == 429:
        raise _ProbeError(ERR_RATE_LIMITED)
    if resp.status_code >= 500:
        raise _ProbeError(ERR_SERVER)
    if resp.status_code >= 400:
        raise _ProbeError(ERR_BAD_RESPONSE)
    try:
        payload = resp.json()
    except ValueError:
        raise _ProbeError(ERR_BAD_RESPONSE) from None
    response = payload.get("response") if isinstance(payload, dict) else None
    if not isinstance(response, dict) or not response.get("data"):
        raise _ProbeError(ERR_BAD_RESPONSE)


def verify_and_save(root: Path, key: str) -> Step:
    """第 3~5 步：真实验证 → **成功才保存**（失败不写入）→ 记录验证时间。"""
    key = (key or "").strip()
    if not key:
        return Step("verify", "校验 key", {"ok": False, "error": "empty_key", "message": "key 不能为空"})
    try:
        _probe(key)
    except _ProbeError as e:
        code = e.code
    else:
        code = None
    if code is not None:
        message = {
            ERR_INVALID_KEY: "key 无效或已失效，请确认后重试（未保存）",
            ERR_RATE_LIMITED: "EIA 限流，请稍后重试（未保存）",
            ERR_UNREACHABLE: "无法连接 EIA（网络不可达），请检查网络后重试（未保存）",
            ERR_BAD_RESPONSE: "EIA 返回内容异常，无法确认 key 有效（未保存）",
            ERR_SERVER: "EIA 服务端错误，请稍后重试（未保存）",
        }[code]
        write_state(root, SOURCE_ID, last_error=code)
        return Step("verify", "校验 key", {"ok": False, "error": code, "message": message})
    creds.put(Path(root) / "creds", CREDENTIAL_REF, key)  # 只有验证通过才落盘
    verified_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    write_state(root, SOURCE_ID, verified_at=verified_at, last_error=None)
    return Step(
        "done",
        "开通完成",
        {"ok": True, "path": "api", "verified_at": verified_at, "message": "凭证已加密保存并验证通过"},
    )

def clear_key(root: Path) -> bool:
    """清除凭证 → 回到免凭证路径（spec AC-003-5）。返回是否确实删除。"""
    existed = creds.remove(Path(root) / "creds", CREDENTIAL_REF)
    write_state(root, SOURCE_ID, verified_at=None, last_error=None)
    return existed


def has_key(root: Path) -> bool:
    return creds.exists(Path(root) / "creds", CREDENTIAL_REF)
