// 预加载脚本：只暴露最小面（desktop-shell plan §3.2）。
// 渲染层拿不到 Node 能力；后端地址与令牌由主进程经 additionalArguments 注入。
'use strict'

const { contextBridge } = require('electron')

function readBackend() {
  const arg = process.argv.find((a) => a.startsWith('--fai-backend='))
  if (!arg) return null
  try {
    return JSON.parse(arg.slice('--fai-backend='.length))
  } catch {
    return null
  }
}

contextBridge.exposeInMainWorld('futuresai', {
  backend: () => readBackend(),
})
