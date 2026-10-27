# D-007 桌面外壳：Electron

- 日期：2026-10-26
- 状态：accepted

## 背景

桌面应用需要窗口、托盘、通知、自动更新、打包与激活窗口；Backend 为 Python 核心（FastAPI，localhost）。

## 备选方案

- Electron
- Tauri（体积小，但需维护 Rust 工具链 + Python sidecar 双重打包与更新）
- pywebview（最轻，但托盘/自动更新/商用分发能力弱，仅适合原型）

## 结论

**Electron**。Python 核心以子进程（PyInstaller sidecar）方式随包分发。

## 取舍理由

打包/自动更新/托盘/授权生态最成熟；Node 与 pi 生态同源，保留未来 in-process SDK 的退路。

## 影响

- `shell/` 技术栈与主进程设计
- `packaging/` 使用 electron-builder；分发与更新链路
- Python 以 sidecar 形态打包（PyInstaller）
