'use strict'
// 内置引导/设置页（desktop-shell T-06）：页面只做视图，业务逻辑全在 settings 核心（经后端宿主）。
// AC-005-1 首启进引导、AC-005-2 可跳过、AC-005-3 开通与状态、AC-005-4 不显示明文。

const REGISTER_URL = 'https://www.eia.gov/opendata/register.php'
const backend = (window.futuresai && window.futuresai.backend && window.futuresai.backend()) || null

const $ = (sel) => document.querySelector(sel)
const status = (el, text, kind) => {
  el.hidden = false
  el.textContent = text
  el.className = `status ${kind || ''}`
}

async function api(path, options = {}) {
  if (!backend || !backend.port) throw new Error('后端未就绪')
  const res = await fetch(`http://127.0.0.1:${backend.port}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${backend.token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const body = res.status === 204 ? {} : await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.detail || `HTTP ${res.status}`)
  return body
}

function fillSectors(sectors) {
  for (const id of ['#sector-select', '#sector-select-2']) {
    const sel = $(id)
    if (!sel) continue
    for (const { key, label } of sectors) {
      const opt = document.createElement('option')
      opt.value = key
      opt.textContent = label
      sel.appendChild(opt)
    }
  }
}

function fillForm(form, profile) {
  for (const [k, v] of Object.entries(profile)) {
    const field = form.elements[k]
    if (field && typeof v === 'string') field.value = v
  }
}

function show(id) {
  for (const s of document.querySelectorAll('main section')) s.classList.toggle('active', s.id === id)
}

const PATH_LABEL = {
  api: 'API',
  offline: '免凭证回退',
  builtin: '内置免费源',
  declaration_only: '仅声明',
  blocked: '凭证故障',
}

async function renderSources() {
  const { sources } = await api('/settings/sources')
  const tbody = $('#sources-table tbody')
  tbody.innerHTML = ''
  for (const s of sources) {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td><code>${s.adapter_id}</code><br /><span class="muted">${s.name || ''}</span></td>
      <td><span class="badge ${s.path}">${PATH_LABEL[s.path] || s.path}</span></td>
      <td>${s.status}${s.run_status ? ` · 最近取数 <code>${s.run_status}</code>` : ''}</td>
      <td class="muted">${s.reason || ''}</td>`
    tbody.appendChild(tr)
  }
  const eia = sources.find((s) => s.adapter_id === 'eia')
  $('#open-unregister').hidden = !(eia && eia.credential_state === 'configured')
}

async function renderPrefill(profile) {
  const rows = [
    ['First Name', profile.first_name],
    ['Last Name', profile.last_name],
    ['Email', profile.email],
    ['Category', profile.sector],
  ]
  $('#prefill').innerHTML =
    '<div class="muted" style="margin-bottom:6px">将用以下信息填写注册表单：</div>' +
    rows.map(([k, v]) => `<div>${k}: <code>${v || '（未填）'}</code></div>`).join('')
}

async function boot() {
  if (!backend || !backend.port) {
    status($('#onboard-status'), '后端未就绪，请稍后重试', 'err')
    $('#onboard-form').classList.add('active')
    return
  }
  const data = await api('/settings/profile')
  const sectors = await api('/settings/sectors')
  fillSectors(sectors.sectors)
  $('#meta').textContent = `本地后端 127.0.0.1:${backend.port}`
  fillForm($('#onboard-form'), data.profile)
  fillForm($('#profile-form'), data.profile)

  if (!data.onboarding.completed) {
    show('view-onboard')
  } else {
    show('view-settings')
    await renderPrefill(data.profile)
    await renderSources()
  }
}

// ---- 引导 ----
$('#onboard-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const payload = Object.fromEntries(new FormData(e.target).entries())
  try {
    await api('/settings/profile', { method: 'PUT', body: JSON.stringify(payload) })
    await api('/settings/onboard', { method: 'POST', body: JSON.stringify({ skip: false }) })
    location.reload()
  } catch (err) {
    status($('#onboard-status'), `保存失败：${err.message}`, 'err')
  }
})

$('#skip-onboard').addEventListener('click', async () => {
  try {
    await api('/settings/onboard', { method: 'POST', body: JSON.stringify({ skip: true }) })
    location.reload()
  } catch (err) {
    status($('#onboard-status'), `跳过失败：${err.message}`, 'err')
  }
})

// ---- 设置 ----
$('#profile-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const payload = Object.fromEntries(new FormData(e.target).entries())
  try {
    const data = await api('/settings/profile', { method: 'PUT', body: JSON.stringify(payload) })
    status($('#profile-status'), '档案已保存', 'ok')
    await renderPrefill(data.profile)
  } catch (err) {
    status($('#profile-status'), `保存失败：${err.message}`, 'err')
  }
})

$('#open-register').addEventListener('click', () => {
  window.open(REGISTER_URL, '_blank') // 主进程会交给系统浏览器（AC-009-3）
})

$('#verify-key').addEventListener('click', async () => {
  const input = $('#api-key')
  const key = input.value.trim()
  if (!key) return status($('#key-status'), '请先粘贴 key', 'err')
  const btn = $('#verify-key')
  btn.disabled = true
  status($('#key-status'), '正在验证…', '')
  try {
    const result = await api('/settings/key', { method: 'POST', body: JSON.stringify({ key }) })
    if (result.ok) {
      input.value = ''
      status($('#key-status'), `已验证并保存（${result.verified_at || ''}）`, 'ok')
      await renderSources()
    } else {
      status($('#key-status'), result.message || `验证失败（${result.error}）`, 'err')
    }
  } catch (err) {
    status($('#key-status'), `验证失败：${err.message}`, 'err')
  } finally {
    btn.disabled = false
  }
})

$('#open-unregister').addEventListener('click', async () => {
  try {
    const r = await api('/settings/key', { method: 'DELETE' })
    status($('#key-status'), r.cleared ? '已清除 key，当前回到免凭证回退路径' : '未找到已保存的 key', 'ok')
    await renderSources()
  } catch (err) {
    status($('#key-status'), `清除失败：${err.message}`, 'err')
  }
})

boot().catch((err) => {
  $('#meta').textContent = `启动失败：${err.message}`
  status($('#onboard-status'), `启动失败：${err.message}`, 'err')
})
