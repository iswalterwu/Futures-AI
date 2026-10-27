"""AC-002-1/2/5：描述符规范化、ID 派生、8 槽渲染 golden 对拍。"""
from __future__ import annotations

import pytest

from data.catalog.descriptor import (
    DescriptorError,
    canonical,
    derive_id,
    display_8slot,
    normalize,
)

GOLDEN = [
    # (descriptor, canonical_json, derived_id, display_8slot)
    (
        {"asset": "sc", "geo": "world", "measure": "close", "contract": ""},
        '{"asset":"sc","contract":"","geo":"world","measure":"close"}',
        "82b6ce0c3b909b82dad25623ef47f66e",
        "sc.world.-.-.-.close.-.1d",
    ),
    (
        {"asset": "SC", "geo": "World", "measure": "CLOSE", "contract": " SC2401 "},
        '{"asset":"sc","contract":"SC2401","geo":"world","measure":"close"}',
        "c6fb76204981b613e5d72100a249a66a",
        "sc.world.-.-.-.close.SC2401.1d",
    ),
]


class TestGolden:
    @pytest.mark.parametrize("desc,canon,ident,display", GOLDEN)
    def test_golden(self, desc, canon, ident, display):
        assert canonical(desc) == canon
        assert derive_id(desc) == ident
        assert display_8slot(desc, "1d") == display

    def test_stability_across_calls(self):
        d = {"asset": "fu", "geo": "cn", "measure": "stock", "contract": "FU2501"}
        assert derive_id(d) == derive_id(d)
        # 键顺序无关
        assert derive_id(d) == derive_id(
            {"measure": "stock", "contract": "FU2501", "geo": "cn", "asset": "fu"}
        )

    def test_contract_distinguishes_series(self):
        main = {"asset": "sc", "geo": "world", "measure": "close"}
        jan = {**main, "contract": "SC2401"}
        feb = {**main, "contract": "SC2402"}
        assert derive_id(main) != derive_id(jan)
        assert derive_id(jan) != derive_id(feb)


class TestContractValidation:
    @pytest.mark.parametrize("bad", ["SC 2401", "SC-2401", "a" * 21, "  "])
    def test_reject_illegal_contract(self, bad):
        d = {"asset": "sc", "geo": "world", "measure": "close", "contract": bad}
        with pytest.raises(DescriptorError):
            normalize(d)

    @pytest.mark.parametrize("ok", ["SC2401", "fu2501", "SC2401x".upper()[:6]])
    def test_accept_legal_contract(self, ok):
        d = {"asset": "sc", "geo": "world", "measure": "close", "contract": ok}
        assert normalize(d)["contract"] == ok.strip()


class TestRequiredKeys:
    @pytest.mark.parametrize("field", ["asset", "geo", "measure"])
    def test_required(self, field):
        d = {"asset": "sc", "geo": "world", "measure": "close"}
        del d[field]
        with pytest.raises(DescriptorError):
            normalize(d)

    def test_empty_rejected(self):
        with pytest.raises(DescriptorError):
            normalize({"asset": "", "geo": "world", "measure": "close"})


class TestClosedEnums:
    def test_unknown_asset(self):
        with pytest.raises(DescriptorError):
            normalize({"asset": "rb", "geo": "world", "measure": "close"})

    def test_unknown_freq(self):
        with pytest.raises(DescriptorError):
            display_8slot(
                {"asset": "sc", "geo": "world", "measure": "close"}, "5m"
            )
