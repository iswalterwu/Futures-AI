# Override contrib 2026.9 collection only to exclude pyarrow/tests data.
from PyInstaller.utils.hooks import collect_data_files, collect_dynamic_libs, collect_submodules

hiddenimports = collect_submodules('pyarrow', filter=lambda name: "tests" not in name)
datas = collect_data_files('pyarrow', excludes=['tests'])
binaries = collect_dynamic_libs('pyarrow')
