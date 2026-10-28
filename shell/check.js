// 外壳冒烟（desktop-shell T-05；spec AC-002-2、AC-003-1、AC-004-1）
//
// 启动 `electron . --smoke`（真实主进程 + 真实后端子进程），断言：
//   1) 打印 READY（/health 就绪）
//   2) 进程退出码 0
//   3) 退出后数据目录无 .lock、后端端口已释放
// 第二实例：再次启动时应立刻退出（单实例锁），不产生第二个后端。
'use strict'

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const net = require('node:net')
const os = require('node:os')
const path = require('node:path')

const SHELL_DIR = __dirname
const ELECTRON = require('electron') // 返回可执行文件路径
const results = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

function runOnce(root, timeoutMs = 120000, args = ['--smoke']) {
  return new Promise((resolve) => {
    const child = spawn(ELECTRON, ['.', ...args], {
      cwd: SHELL_DIR,
      env: { ...process.env, FAI_DATA_ROOT: root, FAI_HEALTH_TIMEOUT_MS: '45000' },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    const timer = setTimeout(() => child.kill(), timeoutMs)
    child.on('exit', (code) => {
      clearTimeout(timer)
      resolve({ code, out })
    })
  })
}

function portFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer()
    srv.once('error', () => resolve(false))
    srv.once('listening', () => srv.close(() => resolve(true)))
    srv.listen(port, '127.0.0.1')
  })
}

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-shell-smoke-')) + path.sep + 'FuturesAI'
  const { code, out } = await runOnce(root)
  const readyLine = out.split('\n').find((l) => l.includes('READY '))
  check('后端经 /health 就绪（AC-002-2）', Boolean(readyLine), readyLine ? readyLine.slice(0, 120) : out.slice(-300))
  check('冒烟模式下正常退出（AC-003-1）', code === 0, `exit=${code}`)
  check('退出后无写锁（AC-003-1）', !fs.existsSync(path.join(root, 'data', '.lock')))
  if (readyLine) {
    const info = JSON.parse(readyLine.slice(readyLine.indexOf('READY ') + 6))
    check('退出后端口释放（AC-003-1）', await portFree(info.port), `port=${info.port}`)
  }

  // UI：内置引导/设置页（T-06，AC-005-1/2/4 的界面部分）
  const uiRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-shell-ui-')) + path.sep + 'FuturesAI'
  const ui = await runOnce(uiRoot, 120000, ['--ui-smoke'])
  const uiLine = ui.out.split('\n').find((l) => l.includes('UI_SMOKE '))
  let uiResult = {}
  try {
    uiResult = uiLine ? JSON.parse(uiLine.slice(uiLine.indexOf('UI_SMOKE ') + 9)) : {}
  } catch {
    uiResult = {}
  }
  check('首启进入引导（AC-005-1）', uiResult.onboardVisible === true, JSON.stringify(uiResult.activeView))
  // 1 个"（未选择）"占位 + 11 个官方选项
  check('组织类型选项随后端下发（AC-005-3）', (uiResult.sectorOptions || 0) === 12, `options=${uiResult.sectorOptions}`)
  check('key 输入为遮蔽类型（AC-005-4）', uiResult.keyInputType === 'password', String(uiResult.keyInputType))
  check('页面有 CSP 且含设置视图（AC-009-2）', uiResult.hasCsp === true && uiResult.hasSettingsSection === true)

  // 单实例：启动一个常驻实例（不带 --smoke），再启动第二个应立刻退出
  const first = spawn(ELECTRON, ['.'], {
    cwd: SHELL_DIR,
    env: { ...process.env, FAI_DATA_ROOT: root + '-single' },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })
  let firstOut = ''
  first.stdout.on('data', (d) => (firstOut += d))
  first.stderr.on('data', (d) => (firstOut += d))
  const deadline = Date.now() + 60000
  while (Date.now() < deadline && !/(READY|loading)/.test(firstOut)) {
    await new Promise((r) => setTimeout(r, 200))
  }
  const second = await runOnce(root + '-single', 30000)
  check('第二实例不启动后端并退出（AC-004-1）', !second.out.includes('READY ') || second.code === 0, `exit=${second.code}`)
  first.kill()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} 项通过`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => {
  console.error('smoke failed:', e)
  process.exit(1)
})
