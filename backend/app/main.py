"""后端宿主（desktop-shell plan §3.1）。

不是业务 API：只提供外壳判定就绪所需的 `/health`、优雅退出，以及承载首启引导/设置的最小端点。
业务 API（真实数据契约）归 `api` feature。

进程内只有一个 Service（持数据目录写锁）；退出时由 lifespan 释放。
"""
from __future__ import annotations

import threading
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

from data.service import Service
from settings import onboarding, sources
from settings.profile import ProfileError, load as load_profile, mask_email, missing_for_registration

VERSION = "0.1.0"


class Host:
    """宿主状态：一个 Service（单写者）+ 退出信号。"""

    def __init__(self, root: Path):
        self.root = Path(root)
        self.svc = Service(self.root)
        self.svc.init()
        self.ready = True
        self.should_exit = threading.Event()

    def close(self) -> None:
        self.svc.close()


class _Settings(BaseModel):
    key: str = ""


class _Onboard(BaseModel):
    skip: bool = False


def create_app(root: Path, token: str) -> FastAPI:
    """构建应用。token 为空时不启用鉴权（仅供测试）。"""

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.host = Host(root)
        try:
            yield
        finally:
            app.state.host.close()

    app = FastAPI(title="futuresai-backend-host", lifespan=lifespan)

    def require_token(authorization: str | None = Header(default=None)) -> None:
        if not token:
            return
        if authorization != f"Bearer {token}":
            raise HTTPException(status_code=401, detail="unauthorized")

    # ---- 健康检查（外壳就绪判定的唯一依据，spec AC-002-2） ----
    @app.get("/health")
    def health() -> dict:
        host: Host = app.state.host
        return {
            "status": "ok" if host.ready else "starting",
            "data_ready": host.ready,
            "version": VERSION,
        }

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

    @app.post("/settings/onboard", dependencies=[Depends(require_token)])
    def post_onboard(body: _Onboard) -> dict:
        onboarding.set_onboard_state(Path(root), completed=True, skipped=body.skip)
        return onboarding.onboard_state(Path(root))

    @app.get("/settings/sources", dependencies=[Depends(require_token)])
    def get_sources() -> dict:
        host: Host = app.state.host
        return {"sources": sources.list_with_service(host.svc, Path(root))}

    @app.post("/settings/key", dependencies=[Depends(require_token)])
    def post_key(body: _Settings) -> dict:
        step = onboarding.verify_and_save(Path(root), body.key)
        detail = dict(step.detail)
        detail.pop("ok", None)
        return {"ok": bool(step.detail.get("ok")), **detail}

    return app
