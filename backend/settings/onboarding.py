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
from data.fetch.on_demand import FetchError

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


def write_state(root: Path, source_id: str, **fields) -> None:
    """记录开通状态（不含任何凭证内容）。"""
    p = state_path(root)
    p.parent.mkdir(parents=True, exist_ok=True)
    data = read_state(root)
    entry = data.setdefault(source_id, {})
    entry.update(fields)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


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


def _probe(key: str) -> None:
    """真实验证：用该 key 调一次 EIA API（可注入）。成功返回；失败抛 FetchError。"""
    payload, _raw = eia_adapter._request("WDISTUS1", key, None, None)
    if not isinstance(payload, dict) or not payload.get("response", {}).get("data"):
        raise FetchError(ERR_BAD_RESPONSE, "EIA 返回中没有数据，无法确认 key 有效")


def verify_and_save(root: Path, key: str) -> Step:
    """第 3~5 步：真实验证 → **成功才保存**（失败不写入）→ 记录验证时间。"""
    key = (key or "").strip()
    if not key:
        return Step("verify", "校验 key", {"ok": False, "error": "empty_key", "message": "key 不能为空"})
    try:
        _probe(key)
    except FetchError as e:
        code = {
            "unauthorized": ERR_INVALID_KEY,
            "rate_limited": ERR_RATE_LIMITED,
            "adapter_error": ERR_UNREACHABLE,
            "validation_error": ERR_BAD_RESPONSE,
            "not_found": ERR_BAD_RESPONSE,
        }.get(e.code, ERR_SERVER)
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
    """清除凭证 → 该数据源回到免凭证路径（spec AC-003-5）。返回是否确实删除。"""
    p = Path(root) / "creds" / f"{CREDENTIAL_REF}.bin"
    existed = p.exists()
    if existed:
        p.unlink()
    write_state(root, SOURCE_ID, verified_at=None, last_error=None)
    return existed


def has_key(root: Path) -> bool:
    return creds.exists(Path(root) / "creds", CREDENTIAL_REF)
