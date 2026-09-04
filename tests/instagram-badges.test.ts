import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT_DIR = path.resolve(process.cwd())
const teamSectionPath = path.join(ROOT_DIR, 'src/components/ui/TeamSection.tsx')
const content = fs.readFileSync(teamSectionPath, 'utf-8')

console.log('=== Instagram Contact Badges Test Suite ===\n')

let passed = 0
let failed = 0

function test(description: string, fn: () => void) {
  try {
    fn()
    console.log(`✔ PASS: ${description}`)
    passed++
  } catch (err: any) {
    console.error(`✖ FAIL: ${description}\n  Error: ${err.message}`)
    failed++
  }
}

// 1. All 4 members with exact handles and URLs
test('All 4 team members have exact Instagram handles and URLs defined', () => {
  const members = [
    { nickname: 'Jame', handle: '@jamemm__', url: 'https://www.instagram.com/jamemm__/' },
    { nickname: 'Boom', handle: '@l3oom.x', url: 'https://www.instagram.com/l3oom.x/' },
    { nickname: 'Meth', handle: '@thanamethawat', url: 'https://www.instagram.com/thanamethawat/' },
    { nickname: 'Phill', handle: '@seventy.morning', url: 'https://www.instagram.com/seventy.morning/' },
  ]

  for (const m of members) {
    if (!content.includes(`nickname: '${m.nickname}'`)) {
      throw new Error(`Missing nickname ${m.nickname}`)
    }
    if (!content.includes(`handle: '${m.handle}'`)) {
      throw new Error(`Missing handle ${m.handle}`)
    }
    if (!content.includes(`instagram: '${m.url}'`)) {
      throw new Error(`Missing URL ${m.url}`)
    }
  }
})

// 2. Element hierarchy: directly under member.nameEN
test('Pill badge is placed directly beneath member.nameEN in JSX', () => {
  const nameEnIndex = content.indexOf('{member.nameEN}')
  const badgeAnchorIndex = content.indexOf('href={member.instagram}', nameEnIndex)
  if (nameEnIndex === -1 || badgeAnchorIndex === -1) {
    throw new Error('Could not find nameEN or badge anchor tag')
  }
  const slice = content.slice(nameEnIndex, badgeAnchorIndex)
  if (slice.includes('{member.nameTH}') || slice.includes('Project Advisor')) {
    throw new Error('Badge is not placed directly beneath nameEN')
  }
})

// 3. Security & navigation attributes
test('Badge anchor contains target="_blank" and rel="noopener noreferrer"', () => {
  if (!content.includes('target="_blank"')) {
    throw new Error('Missing target="_blank"')
  }
  if (!content.includes('rel="noopener noreferrer"')) {
    throw new Error('Missing rel="noopener noreferrer"')
  }
})

// 4. Accessibility attributes
test('Badge anchor and SVG contain complete accessibility attributes', () => {
  if (!content.includes('aria-label={`Follow ${member.nickname} (${member.handle}) on Instagram (opens in a new tab)`}')) {
    throw new Error('Missing descriptive aria-label on anchor tag')
  }
  if (!content.includes('aria-hidden="true"')) {
    throw new Error('Missing aria-hidden="true" on decorative SVG')
  }
  if (!content.includes('focusable="false"')) {
    throw new Error('Missing focusable="false" on SVG')
  }
  if (!content.includes('title={`Follow ${member.nickname} (${member.handle}) on Instagram`}')) {
    throw new Error('Missing title tooltip on anchor tag')
  }
  if (!content.includes('focus-visible:ring-2')) {
    throw new Error('Missing keyboard focus visible ring indicator')
  }
  if (!content.includes('group-focus/badge:text-[#17211f]') && !content.includes('group-focus-visible/badge:text-[#17211f]')) {
    throw new Error('SVG missing keyboard focus color synchronization')
  }
  if (!content.includes('group-active/badge:text-[#17211f]')) {
    throw new Error('SVG missing active/tap press color synchronization')
  }
})

// 5. Visual Contrast & Design Tokens
test('Design tokens match high-contrast and responsive specifications', () => {
  const tokens = [
    'bg-[#f6f8f7]',
    'border-[#dde5e2]',
    'text-[#216e63]',
    'hover:text-[#17211f]',
    'active:text-[#17211f]',
    'rounded-full',
    'inline-flex',
    'whitespace-nowrap',
    'touch-manipulation',
    'select-none',
    'scroll-mt-24'
  ]
  for (const token of tokens) {
    if (!content.includes(token)) {
      throw new Error(`Missing expected design class/token: ${token}`)
    }
  }
})

// 6. WCAG 2.1 Contrast Calculation
test('WCAG 2.1 AA/AAA Contrast Ratio Verification', () => {
  function luminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }
  function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  function contrast(h1: string, h2: string) {
    const l1 = luminance(...hexToRgb(h1))
    const l2 = luminance(...hexToRgb(h2))
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  const normalContrast = contrast('#216e63', '#f6f8f7')
  const hoverContrast = contrast('#17211f', '#eaf1ee')

  if (normalContrast < 4.5) {
    throw new Error(`Normal text contrast ${normalContrast.toFixed(2)} is below WCAG AA 4.5:1`)
  }
  if (hoverContrast < 7.0) {
    throw new Error(`Hover text contrast ${hoverContrast.toFixed(2)} is below WCAG AAA 7.0:1`)
  }
})

// 7. Event propagation safety
test('Click event handler stops propagation for webview compatibility', () => {
  if (!content.includes('e.stopPropagation()')) {
    throw new Error('Missing stopPropagation on badge click')
  }
})

// 8. Bundle verification
test('Production bundle contains all 4 Instagram handles and links', () => {
  const distDir = path.join(ROOT_DIR, 'dist/assets')
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/assets does not exist; run npm run build first')
  }
  const jsFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.js'))
  let combinedJs = ''
  for (const f of jsFiles) {
    combinedJs += fs.readFileSync(path.join(distDir, f), 'utf-8')
  }

  const handles = ['@jamemm__', '@l3oom.x', '@thanamethawat', '@seventy.morning']
  for (const h of handles) {
    if (!combinedJs.includes(h)) {
      throw new Error(`Handle ${h} not found in compiled production bundle`)
    }
  }

  const urls = [
    'https://www.instagram.com/jamemm__/',
    'https://www.instagram.com/l3oom.x/',
    'https://www.instagram.com/thanamethawat/',
    'https://www.instagram.com/seventy.morning/'
  ]
  for (const u of urls) {
    if (!combinedJs.includes(u)) {
      throw new Error(`URL ${u} not found in compiled production bundle`)
    }
  }
})

console.log(`\nResults: ${passed} passed, ${failed} failed.`)
if (failed > 0) {
  process.exit(1)
} else {
  console.log('All Instagram Contact Badges verification checks passed successfully!')
  process.exit(0)
}
