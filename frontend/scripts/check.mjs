import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const checks = {
  generated: checkGenerated,
  colors: checkColors,
  glass: checkGlass,
  updown: checkUpdown,
  grid: checkGrid,
  network: checkNetwork,
}
const sourceExtensions = new Set(['.vue', '.css', '.scss', '.less', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.html', '.svg'])
const colorNames = new Set(`
  aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue
  blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan
  darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange
  darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet
  deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite
  gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender
  lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen
  lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow
  lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
  mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin
  navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise
  palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue
  saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow
  springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen
`.trim().split(/\s+/))
const colorLiteral = /#[\da-f]{8}(?![\w-])|#[\da-f]{6}(?![\w-])|#[\da-f]{4}(?![\w-])|#[\da-f]{3}(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|device-cmyk)\s*\(/gi
// 退役值来自 PALETTE_CORE 的 palette-retired 块，不能放回可用令牌登记。
const retiredColor = /#(?:c00000|12264f|2e59a7|206864|a67eb7)(?:[\da-f]{2})?(?![\w-])/gi
const updownReference = /--fai-updown-[\w-]+|\bT\s*(?:\.\s*updown\b|\[\s*['"]updown['"]\s*\])/g
const quotedString = /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`/g
const criticalBlock = /<!-- fai:critical:start -->[\s\S]*?<!-- fai:critical:end -->/g

async function main() {
  const selected = readOptions()
  const files = await readSources()
  for (const name of selected) {
    try {
      const errors = await checks[name](files)
      if (errors.length) throw new Error(errors.join('\n'))
      console.log(`check:${name}: passed`)
    } catch (error) {
      console.error(`check:${name}: failed\n${error.message}`)
      process.exitCode = 1
    }
  }
}

function readOptions() {
  const args = process.argv.slice(2)
  if (args.length === 0) return Object.keys(checks)
  if (args.length === 2 && args[0] === '--only' && Object.hasOwn(checks, args[1])) return [args[1]]
  throw new Error(`Usage: node scripts/check.mjs [--only <${Object.keys(checks).join('|')}>]`)
}

async function readSources() {
  const paths = [...await sourcePaths('src'), 'index.html'].sort()
  return Promise.all(paths.map(async (path) => ({ path, text: await readFile(resolve(root, path), 'utf8') })))
}

async function sourcePaths(directory) {
  const paths = []
  for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) paths.push(...await sourcePaths(path))
    else if (sourceExtensions.has(extname(path))) paths.push(path)
  }
  return paths
}

function isTokenSource({ path }) {
  return path === 'src/design/tokens.json' || path.startsWith('src/design/generated/')
}

function blank(text) {
  return text.replace(/[^\r\n]/g, ' ')
}

function withoutComments(text, script = false) {
  const pattern = script
    ? /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g
    : /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g
  return text.replace(pattern, (part) => part.startsWith('/*') || part.startsWith('//') || part.startsWith('<!--') ? blank(part) : part)
}

function code(file) {
  let text = withoutComments(file.text, /\.[cm]?[jt]sx?$/.test(file.path))
  if (/\.(vue|html)$/.test(file.path)) {
    text = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (part) => withoutComments(part, true))
  }
  return text
}

function regions(file, kind) {
  const text = code(file)
  if (kind === 'style' && /\.(css|scss|less)$/.test(file.path)) return [{ text, index: 0 }]
  if (kind === 'script' && /\.(?:[cm]?[jt]sx?|json)$/.test(file.path)) return [{ text, index: 0 }]
  if (!/\.(vue|html|svg)$/.test(file.path)) return []
  const result = []
  for (const match of text.matchAll(new RegExp(`<${kind}\\b[^>]*>([\\s\\S]*?)<\\/${kind}>`, 'gi'))) {
    result.push({ text: match[1], index: match.index + match[0].indexOf('>') + 1 })
  }
  const attribute = kind === 'style'
    ? /(?<![\w:-])style\s*=\s*(["'])([\s\S]*?)\1/gi
    : /(?:v-bind:|:)style\s*=\s*(["'])([\s\S]*?)\1/gi
  for (const match of text.matchAll(attribute)) {
    const value = match[2]
    result.push({ text: value, index: match.index + match[0].length - value.length - 1 })
  }
  return result
}

function cssDeclarations(region) {
  return [...region.text.matchAll(/([\w-]+)\s*:\s*([^;{}]+)(?=;|}|$)/g)].map((match) => ({
    property: match[1].toLowerCase(),
    value: match[2],
    index: region.index + match.index + match[0].length - match[2].length,
    script: false,
  }))
}

function isColorProperty(property) {
  return /^(?:--[\w-]+|(?:[\w-]+-)?color|background(?:-[\w-]+)?|(?:border|outline|column-rule)(?:-[\w-]+)?|(?:box|text)-shadow|fill|stroke(?:-[\w-]+)?|text-decoration(?:-[\w-]+)?)$/.test(property)
}

function styleDeclarations(file) {
  const result = regions(file, 'style').flatMap(cssDeclarations)
  for (const region of regions(file, 'script')) {
    const propertyValue = /["']?([\w-]+)["']?\s*[:=]\s*("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\[[^\]]*\])/g
    for (const match of region.text.matchAll(propertyValue)) {
      const property = match[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      if (!isColorProperty(property) && property !== 'grid-template-columns') continue
      for (const literal of match[2].matchAll(quotedString)) {
        result.push({ property, value: literal[0].slice(1, -1), index: region.index + match.index + match[0].length - match[2].length + literal.index + 1, script: true })
      }
    }
  }
  if (/\.(vue|html|svg)$/.test(file.path)) {
    for (const match of code(file).matchAll(/(?<![\w:-])([\w-]+)\s*=\s*(["'])(.*?)\2/g)) {
      if (isColorProperty(match[1])) {
        result.push({ property: match[1], value: match[3], index: match.index + match[0].length - match[3].length - 1, script: true })
      }
    }
  }
  return result
}

function location(file, index, message) {
  const before = file.text.slice(0, index)
  const line = before.split('\n').length
  const column = index - before.lastIndexOf('\n')
  return `${file.path}:${line}:${column}: ${message}`
}

function runGenerator(script, args = []) {
  execFileSync(process.execPath, [`scripts/${script}`, ...args], { cwd: root, stdio: 'inherit' })
}

async function checkGenerated(files) {
  runGenerator('tokens-build.mjs', ['--check'])
  const errors = []
  if (existsSync(resolve(root, 'scripts/contract-build.mjs'))) {
    const paths = ['contracts/CONTRACT.md', 'contracts/schema.json']
    const before = await Promise.all(paths.map((path) => readOptional(path)))
    runGenerator('contract-build.mjs')
    for (const [index, path] of paths.entries()) {
      const after = await readOptional(path)
      if (before[index] === null || after === null || !before[index].equals(after)) errors.push(`${path}: generated content was missing or stale; review and commit the regenerated file.`)
    }
  } else {
    // T-03 先于 T-07；生成器交付后自动纳入契约比对，不把尚未实施误报成漂移。
    console.log('check:generated: contracts skipped (scripts/contract-build.mjs not present; T-07).')
  }
  const tokens = JSON.parse(files.find(({ path }) => path === 'src/design/tokens.json').text)
  const breakpoints = new Set(tokens.filter(({ name }) => name.startsWith('breakpoint.')).map(({ value }) => Number(value)))
  for (const file of files) {
    for (const region of regions(file, 'style')) {
      for (const media of region.text.matchAll(/@media\b([^{}]+)\{/gi)) {
        for (const query of media[1].matchAll(/\(([^()]*\bwidth\b[^()]*)\)/gi)) {
          const thresholds = mediaThresholds(query[1].trim())
          if (thresholds.some((threshold) => !breakpoints.has(threshold))) errors.push(location(file, region.index + media.index, `@media ${query[0]} must use a token breakpoint (max-width = breakpoint - 1).`))
        }
      }
    }
  }
  return errors
}

async function readOptional(path) {
  return readFile(resolve(root, path)).catch((error) => {
    if (error.code === 'ENOENT') return null
    throw error
  })
}

function mediaThresholds(query) {
  const classic = /^(?:(min|max)-)?width\s*:\s*(\d+(?:\.\d+)?)px$/i.exec(query)
  if (classic) return [Number(classic[2]) + (classic[1]?.toLowerCase() === 'max' ? 1 : 0)]
  const range = /^width\s*(<=|>=|<|>|=)\s*(\d+(?:\.\d+)?)px$/i.exec(query)
  if (range) return [Number(range[2]) + (['<=', '>'].includes(range[1]) ? 1 : 0)]
  const reverse = /^(\d+(?:\.\d+)?)px\s*(<=|>=|<|>|=)\s*width$/i.exec(query)
  if (reverse) return [Number(reverse[1]) + (['>=', '<'].includes(reverse[2]) ? 1 : 0)]
  const between = /^(\d+(?:\.\d+)?px\s*[<>]=?)\s*width\s*([<>]=?\s*\d+(?:\.\d+)?px)$/i.exec(query)
  if (between) return [...mediaThresholds(`${between[1]} width`), ...mediaThresholds(`width ${between[2]}`)]
  return [NaN]
}

function colorHits(file) {
  const hits = new Map()
  const add = (value, index, named) => {
    for (const match of value.matchAll(colorLiteral)) hits.set(index + match.index, { index: index + match.index, value: match[0] })
    if (named) {
      for (const match of value.matchAll(/[a-z_-][\w-]*/gi)) {
        if (colorNames.has(match[0].toLowerCase())) hits.set(index + match.index, { index: index + match.index, value: match[0] })
      }
    }
  }
  for (const declaration of styleDeclarations(file)) {
    const value = declaration.script ? declaration.value : declaration.value.replace(/\burl\([^)]*\)/gi, blank).replace(quotedString, blank)
    add(value, declaration.index, isColorProperty(declaration.property))
  }
  for (const region of regions(file, 'script')) {
    for (const literal of region.text.matchAll(quotedString)) add(literal[0].slice(1, -1), region.index + literal.index + 1, false)
  }
  return [...hits.values()].sort((a, b) => a.index - b.index)
}

async function checkColorSamples() {
  const directory = 'scripts/check-samples/colors'
  const positive = { path: `${directory}/positive.css`, text: await readFile(resolve(root, directory, 'positive.css'), 'utf8') }
  const negative = { path: `${directory}/negative.css`, text: await readFile(resolve(root, directory, 'negative.css'), 'utf8') }
  const hits = colorHits(positive)
  const errors = []
  let offset = 0
  let cases = 0
  // 每行一个阳性、一个色值，独立按行核对，避免检测器漏掉整条声明时样例也假通过。
  for (const line of withoutComments(positive.text).split('\n')) {
    if (line.trim()) {
      cases++
      if (hits.filter(({ index }) => index >= offset && index < offset + line.length).length !== 1) errors.push(location(positive, offset, 'expected exactly one color hit on this sample line.'))
    }
    offset += line.length + 1
  }
  if (!cases) errors.push(`${positive.path}: positive samples must not be empty.`)
  for (const hit of colorHits(negative)) errors.push(location(negative, hit.index, `negative sample unexpectedly matched ${hit.value}.`))
  if (errors.length) throw new Error(errors.join('\n'))
  console.log(`check:colors: samples passed (${cases}/${cases} positive, 0 negative hits).`)
}

async function checkColors(files) {
  await checkColorSamples()
  const errors = []
  for (const file of files) {
    for (const match of file.text.matchAll(retiredColor)) errors.push(location(file, match.index, `retired color ${match[0]} is forbidden, including token sources and generated files.`))
    if (isTokenSource(file)) continue
    const scanned = file.path === 'index.html' ? { ...file, text: file.text.replace(criticalBlock, blank) } : file
    for (const hit of colorHits(scanned)) errors.push(location(file, hit.index, `color literal ${hit.value}; use T or --fai-* tokens.`))
  }
  return errors
}

function checkGlass(files) {
  const allowed = new Set(['glass-focus', 'glass-module', 'glass-drawer'])
  const errors = []
  for (const file of files.filter((file) => !isTokenSource(file))) {
    const text = code(file)
    if (file.path !== 'src/design/glass.css') {
      for (const match of text.matchAll(/\b(?:backdrop-filter|backdropFilter)\b/g)) errors.push(location(file, match.index, 'backdrop-filter is only allowed in src/design/glass.css.'))
    }
    for (const match of text.matchAll(/(?<![\w-])glass-[\w-]+/g)) {
      if (!allowed.has(match[0])) errors.push(location(file, match.index, `unregistered glass class ${match[0]}.`))
    }
  }
  return errors
}

function checkUpdown(files) {
  const errors = []
  for (const file of files.filter((file) => !isTokenSource(file))) {
    const text = code(file)
    const colorDeclarations = file.path === 'src/design/updown.css' ? styleDeclarations(file).filter(({ property }) => property === 'color') : []
    for (const match of text.matchAll(updownReference)) {
      if (!colorDeclarations.some(({ index, value }) => match.index >= index && match.index < index + value.length)) errors.push(location(file, match.index, 'updown tokens may only occur in color: values in src/design/updown.css.'))
    }
    if (!/^src\/modules\/(market-board|watchlist)\//.test(file.path) && file.path !== 'src/workbench/FocusBand.vue') {
      for (const match of text.matchAll(/\bupdown\.css\b/g)) errors.push(location(file, match.index, 'updown.css may only be imported by market-board/, watchlist/, or FocusBand.vue.'))
    }
  }
  return errors
}

function checkGrid(files) {
  const errors = []
  for (const file of files) {
    for (const { property, value, index } of styleDeclarations(file)) {
      if (property !== 'grid-template-columns') continue
      const functions = []
      for (const match of value.matchAll(/([a-z-]+)\s*\(|\)|(?<![\w.])1fr\b/gi)) {
        if (match[1]) functions.push(match[1].toLowerCase())
        else if (match[0] === ')') functions.pop()
        else if (!functions.includes('minmax')) errors.push(location(file, index + match.index, 'bare 1fr in grid-template-columns; wrap the track in minmax(0, 1fr).'))
      }
    }
  }
  return errors
}

function checkNetwork(files) {
  const errors = []
  for (const file of files) {
    if (file.path.startsWith('src/contracts/real/')) continue
    for (const match of code(file).matchAll(/\bfetch\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource|axios)\b/g)) errors.push(location(file, match.index, `${match[0]} is only allowed in src/contracts/real/.`))
  }
  return errors
}

await main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
