'use strict'
// 占位页：只显示后端就绪状态（引导/设置界面在 T-06 实现）
const el = document.getElementById('status')

async function refresh() {
  const backend = window.futuresai && window.futuresai.backend ? window.futuresai.backend() : null
  if (!backend || !backend.port) {
    el.textContent = '后端尚未就绪'
    el.className = 'err'
    return
  }
  try {
    const res = await fetch(`http://127.0.0.1:${backend.port}/health`)
    const body = await res.json()
    el.className = body.data_ready ? 'ok' : 'err'
    el.innerHTML = `后端就绪：<code>${body.status}</code> · 版本 <code>${body.version}</code>`
  } catch (e) {
    el.textContent = `无法连接后端：${e}`
    el.className = 'err'
  }
}

refresh()
