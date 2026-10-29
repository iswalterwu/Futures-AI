// 预加载脚本：只暴露最小面（desktop-shell plan §3.2）。
// 渲染层拿不到 Node 能力；当前代际端点经窄 IPC 异步读取。
'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const mode = process.argv.includes('--fai-mode=mock') ? 'mock' : 'backend'
window.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('mock-banner')
  if (banner) banner.hidden = mode !== 'mock'
}, { once: true })
contextBridge.exposeInMainWorld('futuresai', {
  mode,
  getBackend: () => ipcRenderer.invoke('fai:backend'),
  onShellStatus: callback => {
    let active = true, received = false
    const listener = (_event, status) => { received = true; if (active) callback(status) }
    ipcRenderer.on('fai:status', listener)
    ipcRenderer.invoke('fai:status').then(status => { if (active && !received) callback(status) })
    return () => { active = false; ipcRenderer.removeListener('fai:status', listener) }
  },
  retryStartup: () => ipcRenderer.invoke('fai:retry'),
  openLogs: () => ipcRenderer.invoke('fai:logs'),
  openSettings: () => ipcRenderer.invoke('fai:open-settings'),
  openMain: () => ipcRenderer.invoke('fai:open-main'),
})
