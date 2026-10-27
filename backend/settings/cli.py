"""settings CLI（spec R-002/R-003，plan §2.4）：`futureai-settings`。

- 查询类输出 JSON；交互类输出提示文本；错误走 stderr 返回 1
- key 只经 getpass 读取（不回显、不进 shell 历史），不接受位置参数
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from settings import onboarding, sources
from settings.profile import (
    SECTORS,
    Profile,
    ProfileError,
    clear as clear_profile,
    load as load_profile,
    mask_email,
    missing_for_registration,
    update as update_profile,
)

DEFAULT_ROOT = Path.home() / "AppData" / "Local" / "FuturesAI"


def _json_out(obj) -> None:
    print(json.dumps(obj, ensure_ascii=False, default=str, indent=1))


def _masked(profile: Profile) -> dict:
    data = profile.model_dump()
    data["email"] = mask_email(data["email"])
    data["missing_for_registration"] = missing_for_registration(profile)
    return data


def _cmd_profile(args) -> int:
    if args.profile_cmd == "show":
        _json_out(_masked(load_profile(Path(args.root))))
        return 0
    if args.profile_cmd == "clear":
        removed = clear_profile(Path(args.root))
        print("档案已清除" if removed else "档案不存在，无需清除")
        return 0
    # set：部分更新；缺项只提示，不拦截（spec Q-001）
    profile = load_profile(Path(args.root))
    updates = {
        "first_name": args.first_name,
        "last_name": args.last_name,
        "email": args.email,
        "sector": args.sector,
        "reason_for_use": args.reason,
        "display_name": args.display_name,
    }
    fields = {k: v for k, v in updates.items() if v is not None}
    if args.notify is not None:
        fields["notify"] = args.notify
    try:
        profile = update_profile(Path(args.root), **fields)  # 读—合并—校验—写在档案锁内
    except ProfileError as e:
        print(f"错误：{e}", file=sys.stderr)
        return 1
    except ValueError as e:  # pydantic 校验失败（邮箱格式 / 组织类型）
        print(f"错误：{e}", file=sys.stderr)
        return 1
    missing = missing_for_registration(profile)
    _json_out({"saved": True, "missing_for_registration": missing})
    if missing:
        print("提示：以下字段在开通需要凭证的数据源时会被要求：" + "、".join(missing), file=sys.stderr)
    return 0


def _cmd_onboard(args) -> int:
    root = Path(args.root)
    state = onboarding.onboard_state(root)
    if state["completed"]:  # 用明确完成标记判断，而不是"内容是否为空"
        print("首次启动引导已完成过（修改档案请用 profile set）")
        return 0
    if args.skip:
        onboarding.set_onboard_state(root, completed=True, skipped=True)
        print("已跳过首次启动引导；档案可稍后填写（免凭证数据源照常可用）")
        return 0
    profile = load_profile(root)
    print("首次启动配置（全部字段可留空，直接回车跳过；Ctrl+C 中止，已填项会保留）")
    for label, field in (("名（First Name）", "first_name"), ("姓（Last Name）", "last_name"),
                         ("邮箱（Email）", "email"), ("组织类型（见下方清单）", "sector")):
        if field == "sector":
            for key, text in SECTORS.items():
                print(f"  {key}: {text}")
        default = getattr(profile, field, "")
        for attempt in range(2):
            try:
                raw = input(f"{label}" + (f"（{default}）" if default else "") + ": ").strip()
            except (KeyboardInterrupt, EOFError):
                # 中断不置 completed：下次 onboard 继续引导（已填项已按项持久化）
                print("\n已中止；已填写的内容已保存，下次可继续", file=sys.stderr)
                return 0
            if not raw:
                break
            try:
                profile = update_profile(root, **{field: raw})  # 逐项校验并落盘（非法不写）
                break
            except (ProfileError, ValueError) as e:
                print(f"输入不合法：{e}" + ("，请重新输入" if attempt == 0 else "（已跳过该项）"), file=sys.stderr)
    onboarding.set_onboard_state(root, completed=True, skipped=False)
    missing = missing_for_registration(load_profile(root))
    _json_out({"saved": True, "missing_for_registration": missing})
    if missing:
        print("提示：以下字段在开通需要凭证的数据源时会被要求：" + "、".join(missing), file=sys.stderr)
    return 0


def _cmd_source(args) -> int:
    root = Path(args.root)
    if args.source_cmd == "list":
        _json_out({"sources": sources.list_with_status(root)})
        return 0
    if args.name != "eia":
        print("错误：v1 仅支持 eia 的开通向导", file=sys.stderr)
        return 1
    if args.source_cmd == "clear":
        removed = onboarding.clear_key(root)
        print("凭证已清除，当前回到免凭证回退路径" if removed else "未找到已保存的凭证")
        return 0
    # open：预填 → 注册页指引 → 不回显读 key → 真实验证 → 成功才保存
    step = onboarding.prepare(root)
    detail = step.detail
    if detail["missing"]:
        print("错误：档案缺少注册所需字段：" + "、".join(detail["missing"]), file=sys.stderr)
        print("请先执行 profile set 补齐后再继续", file=sys.stderr)
        return 1
    print("将使用以下信息（来自用户档案）填写 EIA 注册表单：", file=sys.stderr)
    for item in detail["prefill"]:
        if item["value"]:
            print(f"  {item['label']}: {item['value']}", file=sys.stderr)
    hint = onboarding.registration_hint()
    print(f"\n请在浏览器打开：{hint.detail['url']}", file=sys.stderr)
    for note in hint.detail["notes"]:
        print(f"  - {note}", file=sys.stderr)
    try:
        import getpass
        import warnings

        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            key = getpass.getpass("\n把收到的 API key 粘贴到此处（不回显）: ")
        if any(issubclass(w.category, getpass.GetPassWarning) for w in caught):
            # 终端不支持隐藏输入：继续会有明文回显风险 → 中止，不验证、不保存
            print("错误：无法在此终端隐藏输入（可能被回显），已中止且未保存。"
                  "请在图形界面或支持不回显的终端中执行", file=sys.stderr)
            return 1
    except (KeyboardInterrupt, EOFError):
        print("\n已取消，未保存任何内容", file=sys.stderr)
        return 1
    result = onboarding.verify_and_save(root, key)
    _json_out({"ok": result.detail.get("ok"), **{k: v for k, v in result.detail.items() if k != "ok"}})
    return 0 if result.detail.get("ok") else 1


def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="futureai-settings")
    p.add_argument("--root", default=str(DEFAULT_ROOT))
    sub = p.add_subparsers(dest="cmd", required=True)

    prof = sub.add_parser("profile")
    prof_sub = prof.add_subparsers(dest="profile_cmd", required=True)
    prof_sub.add_parser("show")
    prof_sub.add_parser("clear")
    pset = prof_sub.add_parser("set")
    pset.add_argument("--first-name"); pset.add_argument("--last-name"); pset.add_argument("--email")
    pset.add_argument("--sector", choices=sorted(SECTORS)); pset.add_argument("--reason")
    pset.add_argument("--display-name")
    pset.add_argument("--notify", type=lambda v: v.lower() in ("1", "true", "y", "yes"), default=None)

    onb = sub.add_parser("onboard")
    onb.add_argument("--skip", action="store_true")

    src = sub.add_parser("source")
    src_sub = src.add_subparsers(dest="source_cmd", required=True)
    src_sub.add_parser("list")
    for name in ("open", "clear"):
        sp = src_sub.add_parser(name)
        sp.add_argument("name", choices=["eia"])
    return p


def main(argv=None) -> int:
    args = _parser().parse_args(argv)
    try:
        if args.cmd == "profile":
            return _cmd_profile(args)
        if args.cmd == "onboard":
            return _cmd_onboard(args)
        return _cmd_source(args)
    except ProfileError as e:
        print(f"错误：{e}", file=sys.stderr)
        return 1
    except Exception as e:  # 含数据目录被写进程占用等：结构化提示，不抛裸异常
        print(f"错误：{e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
