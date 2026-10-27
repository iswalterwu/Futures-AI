"""settings feature（specs/settings）：用户档案、首次启动引导、数据源开通向导、数据源状态。

- 与 data-layer 单向依赖：本包 import `data`，`data` 不反向依赖本包
- 档案与凭证同等保护（DPAPI 加密、fail closed）；档案仅存本机、不上传
- 向导只做预填与指引，不代用户提交注册表单、不读取用户邮箱
"""
