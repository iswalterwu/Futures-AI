'use strict'
// 内置引导/设置页（desktop-shell T-06）：页面只做视图，业务逻辑全在 settings 核心（经后端宿主）。
// AC-005-1 首启进引导、AC-005-2 可跳过、AC-005-3 开通与状态、AC-005-4 不显示明文。

const $ = (sel) => document.querySelector(sel)
const displayedEmails = new WeakMap()
const status = (el, text, kind) => {
  el.hidden = false
  el.textContent = text
  el.className = `status ${kind || ''}`
}

async function api(path, options = {}) {
  const backend = await window.futuresai.getBackend()
  if (!backend) throw new Error(window.futuresai.mode === 'mock' ? 'Mock 模式：设置业务不可用' : '后端未就绪')
  const res = await fetch(`http://127.0.0.1:${backend.port}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${backend.token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const body = res.status === 204 ? {} : await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || body.detail || `HTTP ${res.status}`)
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
  displayedEmails.set(form, form.elements.email.value)
}

function profilePatch(form) {
  const payload = Object.fromEntries(new FormData(form).entries())
  if (payload.email === displayedEmails.get(form)) delete payload.email
  return payload
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
  tbody.replaceChildren()
  for (const s of sources) {
    const tr = document.createElement('tr')
    const identity = document.createElement('td')
    const code = document.createElement('code')
    code.textContent = s.adapter_id
    const name = document.createElement('div')
    name.textContent = s.name || ''
    identity.append(code, name)
    tr.append(identity)
    for (const text of [PATH_LABEL[s.path] || s.path,
      `${s.enabled ? '已启用' : '已禁用'} · ${s.status}`,
      s.verified_at || '尚未验证',
      s.run_status ? `${s.run_status} · ${s.run_at || ''}` : '尚未取数',
      [s.reason, s.reason_hint, s.guide_error].filter(Boolean).join('；')]) {
      const cell = document.createElement('td')
      cell.textContent = text
      tr.append(cell)
    }
    tbody.append(tr)
  }
  $('#open-unregister').hidden = false
}

async function boot() {
  await loadApplicationPrefs()
  const backend = await window.futuresai.getBackend()
  if (!backend) {
    const message = window.futuresai.mode === 'mock' ? 'Mock 模式：设置业务不可用' : '后端未就绪，请稍后重试'
    $('#meta').textContent = message
    show('view-onboard')
    status($('#onboard-status'), message, 'err')
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
    await renderSources()
  }
}

// ---- 引导 ----
$('#onboard-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const payload = profilePatch(e.target)
  try {
    await api('/settings/profile', { method: 'PUT', body: JSON.stringify(payload) })
    await api('/settings/onboard', { method: 'POST', body: JSON.stringify({ skip: false }) })
    await window.futuresai.openMain()
  } catch (err) {
    status($('#onboard-status'), `保存失败：${err.message}`, 'err')
  }
})

$('#skip-onboard').addEventListener('click', async () => {
  try {
    await api('/settings/onboard', { method: 'POST', body: JSON.stringify({ skip: true }) })
    await window.futuresai.openMain()
  } catch (err) {
    status($('#onboard-status'), `跳过失败：${err.message}`, 'err')
  }
})

// ---- 设置 ----
$('#back-main').addEventListener('click', () => window.futuresai.openMain())
$('#profile-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const payload = profilePatch(e.target)
  try {
    const data = await api('/settings/profile', { method: 'PUT', body: JSON.stringify(payload) })
    fillForm(e.target, data.profile)
    status($('#profile-status'), '档案已保存', 'ok')
  } catch (err) {
    status($('#profile-status'), `保存失败：${err.message}`, 'err')
  }
})

$('#prepare-guide').addEventListener('click', async () => {
  const guide = $('#guide')
  guide.replaceChildren()
  $('#open-register')?.remove()
  try {
    const data = await api('/settings/registration-guide', { cache: 'no-store' })
    if (data.missing.length) {
      const hint = document.createElement('p')
      hint.textContent = data.hint
      guide.append(hint)
      for (const field of data.missing) {
        const row = document.createElement('div')
        row.dataset.missing = field
        row.textContent = field
        guide.append(row)
      }
      $('#profile-form').elements[data.missing[0]].focus()
      return
    }
    const fields = document.createElement('dl')
    for (const { label, value } of data.prefill) {
      const term = document.createElement('dt')
      term.textContent = label
      const detail = document.createElement('dd')
      detail.textContent = value
      fields.append(term, detail)
    }
    guide.append(fields)
    for (const note of data.submit.notes) {
      const text = document.createElement('p')
      text.textContent = note
      guide.append(text)
    }
    const open = document.createElement('button')
    open.type = 'button'
    open.id = 'open-register'
    open.textContent = '在浏览器打开 EIA 注册页'
    open.addEventListener('click', () => window.open(data.submit.url, '_blank'))
    $('#registration-actions').append(open)
  } catch (err) {
    guide.textContent = `准备失败：${err.message}`
  }
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
    $('#api-key').value = ''
    status($('#key-status'), r.cleared ? '已清除 key，当前为免凭证回退' : '未配置 key，当前为免凭证回退', 'ok')
    await renderSources()
  } catch (err) {
    status($('#key-status'), `清除失败：${err.message}`, 'err')
  }
})

// ---- 应用偏好：只消费窄 bridge，不触及档案/凭证或任意路径 ----
async function loadApplicationPrefs() {
  const result = await window.futuresai.getShellPrefs()
  if (result.error) {
    status($('#application-status'), `读取失败：${result.error.code || result.error}`, 'err')
    return
  }
  $('#close-behavior').value = result.prefs.closeBehavior
  $('#notifications').checked = result.prefs.notifications
  $('#update-check').checked = result.prefs.updateCheck === 'startup'
  $('#update-check').disabled = !result.updateConfigured
  $('#update-note').textContent = result.updateConfigured ? '' : '未配置更新源，启动时检查更新不可用。'
  $('#data-root').textContent = result.dataRoot
  $('#pending-root').hidden = result.prefs.pendingDataRoot === null
  $('#pending-root').textContent = result.prefs.pendingDataRoot === null ? '' : `重启后生效：${result.prefs.pendingDataRoot}`
  $('#relaunch').hidden = result.prefs.pendingDataRoot === null
}
async function saveApplicationPref(patch) {
  const result = await window.futuresai.setShellPrefs(patch)
  status($('#application-status'), result.error ? `保存失败：${result.error.code || result.error}` : '应用偏好已保存', result.error ? 'err' : 'ok')
  await loadApplicationPrefs()
}
$('#close-behavior').addEventListener('change', event => { void saveApplicationPref({ closeBehavior: event.target.value }) })
$('#notifications').addEventListener('change', event => { void saveApplicationPref({ notifications: event.target.checked }) })
$('#update-check').addEventListener('change', event => { void saveApplicationPref({ updateCheck: event.target.checked ? 'startup' : 'off' }) })
$('#choose-data-root').addEventListener('click', async () => {
  const result = await window.futuresai.chooseDataRoot()
  if (result.cancelled) return
  status($('#application-status'), result.error ? `更改失败：${result.error.code || result.error}` : '重启后生效，原目录数据不会移动或删除。', result.error ? 'err' : 'ok')
  await loadApplicationPrefs()
})
$('#relaunch').addEventListener('click', () => window.futuresai.relaunch())

boot().catch((err) => {
  $('#meta').textContent = `启动失败：${err.message}`
  status($('#onboard-status'), `启动失败：${err.message}`, 'err')
})
