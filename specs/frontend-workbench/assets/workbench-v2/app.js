// Clarify-stage prototype: no application stores, real account data or model calls.
const ICONS = {
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-10-3 2 3 2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  newspaper: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h3m-3 4h8m-8 3h8m-2-7h2"/>',
  candles: '<path d="M6 3v4m0 8v6m6-18v7m0 8v3m6-18v2m0 10v6"/><rect x="4" y="7" width="4" height="8" rx=".5"/><rect x="10" y="10" width="4" height="8" rx=".5"/><rect x="16" y="5" width="4" height="10" rx=".5"/>',
  balance: '<path d="M12 3v17m-6 1h12M4 7h16M6 7l-4 7h8L6 7zm12 0-4 7h8l-4-7z"/>',
  ship: '<path d="M3 16l2 4h14l2-4-9-4-9 4zm4-2V6h10v8M9 6V3h6v3M2 22c2-2 3 2 5 0s3 2 5 0 3 2 5 0 3 2 5 0"/>',
  research: '<path d="M3 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-3-2H3V4zm10 3a3 3 0 0 1 3-3h5v15h-5a4 4 0 0 0-3 2M6 8h3m-3 4h3m7-4h2m-2 4h2"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>',
  settings: '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h4l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3H9z"/><circle cx="11" cy="12" r="3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7z"/>',
  monitor: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-5 0h10"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  pause: '<path d="M9 5v14m6-14v14"/>',
  play: '<path d="m8 5 10 7-10 7V5z"/>',
  reset: '<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3zm7-1v4m-2-2h4"/>',
  'arrow-up': '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h2m4 0h2m-8 4h2"/>',
  bookmark: '<path d="M5 3h14v18l-7-4-7 4V3z"/>',
  trend: '<path d="M3 18 9 12l4 4 8-11m-6 0h6v6"/>',
  portfolio: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12a20 20 0 0 0 18 0m-9 0v3"/>',
  file: '<path d="M5 3h9l5 5v13H5V3zm9 0v5h5M8 12h8m-8 4h6"/>',
  link: '<path d="M10 14l4-4m-5 7-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-2 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>',
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
const $ = (id) => document.getElementById(id);
const STORAGE = 'fai.preview.workbench-v2';
const NAV = [
  ['workbench', '工作台', 'grid'], ['daily', '日报', 'newspaper'], ['prices', '价格', 'candles'],
  ['balance', '平衡表', 'balance'], ['logistics', '物流', 'ship'], ['research', '专题研究', 'research'], ['knowledge', '知识库', 'folder'],
];
const MODULES = [
  { id: 'market-board', title: '行情价格', icon: 'candles', size: 'quarter', meta: '日线 · 15:00' },
  { id: 'supply-demand', title: '库存 / 供需', icon: 'balance', size: 'quarter', meta: '周度指标' },
  { id: 'watchlist', title: '关注列表', icon: 'bookmark', size: 'eighth', meta: '3 个合约' },
  { id: 'release-calendar', title: '数据发布日历', icon: 'calendar', size: 'eighth', meta: '最近 4 项' },
  { id: 'logistics-onwater', title: '物流在途', icon: 'ship', size: 'eighth', meta: '运量与流向' },
  { id: 'positions', title: '当前头寸', icon: 'portfolio', size: 'sixteenth', meta: '未接入账户' },
  { id: 'doc-catalog', title: '文档目录', icon: 'folder', size: 'sixteenth', meta: '示例文件' },
];
const SIZES = [['half', '1/2'], ['quarter', '1/4'], ['eighth', '1/8'], ['sixteenth', '1/16']];
const defaults = () => ({ theme: 'light', accent: 'sand', collapsed: false, order: MODULES.map(m => m.id), sizes: Object.fromEntries(MODULES.map(m => [m.id, m.size])) });
let state = defaults();
try { state = { ...state, ...JSON.parse(localStorage.getItem(STORAGE) || '{}') }; } catch { /* Preview storage is optional. */ }
const requestedTheme = new URLSearchParams(location.search).get('theme');
if (['light', 'dark'].includes(requestedTheme)) state.theme = requestedTheme;
const save = () => localStorage.setItem(STORAGE, JSON.stringify(state));
function hydrateIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon)); }
function escapeText(text) { return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
const fmt = (value, decimals = 0) => value == null ? '–' : new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
function delta(value, decimals = 1, suffix = '') { return `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value), decimals)}${suffix}`; }
const marketTone = (value) => value > 0 ? 'positive' : value < 0 ? 'negative' : 'muted';
const analysisTone = (value) => value > 0 ? 'analysis-positive' : value < 0 ? 'analysis-negative' : 'muted';

// Mini-charts share exactly the same path builder across the focus band and cards.
function spark(values, { color = 'var(--chart-1)', width = 88, height = 26, area = false, className = 'spark' } = {}) {
  const lo = Math.min(...values), range = Math.max(...values) - lo || 1, padding = 3;
  const points = values.map((v, i) => [padding + i / (values.length - 1) * (width - 2 * padding), height - padding - (v - lo) / range * (height - 2 * padding)]);
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [endX, endY] = points.at(-1);
  return `<svg class="${className}" viewBox="0 0 ${width} ${height}" aria-label="合成示例走势" role="img" preserveAspectRatio="none">${area ? `<path d="${path} L${endX},${height} L${padding},${height} Z" fill="${color}" opacity=".065"/>` : ''}<path d="${path}" stroke="${color}" stroke-width="1.5" fill="none" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><circle cx="${endX}" cy="${endY}" r="2" fill="${color}"/></svg>`;
}

let watchlist, brief, board, calendar;
// Supplementary curves below are synthetic visual examples, not historical data.
const inventory = [2540, 2555, 2518, 2530, 2522, 2487, 2510, 2478, 2495, 2466, 2495, 2460];
const utilization = [72.1, 72.8, 72.6, 73.2, 72.9, 74.5, 74.1, 74.8, 74.9, 76.0, 75.8, 76.8];
const onwater = [780, 806, 794, 810, 805, 830, 816, 835, 811, 822, 820];
const metricCurve = (figure) => figure.semantic === 'market'
  ? watchlist.rows.find(row => row.price.seriesId === figure.seriesId).spark.points.map(p => p.value)
  : figure.label.includes('库存') ? inventory : figure.label.includes('开工') ? utilization : onwater;

function renderFocus() {
  const figures = brief.figures;
  for (const [container, semantic] of [['focus-market', 'market'], ['focus-indicators', 'analysis']]) {
    const selected = figures.filter(f => f.semantic === semantic).slice(0, semantic === 'market' ? 3 : 2);
    $(container).innerHTML = selected.map(f => {
      const tone = semantic === 'market' ? marketTone(f.delta) : analysisTone(f.delta);
      const color = semantic === 'market' ? f.delta > 0 ? 'var(--up)' : 'var(--down)' : 'var(--chart-1)';
      const label = f.label.replace('商业', '');
      return `<div class="focus-figure" data-semantic="${semantic}"><div class="focus-label"><span>${escapeText(label)}</span><span class="unit">${escapeText(f.unit)}</span></div><div class="focus-values"><span class="focus-price">${fmt(f.value, f.decimals)}</span>${spark(metricCurve(f), { color, width: 52, height: 24 })}</div><div class="focus-change ${tone}">${delta(f.delta, f.deltaKind === 'pct' ? 2 : 1, f.deltaKind === 'pct' ? '%' : ` ${f.unit}`)}</div></div>`;
    }).join('');
  }
}

function renderMarket() {
  const rows = watchlist.rows.map(row => `<tr><td><div class="contract-name"><strong>${escapeText(row.name.replace(/（样例）/, '').split(' ')[0])}</strong><small class="mono">${row.id}</small></div></td><td class="num">${fmt(row.price.value, row.price.decimals)}</td><td class="num ${marketTone(row.changePct.value)}">${delta(row.changePct.value, 2, '%')}</td><td class="spark-cell">${spark(row.spark.points.map(p => p.value), { color: row.change.value > 0 ? 'var(--up)' : 'var(--down)' })}</td></tr>`).join('');
  return `<table class="quote-table"><thead><tr><th>合约</th><th>最新价</th><th>涨跌幅</th><th>近 5 日</th></tr></thead><tbody>${rows}</tbody></table><div class="market-detail"><div><div class="market-detail-label">原油 <span class="mono">SC2612</span></div><div class="market-detail-price">512.6</div><small>60 个交易日 · 合成走势</small></div>${spark(board.series.points.map(p => p.value), { width: 380, height: 72, area: true, className: 'large-spark', color: 'var(--chart-1)' })}</div><div class="market-range"><span>08.06</span><span>10.28 · 所有数据均为示例</span></div>`;
}
function inventoryChart() {
  const W = 500, H = 112, m = { x: 30, y: 8, w: 456, h: 82 };
  const line = values => values.map((v, i) => `${m.x + i / (values.length - 1) * m.w},${m.y + m.h - (v - 2420) / 170 * m.h}`).join(' ');
  const previous = [2526, 2520, 2542, 2538, 2530, 2534, 2510, 2502, 2512, 2490, 2482, 2495];
  return `<svg class="inventory-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="库存合成示例图" preserveAspectRatio="none">${[2440, 2500, 2560].map(v => { const y = m.y + m.h - (v - 2420) / 170 * m.h; return `<line x1="${m.x}" x2="486" y1="${y}" y2="${y}" stroke="var(--line)"/><text class="axis-label" x="0" y="${y + 3}">${v}</text>`; }).join('')}<polyline points="${line(previous)}" fill="none" stroke="var(--chart-2)" stroke-dasharray="4 3" stroke-width="1.3" vector-effect="non-scaling-stroke"/><polyline points="${line(inventory)}" fill="none" stroke="var(--chart-1)" stroke-width="1.8" vector-effect="non-scaling-stroke"/>${['W40', 'W43', 'W46', 'W49'].map((v, i) => `<text class="axis-label" x="${30 + i * 148}" y="108">${v}</text>`).join('')}</svg>`;
}
function renderSupply() {
  const indicators = brief.figures.filter(f => f.semantic === 'analysis');
  return `<div class="supply-kpis">${indicators.map(f => `<div class="small-kpi"><div class="kpi-label">${f.label}${spark(metricCurve(f), { width: 42, height: 18 })}</div><div class="kpi-value">${fmt(f.value, f.decimals)}<span class="kpi-unit">${f.unit}</span></div><div class="kpi-change ${analysisTone(f.delta)}">${f.delta === 0 ? '较前期持平' : delta(f.delta, f.decimals, f.unit === '%' ? ' pct' : ` ${f.unit}`)}</div></div>`).join('')}</div><div class="chart-caption"><span>商业库存 <span class="muted"> / 万吨</span></span><span class="chart-key"><span><i></i>本期</span><span><i class="previous"></i>对照</span></span></div>${inventoryChart()}<div class="data-note"><span>示例趋势 · 不代表实际库存</span><span>周频 / 数据口径待接入</span></div>`;
}
function renderWatchlist() {
  return `<table class="compact-watch"><tbody>${watchlist.rows.map(row => `<tr><td><strong class="mono">${row.id}</strong></td><td class="num">${fmt(row.price.value, row.price.decimals)}</td><td class="num ${marketTone(row.changePct.value)}">${delta(row.changePct.value, 2, '%')}</td><td>${spark(row.spark.points.map(p => p.value), { color: row.change.value > 0 ? 'var(--up)' : 'var(--down)', width: 72, height: 20 })}</td></tr>`).join('')}</tbody></table>`;
}
function renderCalendar() {
  return `<ul class="calendar-list">${calendar.map(entry => `<li><span class="calendar-dot ${entry.status === 'stale' ? 'pending' : ''}"></span><span class="calendar-time">${entry.ts.slice(11, 16)}</span><span class="calendar-name" title="${escapeText(entry.name)}">${escapeText(entry.name.replace('（样例）', ''))}</span><small>${entry.ts.slice(5, 10).replace('-', '.')}</small></li>`).join('')}</ul>`;
}
function renderLogistics() {
  return `<div class="logistics-body"><div><div class="logistics-number">820<span class="kpi-unit">万吨</span></div><div class="logistics-caption">在途运量 · 较前期持平</div></div><div><div class="route-track"><span>装港</span><span class="route-dash"></span>${icon('ship')}<span class="route-dash"></span><span>卸港</span></div><div class="route-summary"><span>运量走势</span>${spark(onwater, { width: 110, height: 22 })}</div></div></div>`;
}
function renderPositions() {
  return `<div class="mini-status"><span class="status-text">${icon('link')}未接入账户</span><span class="position-value">–</span></div><div class="position-row"><span>持仓 / 当日盈亏</span><span>– / –</span></div><div class="position-row"><span>不读取真实交易数据</span></div>`;
}
function renderDocs() {
  return `<div class="doc-meta">示例目录 · 未读取本机文件</div>${[['油品供需周报', 'PDF'], ['库存数据口径', 'MD'], ['物流在途简报', 'PDF'], ['交易所公告摘录', 'PDF'], ['研究笔记', 'MD']].map(([name, ext]) => `<div class="doc-row">${icon('file')}<span title="${name}（示例）">${name}</span><small class="mono">${ext}</small></div>`).join('')}`;
}
const renderBody = {
  'market-board': renderMarket, 'supply-demand': renderSupply, watchlist: renderWatchlist,
  'release-calendar': renderCalendar, 'logistics-onwater': renderLogistics, positions: renderPositions, 'doc-catalog': renderDocs,
};
function renderModules() {
  $('module-grid').innerHTML = state.order.map(id => {
    const m = MODULES.find(m => m.id === id), size = state.sizes[id];
    return `<section class="module" data-module-id="${id}" data-size="${size}" aria-label="${m.title}"><header class="module-head">${icon(m.icon)}<h2 class="module-title" title="${m.title}">${m.title}</h2><span class="card-meta">${m.meta}</span><div class="module-controls"><label class="size-control"><select class="size-select" aria-label="${m.title}模块尺寸" data-resize="${id}">${SIZES.map(([key, label]) => `<option value="${key}" ${size === key ? 'selected' : ''}>${label}</option>`).join('')}</select>${icon('chevron-down')}</label><button class="icon-button remove-button" data-remove="${id}" aria-label="移除${m.title}" title="移除模块">${icon('close')}</button></div></header><div class="module-body">${renderBody[id]()}</div></section>`;
  }).join('');
  $('module-count').textContent = state.order.length;
  renderLibrary();
}
function renderLibrary() {
  $('library-list').innerHTML = MODULES.map(m => `<div class="library-row">${icon(m.icon)}<div><strong>${m.title}</strong><small>${SIZES.find(([key]) => key === state.sizes[m.id])[1]} 屏 · ${state.order.includes(m.id) ? '已在工作台' : '尚未添加'}</small></div><button ${state.order.includes(m.id) ? `data-remove="${m.id}"` : `data-add="${m.id}"`}>${state.order.includes(m.id) ? '移除' : '添加'}</button></div>`).join('');
}
function measureBoard() {
  const h = $('board-viewport').clientHeight;
  $('module-grid').style.setProperty('--unit-h', `${Math.max(92, (h - 3 * 10 - 1) / 4)}px`);
}

function applyTheme() {
  const theme = state.theme === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : state.theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.accent = state.accent;
  $('theme-toggle').innerHTML = icon(theme === 'light' ? 'moon' : 'sun');
  $('theme-toggle').setAttribute('aria-label', `切换为${theme === 'light' ? '深' : '浅'}色主题`);
  $('theme-toggle').title = `切换为${theme === 'light' ? '深' : '浅'}色主题`;
  $('theme-label').textContent = state.theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色主题' : '深色主题';
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === state.theme)));
  document.querySelectorAll('[data-accent-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accentChoice === state.accent)));
  save();
}
function applyRail() {
  $('app').classList.toggle('is-collapsed', state.collapsed);
  const label = state.collapsed ? '展开侧栏' : '收起侧栏';
  $('rail-toggle').setAttribute('aria-label', label);
  $('rail-toggle').setAttribute('aria-expanded', String(!state.collapsed));
  $('rail-toggle').title = label;
}
function togglePanel(id) {
  const panel = $(id), wasOpen = !panel.hidden;
  ['settings-panel', 'library-panel'].filter(other => other !== id).forEach(other => $(other).hidden = true);
  panel.hidden = wasOpen;
  $('settings-toggle').setAttribute('aria-expanded', String(!$('settings-panel').hidden));
}
let toastTimer;
function toast(message) {
  $('toast').textContent = message;
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').hidden = true, 2500);
}

// One visible news item; the entire line moves upward between messages.
const NEWS = [
  '合约观察：原油与燃料油合约走高，LPG 小幅回落；留意油品内部强弱分化。',
  '供需跟踪：示例库存下降、炼厂开工率回升，观察需求与生产端的后续变化。',
  '发布日历：晚间 22:30 有周度库存数据，发布后可结合图表比较预期与实际。',
  '本地研究：示例文档与图表仅用于布局评估，不构成投资建议，不读取私人数据。',
];
let newsIndex = 0, newsPaused = false, newsMoving = false;
function newsItem(index) { return `<div class="news-item" title="${escapeText(NEWS[index])}">${NEWS[index]}</div>`; }
function nextNews() {
  if (newsMoving) return;
  newsMoving = true;
  const next = (newsIndex + 1) % NEWS.length;
  const track = $('news-track');
  track.innerHTML = newsItem(newsIndex) + newsItem(next);
  track.getBoundingClientRect();
  track.classList.add('is-moving');
  setTimeout(() => {
    newsIndex = next;
    track.classList.remove('is-moving');
    track.innerHTML = newsItem(newsIndex);
    $('news-count').textContent = `${String(newsIndex + 1).padStart(2, '0')} / 04`;
    newsMoving = false;
  }, 340);
}

function bindEvents() {
  $('rail-toggle').addEventListener('click', () => { state.collapsed = !state.collapsed; applyRail(); save(); });
  $('theme-toggle').addEventListener('click', () => { state.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; applyTheme(); });
  $('settings-toggle').addEventListener('click', () => togglePanel('settings-panel'));
  $('library-toggle').addEventListener('click', () => togglePanel('library-panel'));
  $('reset-layout').addEventListener('click', () => { state.order = defaults().order; state.sizes = defaults().sizes; save(); renderModules(); toast('已恢复默认模块尺寸与顺序'); });
  $('news-next').addEventListener('click', nextNews);
  $('news-pause').addEventListener('click', () => {
    newsPaused = !newsPaused;
    $('news-pause').innerHTML = icon(newsPaused ? 'play' : 'pause');
    $('news-pause').setAttribute('aria-label', newsPaused ? '继续快讯轮播' : '暂停快讯轮播');
    $('news-pause').title = newsPaused ? '继续轮播' : '暂停轮播';
  });
  document.addEventListener('change', event => {
    const select = event.target.closest('[data-resize]');
    if (!select) return;
    state.sizes[select.dataset.resize] = select.value;
    save();
    renderModules();
    toast(`模块尺寸已设为 ${SIZES.find(([key]) => key === select.value)?.[1] || SIZES.find(([key]) => key === state.sizes[select.dataset.resize])[1]} 屏`);
  });
  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close]');
    if (close) $(close.dataset.close).hidden = true;
    const theme = event.target.closest('[data-theme-choice]');
    if (theme) { state.theme = theme.dataset.themeChoice; applyTheme(); }
    const accent = event.target.closest('[data-accent-choice]');
    if (accent) { state.accent = accent.dataset.accentChoice; applyTheme(); }
    const remove = event.target.closest('[data-remove]');
    if (remove) { state.order = state.order.filter(id => id !== remove.dataset.remove); save(); renderModules(); }
    const add = event.target.closest('[data-add]');
    if (add) { state.order.push(add.dataset.add); save(); renderModules(); }
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      document.querySelectorAll('[data-nav]').forEach(item => item.removeAttribute('aria-current'));
      nav.setAttribute('aria-current', 'page');
      if (nav.dataset.nav !== 'workbench') toast(`${nav.title}：仅演示导航状态；本页仍展示工作台原型`);
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.querySelectorAll('.floating-panel').forEach(p => p.hidden = true); $('settings-toggle').setAttribute('aria-expanded', 'false'); } });
  $('open-agent').addEventListener('click', () => $('agent-drawer').hidden = !$('agent-drawer').hidden);
  $('agent-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = $('agent-input');
    if (!input.value.trim()) return;
    $('agent-drawer').hidden = false;
    const message = document.createElement('div');
    message.className = 'user-message';
    message.textContent = input.value.trim();
    $('chat-content').appendChild(message);
    input.value = '';
    const answer = document.createElement('div');
    answer.className = 'assistant-message';
    answer.textContent = '这是交互示意，不调用模型。可以调整模块标题栏的尺寸、折叠侧栏，或在左下角切换明暗主题来比较信息密度。';
    $('chat-content').appendChild(answer);
    $('chat-content').scrollTop = $('chat-content').scrollHeight;
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.theme === 'system') applyTheme(); });
}

async function start() {
  hydrateIcons();
  applyTheme();
  applyRail();
  $('main-nav').innerHTML = NAV.map(([id, title, name]) => `<button class="rail-item" data-nav="${id}" title="${title}" aria-label="${title}" ${id === 'workbench' ? 'aria-current="page"' : ''}><span class="rail-glyph">${icon(name)}</span><span class="rail-label">${title}</span></button>`).join('');
  $('news-track').innerHTML = newsItem(0);
  const [watch, daily, prices, schedule] = await Promise.all(['watchlist', 'daily-brief', 'market-board', 'release-calendar'].map(name => fetch(`./fixtures/${name}.json`).then(r => r.json())));
  watchlist = watch;
  brief = daily.brief;
  board = prices;
  calendar = schedule;
  renderFocus();
  renderModules();
  bindEvents();
  new ResizeObserver(measureBoard).observe($('board-viewport'));
  measureBoard();
  setInterval(() => { if (!newsPaused) nextNews(); }, 5500);
  document.body.dataset.ready = 'true';
}
start().catch(error => { console.error(error); toast('示例加载失败：请通过本地预览服务器打开'); });
