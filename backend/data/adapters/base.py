"""适配器抽象（plan §1，AC-004-4/007）。"""
from __future__ import annotations

from datetime import datetime


class Adapter:
    """取数实现基类。fetch 返回 [(ts, value)]（已按源口径归一）。"""

    id: str = ""

    def fetch(
        self,
        provide,
        range_start: datetime | None,
        range_end: datetime | None,
    ) -> list[tuple]:
        raise NotImplementedError

    def realtime_signature(self, descriptor: dict, on_update) -> None:
        """AC-004-4：realtime 仅定义接口签名，v1 不实现网络行为。"""
        raise NotImplementedError
