"""后端宿主（desktop-shell plan §3.1）。

不是业务 API：只提供外壳判定就绪所需的 `/health`、优雅退出，以及承载首启引导/设置的最小端点。
业务 API（真实数据契约）归 `api` feature。

进程内只有一个 Service（持数据目录写锁）；退出时由 lifespan 释放。
"""
from __future__ import annotations

import errno
import secrets
import threading
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from data.creds import CredsError
from data.lock import remove_endpoint
from data.mcp_server import build_internal_app
from data.service import Service
from settings import onboarding, sources
from settings.profile import SECTORS, ProfileError, load as load_profile, mask_email, missing_for_registration

VERSION = "0.1.0"


def is_disk_full(exc: BaseException) -> bool:
    """文件系统错误可能经档案/凭证层包装，保留 cause 链的错误码。"""
    while exc is not None:
        if getattr(exc, "errno", None) == errno.ENOSPC or getattr(exc, "winerror", None) in (39, 112):
            return True
        exc = exc.__cause__
    return False


class Host:
    """宿主状态：一个 Service（单写者）+ 退出信号。"""

    def __init__(self, root: Path):
        self.root = Path(root)
        self.svc = Service(self.root)
        try:
            self.svc.init()
        except BaseException:
            self.svc.close()
            raise
        self.channel_token = secrets.token_hex(32)
        self.should_exit = threading.Event()

    def close(self) -> None:
        try:
            remove_endpoint(self.root / "data", self.channel_token)
        finally:
            self.svc.close()


class _Settings(BaseModel):
    key: str = ""


class _Onboard(BaseModel):
    skip: bool = False


class _ProfilePatch(BaseModel):
    """档案部分更新：只提交要改的字段（空串表示清空）。"""

    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    sector: str | None = None
    reason_for_use: str | None = None
    display_name: str | None = None
    notify: bool | None = None


SECTORS_PAYLOAD = [{"key": k, "label": v} for k, v in SECTORS.items()]


def create_app(root: Path, token: str, host: Host | None = None) -> FastAPI:
    """构建应用。token 为空时不启用鉴权（仅供测试）。"""

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.host = host if host is not None else Host(root)
        internal = build_internal_app(app.state.host.svc, app.state.host.channel_token)
        app.router.routes.extend(internal.routes)
        try:
            yield
        finally:
            for route in internal.routes:
                app.router.routes.remove(route)
            app.state.host.close()

    app = FastAPI(title="futuresai-backend-host", lifespan=lifespan)

    @app.exception_handler(OSError)
    @app.exception_handler(CredsError)
    @app.exception_handler(ProfileError)
    async def storage_error(request, exc):
        if is_disk_full(exc):
            return JSONResponse(status_code=507, content={
                "error": "disk_full", "message": "磁盘空间不足，写入失败",
            })
        return JSONResponse(status_code=422 if isinstance(exc, (ProfileError, CredsError)) else 500,
                            content={"detail": type(exc).__name__})

    def require_token(authorization: str | None = Header(default=None)) -> None:
        if not token:
            return
        if authorization != f"Bearer {token}":
            raise HTTPException(status_code=401, detail="unauthorized")

    # ---- 健康检查（外壳就绪判定的唯一依据，spec AC-002-2） ----
    @app.get("/health")
    def health():
        host: Host = app.state.host
        try:
            with host.svc.access_lock:
                host.svc.cat.con.execute("SELECT 1").fetchone()
                host.svc.store.con.execute("SELECT 1").fetchone()
        except Exception as exc:
            return JSONResponse(status_code=503, content={
                "status": "unavailable", "data_ready": False,
                "version": VERSION, "reason": type(exc).__name__,
            })
        return {"status": "ok", "data_ready": True, "version": VERSION}

    # ---- 退出 ----
    @app.post("/shutdown", dependencies=[Depends(require_token)])
    def shutdown() -> dict:
        app.state.host.should_exit.set()
        return {"status": "shutting_down"}

    # ---- 引导与设置（settings 界面类 AC 的宿主） ----
    @app.get("/settings/profile", dependencies=[Depends(require_token)])
    def get_profile() -> dict:
        profile = load_profile(Path(root))
        shown = profile.model_dump()
        shown["email"] = mask_email(shown["email"])
        return {
            "profile": shown,
            "onboarding": onboarding.onboard_state(Path(root)),
            "missing_for_registration": missing_for_registration(profile),
        }

    @app.get("/settings/registration-guide", dependencies=[Depends(require_token)])
    def get_registration_guide() -> dict:
        return {**onboarding.prepare(Path(root)).detail,
                "submit": onboarding.registration_hint().detail}

    @app.get("/settings/sectors", dependencies=[Depends(require_token)])
    def get_sectors() -> dict:
        return {"sectors": SECTORS_PAYLOAD}

    @app.put("/settings/profile", dependencies=[Depends(require_token)])
    def put_profile(body: _ProfilePatch) -> dict:
        from settings.profile import update as update_profile

        if body.email is not None and "***" in body.email:
            raise HTTPException(status_code=422, detail="遮蔽显示值不可回写")
        fields = {k: v for k, v in body.model_dump().items() if v is not None}
        try:
            profile = update_profile(Path(root), **fields)
        except ValueError as e:
            raise HTTPException(status_code=422, detail="档案字段不合法") from e
        shown = profile.model_dump()
        shown["email"] = mask_email(shown["email"])
        return {"profile": shown, "missing_for_registration": missing_for_registration(profile)}

    @app.post("/settings/onboard", dependencies=[Depends(require_token)])
    def post_onboard(body: _Onboard) -> dict:
        onboarding.set_onboard_state(Path(root), completed=True, skipped=body.skip)
        return onboarding.onboard_state(Path(root))

    @app.get("/settings/sources", dependencies=[Depends(require_token)])
    def get_sources() -> dict:
        host: Host = app.state.host
        return {"sources": sources.list_with_service(host.svc, Path(root))}

    @app.delete("/settings/key", dependencies=[Depends(require_token)])
    def delete_key() -> dict:
        return {"cleared": onboarding.clear_key(Path(root))}

    @app.post("/settings/key", dependencies=[Depends(require_token)])
    def post_key(body: _Settings) -> dict:
        step = onboarding.verify_and_save(Path(root), body.key)
        detail = dict(step.detail)
        detail.pop("ok", None)
        return {"ok": bool(step.detail.get("ok")), **detail}

    return app
