# D-008 前端框架：Vue 3 + Vite + TS

- 日期：2026-10-26
- 状态：accepted

## 背景

图表密集型 Web 前端，渲染层已定 ECharts（D-004）。

## 备选方案

- Vue 3 + Vite + TypeScript
- React

## 结论

**Vue 3 + Vite + TypeScript**，状态管理 Pinia。

## 取舍理由

中文生态好、心智负担低；图表密集场景完全够用；与 ECharts 集成无障碍。React 无决定性优势。

## 影响

- `frontend/` 技术栈
