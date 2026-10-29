'use strict'
const errors = {
  localappdata_missing: ['本地应用数据目录不可用', '未找到 LOCALAPPDATA。请检查 Windows 用户环境后重新启动。'],
  prefs_invalid: ['应用偏好文件无效', '偏好文件无法解析或格式不正确。请修复该文件后重试，不会自动重置。'],
  data_root_invalid: ['待生效数据目录不可用', '所选目录未通过可写检查，原目录的数据未更改。请修复权限或偏好后重试。'],
  data_root_unwritable: ['数据目录不可写', '权限不足或磁盘只读。请检查下列目录的写入权限后重试。'],
  data_root_locked: ['数据目录被另一进程占用', '请关闭正在使用该目录的写进程，然后重试。不要手工删除正在使用的锁。'],
  disk_full: ['磁盘空间不足', '磁盘写满导致启动失败。请释放该目录所在磁盘的空间，然后重试。'],
  port_in_use: ['后端端口被占用', '本地服务无法绑定指定端口。请关闭占用程序后重试。'],
  renderer_crashed: ['界面进程异常退出', '请重试加载界面；若仍失败，请查看日志。'],
  health_timeout: ['后端启动超时', '后端未在规定时间内通过健康检查。请查看日志后重试。'],
  restart_limit: ['后端反复异常退出', '自动重启已达到 3 次上限。请查看日志后重试。'],
  backend_missing: ['后端程序缺失', '无法启动本地后端。请检查安装文件后重试。'],
  backend_exited: ['后端已退出', '本地后端意外退出，请重试。'],
  frontend_missing: ['界面资源缺失或加载失败', '请检查界面资源路径或重新安装，然后重试。'],
  startup_internal: ['启动失败', '启动遇到内部错误，请查看日志后重试。'],
}
const byId = id => document.getElementById(id)
function render(status) {
  const failed = status.phase === 'failed'
  const [title, reason] = errors[status.code] || errors.startup_internal
  byId('title').textContent = failed ? title : '正在启动'
  byId('reason').textContent = failed ? reason : status.phase === 'restarting'
    ? `后端正在重启（第 ${status.attempt}/${status.maxAttempts} 次）`
    : status.phase === 'waiting_health' ? '等待健康检查，本地数据服务尚未就绪。' : '正在准备本地后端，请稍候。'
  if (failed && status.message) byId('reason').textContent += `\n原因：${status.message}`
  if (failed && status.reason) byId('reason').textContent += `\n原因：${status.reason}`
  byId('path').textContent = status.path ? `路径：${status.path}` : ''
  byId('code').textContent = failed ? status.code : ''
  byId('log-path').textContent = status.logPath ? `日志：${status.logPath}` : ''
  byId('actions').hidden = !failed
  byId('retry').disabled = !failed
  document.body.dataset.code = failed ? status.code : ''
  document.body.dataset.phase = status.phase
}
const unsubscribe = window.futuresai.onShellStatus(render)
window.addEventListener('unload', unsubscribe, { once: true })
byId('retry').addEventListener('click', async () => {
  byId('retry').disabled = true
  byId('action-result').textContent = ''
  try { await window.futuresai.retryStartup() } catch { byId('action-result').textContent = '重试失败，请查看日志。' }
})
byId('logs').addEventListener('click', async () => {
  try {
    const result = await window.futuresai.openLogs()
    byId('action-result').textContent = result.error ? `无法打开日志：${result.error}` : `日志目录：${result.path}`
  } catch { byId('action-result').textContent = '无法打开日志目录。' }
})
