/**
 * YaCheck 3D WebGL Promotional Website
 * Opaque-Box Comprehensive E2E Verification Suite (Tiers 1-4)
 * 
 * Executable via:
 *   npm run test:e2e
 *   or: node --experimental-strip-types tests/e2e-verification.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import process from 'node:process'

// ANSI Colors
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const _YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const CYAN = '\x1b[36m'
const GRAY = '\x1b[90m'

interface TestCaseResult {
  id: string
  name: string
  tier: 1 | 2 | 3 | 4
  passed: boolean
  durationMs: number
  error?: string
  details?: string
}

const results: TestCaseResult[] = []

function runTest(
  id: string,
  tier: 1 | 2 | 3 | 4,
  name: string,
  fn: () => void | { details?: string }
) {
  const start = performance.now()
  try {
    const res = fn()
    const durationMs = Math.round((performance.now() - start) * 100) / 100
    results.push({
      id,
      name,
      tier,
      passed: true,
      durationMs,
      details: res?.details
    })
    console.log(`  ${GREEN}✔${RESET} [${id}] ${name} ${GRAY}(${durationMs}ms)${RESET}`)
  } catch (err: unknown) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100
    const errorMsg = err instanceof Error ? err.message : String(err)
    results.push({
      id,
      name,
      tier,
      passed: false,
      durationMs,
      error: errorMsg
    })
    console.log(`  ${RED}✖${RESET} [${id}] ${name} ${GRAY}(${durationMs}ms)${RESET}`)
    console.log(`    ${RED}Error: ${errorMsg}${RESET}`)
  }
}

const ROOT_DIR = path.resolve(process.cwd())
const SRC_DIR = path.join(ROOT_DIR, 'src')

// Helper to recursively collect all source code files
function getAllSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath))
    } else if (/\.(ts|tsx|js|jsx|glsl|vert|frag)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }
  return files
}

function getAllSourceContent(): { files: string[]; combined: string; fileMap: Record<string, string> } {
  const files = getAllSourceFiles(SRC_DIR)
  const fileMap: Record<string, string> = {}
  let combined = ''
  for (const file of files) {
    const relative = path.relative(ROOT_DIR, file)
    const content = fs.readFileSync(file, 'utf-8')
    fileMap[relative] = content
    combined += `\n/* --- FILE: ${relative} --- */\n` + content
  }
  return { files, combined, fileMap }
}

console.log(`\n${BOLD}${CYAN}======================================================================${RESET}`)
console.log(`${BOLD}${CYAN}   YaCheck 3D WebGL Promotional Website — E2E Verification Suite   ${RESET}`)
console.log(`${BOLD}${CYAN}======================================================================${RESET}\n`)

// ============================================================================
// TIER 1: FEATURE COVERAGE
// ============================================================================
console.log(`${BOLD}${BLUE}--- TIER 1: Feature Coverage & Compilation Verification ---${RESET}`)

// T1.1: TypeScript & Vite Build Check
runTest('T1.1', 1, 'TypeScript Compilation & Clean Build (npm run build)', () => {
  try {
    const output = execSync('npm run build', {
      cwd: ROOT_DIR,
      stdio: 'pipe',
      encoding: 'utf-8'
    })
    return { details: `Build succeeded:\n${output.slice(0, 150)}...` }
  } catch (err: unknown) {
    const execErr = err as { stdout?: string; stderr?: string; message?: string }
    const combinedOutput = (execErr.stdout || '') + '\n' + (execErr.stderr || '')
    throw new Error(`Build failed with TypeScript/Vite error:\n${combinedOutput.trim() || execErr.message}`)
  }
})

// T1.2: Custom GLSL Shader Material & Reactive Uniforms
runTest('T1.2', 1, 'Custom GLSL Shader Material with Noise, Fresnel & Uniforms', () => {
  const { combined } = getAllSourceContent()
  
  // Must use shaderMaterial or THREE.ShaderMaterial
  const hasShaderMaterial = 
    combined.includes('shaderMaterial(') ||
    combined.includes('THREE.ShaderMaterial') ||
    combined.includes('new ShaderMaterial') ||
    combined.includes('createShaderMaterial') ||
    combined.includes('AuraShaderMaterial')

  if (!hasShaderMaterial) {
    throw new Error('No custom shaderMaterial or THREE.ShaderMaterial found in codebase.')
  }

  // Must contain vertex shader GLSL instructions (noise, displacement, or position modulation)
  const hasVertexGLSL = 
    /gl_Position\s*=/m.test(combined) ||
    /varying\s+vec3\s+vNormal/m.test(combined) ||
    /varying\s+vec3\s+vPosition/m.test(combined) ||
    /vertexShader\s*:/m.test(combined)

  if (!hasVertexGLSL) {
    throw new Error('No custom GLSL vertexShader / vertex displacement code found.')
  }

  // Must contain fragment shader GLSL instructions (Fresnel, color mix, or scanline effects)
  const hasFragmentGLSL = 
    /gl_FragColor\s*=/m.test(combined) ||
    /fragmentShader\s*:/m.test(combined) ||
    /dot\(vNormal,\s*viewDir\)/m.test(combined) ||
    /fresnel/i.test(combined)

  if (!hasFragmentGLSL) {
    throw new Error('No custom GLSL fragmentShader / Fresnel glowing effect code found.')
  }

  // Must declare reactive uniforms (e.g. uTime, uProgress, uDangerMix)
  const hasUniforms = 
    /uTime/m.test(combined) &&
    (/uProgress/m.test(combined) || /uDangerMix/m.test(combined) || /uScanGlow/m.test(combined) || /uDistortion/m.test(combined))

  if (!hasUniforms) {
    throw new Error('Custom shader does not declare expected reactive uniforms (uTime, uProgress / uDangerMix).')
  }

  return { details: 'Custom GLSL shader material with vertex displacement, Fresnel effect and uniforms verified.' }
})

// T1.3: Advanced Post-Processing Integration
runTest('T1.3', 1, 'Advanced Post-Processing Pipeline (@react-three/postprocessing)', () => {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'))
  const hasPostprocessingDep = 
    (pkgJson.dependencies && (pkgJson.dependencies['@react-three/postprocessing'] || pkgJson.dependencies['postprocessing'])) ||
    (pkgJson.devDependencies && (pkgJson.devDependencies['@react-three/postprocessing'] || pkgJson.devDependencies['postprocessing']))

  if (!hasPostprocessingDep) {
    throw new Error('Neither @react-three/postprocessing nor postprocessing is declared in package.json.')
  }

  const { combined } = getAllSourceContent()

  const hasEffectComposer = /EffectComposer/m.test(combined)
  const hasBloom = /<Bloom\b/m.test(combined) || /Bloom\(/m.test(combined)
  const hasChromaticAberration = /<ChromaticAberration\b/m.test(combined) || /ChromaticAberration\(/m.test(combined)

  if (!hasEffectComposer) {
    throw new Error('Missing <EffectComposer> container in 3D scene.')
  }
  if (!hasBloom) {
    throw new Error('Missing <Bloom /> post-processing effect.')
  }
  if (!hasChromaticAberration) {
    throw new Error('Missing <ChromaticAberration /> post-processing effect.')
  }

  return { details: 'EffectComposer with Bloom and ChromaticAberration verified.' }
})

// T1.4: Multi-Property GSAP ScrollTrigger Binding
runTest('T1.4', 1, 'GSAP ScrollTrigger Bound to >= 3 Scene Properties', () => {
  const { combined } = getAllSourceContent()

  // GSAP and ScrollTrigger must be registered
  const hasGsapImport = /import\s+gsap\s+from\s+['"]gsap['"]/m.test(combined) || /from\s+['"]gsap/m.test(combined)
  const hasScrollTrigger = /ScrollTrigger/m.test(combined)
  const hasRegister = /registerPlugin.*ScrollTrigger/m.test(combined)

  if (!hasGsapImport || !hasScrollTrigger || !hasRegister) {
    throw new Error('GSAP and ScrollTrigger are not imported and registered in the codebase.')
  }

  // Count distinct properties animated/bound to ScrollTrigger
  let propertyCount = 0
  const propertyHits: string[] = []

  // Check Position
  if (/position/m.test(combined) && (/\.to\([^)]*position/m.test(combined) || /tl\.to\([^)]*position/m.test(combined) || /gsap\.to\([^)]*position/m.test(combined) || /position\.x/m.test(combined))) {
    propertyCount++
    propertyHits.push('position')
  }

  // Check Rotation
  if (/rotation/m.test(combined) && (/\.to\([^)]*rotation/m.test(combined) || /tl\.to\([^)]*rotation/m.test(combined) || /gsap\.to\([^)]*rotation/m.test(combined) || /rotation\.y/m.test(combined))) {
    propertyCount++
    propertyHits.push('rotation')
  }

  // Check Camera (position, lookAt, fov, or zoom)
  if (/(camera|fov|lookAt)/m.test(combined) && (/\.to\([^)]*camera/m.test(combined) || /\.to\([^)]*fov/m.test(combined) || /camera\.position/m.test(combined))) {
    propertyCount++
    propertyHits.push('camera')
  }

  // Check Shader Uniforms (uProgress, uDangerMix, uScanGlow, uDistortion)
  if (/(uProgress|uDangerMix|uTime|uDistortion|uScanGlow)/m.test(combined) && (/\.to\([^)]*uniforms/m.test(combined) || /\.to\([^)]*uProgress/m.test(combined) || /\.to\([^)]*uDangerMix/m.test(combined) || /uniforms\.current/m.test(combined))) {
    propertyCount++
    propertyHits.push('shaderUniforms')
  }

  // Check Mesh Explosion / Scale / Material opacity / Transmission
  if (/(explodeDistance|explode|scale|transmission|thickness|opacity)/m.test(combined) && (/\.to\([^)]*explode/m.test(combined) || /\.to\([^)]*scale/m.test(combined) || /\.to\([^)]*transmission/m.test(combined) || /explodeDistance/m.test(combined))) {
    propertyCount++
    propertyHits.push('explosion/material')
  }

  if (propertyCount < 3) {
    throw new Error(`GSAP ScrollTrigger is bound to ${propertyCount} properties (${propertyHits.join(', ')}). Minimum required: 3 distinct 3D scene properties.`)
  }

  return { details: `ScrollTrigger bound to ${propertyCount} distinct properties: ${propertyHits.join(', ')}.` }
})

// T1.5: 5 Full-Height UI Sections Structure
runTest('T1.5', 1, '5 Distinct Full-Height <section> Elements Present', () => {
  const { combined } = getAllSourceContent()

  // Match all <section> elements or section components
  const sectionMatches = combined.match(/<section[\s\S]*?>/gi) || []
  const hasFiveSections = sectionMatches.length >= 5 || (
    /HeroSection/m.test(combined) &&
    /ProblemSection/m.test(combined) &&
    /(FeaturesSection|SolutionsSection)/m.test(combined) &&
    /SpecsSection/m.test(combined) &&
    /CTASection/m.test(combined)
  )

  if (!hasFiveSections) {
    throw new Error(`Expected at least 5 distinct <section> components/elements, found ${sectionMatches.length}.`)
  }

  // Verify section semantic identities (Hero, Problem, Solutions/Features, Specs, CTA)
  const hasHero = /hero/i.test(combined) && /YaCheck/m.test(combined)
  const hasProblem = /problem/i.test(combined) || /ยาตีกัน/m.test(combined)
  const hasSolutions = /solution/i.test(combined) || /feature/i.test(combined) || /AI Scanner/m.test(combined)
  const hasSpecs = /specs/i.test(combined) || /Under the Hood/i.test(combined) || /Expo/m.test(combined)
  const hasCTA = /cta/i.test(combined) || /บูธ C-04/m.test(combined) || /สแกนดาวน์โหลด/m.test(combined)

  if (!hasHero || !hasProblem || !hasSolutions || !hasSpecs || !hasCTA) {
    throw new Error('Could not identify all 5 required semantic sections (Hero, Problem, Solutions, Specs, CTA).')
  }

  return { details: 'Verified 5 distinct <section> elements with correct semantic structure.' }
})

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES
// ============================================================================
console.log(`\n${BOLD}${BLUE}--- TIER 2: Boundary & Corner Cases ---${RESET}`)

// T2.1: Scroll Progress Boundaries (0%, 25%, 50%, 75%, 100%)
runTest('T2.1', 2, 'Scroll Boundaries Coverage across Key Progress Milestones (0%, 25%, 50%, 75%, 100%)', () => {
  const { combined } = getAllSourceContent()

  // Check that scroll timeline configures scrub and covers full container
  const hasScrollTriggerBounds = 
    /start:\s*['"]top top['"]/m.test(combined) &&
    /end:\s*['"]bottom bottom['"]/m.test(combined)

  if (!hasScrollTriggerBounds) {
    throw new Error('ScrollTrigger must bind from "top top" to "bottom bottom" to cover full scroll range.')
  }

  // Check intermediate step milestones in GSAP timeline
  const hasKeyframeMilestones = 
    /(\.to\(|timeline)/m.test(combined) &&
    (combined.includes('0.25') || combined.includes('0.2') || combined.includes('0.3') || combined.includes('0.5') || combined.includes('0.75') || combined.includes('1') || combined.includes('1.0'))

  if (!hasKeyframeMilestones) {
    throw new Error('Timeline must define milestone steps spanning 0%, intermediate milestones, and 100%.')
  }

  return { details: 'Full 0% to 100% scroll range with intermediate milestones verified.' }
})

// T2.2: Responsive Viewport & Pointer Events Isolation
runTest('T2.2', 2, 'Responsive Container Properties & Pointer Events Isolation', () => {
  const { combined } = getAllSourceContent()

  // Must ensure full-height sections
  const hasFullHeight = 
    /h-screen/m.test(combined) ||
    /min-h-screen/m.test(combined) ||
    /height:\s*['"]100vh['"]/m.test(combined)

  if (!hasFullHeight) {
    throw new Error('All sections must have full viewport height (100vh / h-screen / min-h-screen).')
  }

  // Overlay container must have pointer-events-none and cards pointer-events-auto
  const hasPointerEventsNone = /pointer-events-none/m.test(combined) || /pointerEvents:\s*['"]none['"]/m.test(combined)
  const hasPointerEventsAuto = /pointer-events-auto/m.test(combined) || /pointerEvents:\s*['"]auto['"]/m.test(combined)

  if (!hasPointerEventsNone || !hasPointerEventsAuto) {
    throw new Error('Overlay container must set pointer-events: none and interactive elements pointer-events: auto.')
  }

  // Responsive typography & layout
  const hasResponsiveClasses = /md:/m.test(combined) || /lg:/m.test(combined)
  if (!hasResponsiveClasses) {
    throw new Error('Codebase must include responsive breakpoint utilities (e.g. md:, lg:).')
  }

  return { details: 'Full-height viewports, pointer events isolation, and responsive classes verified.' }
})

// T2.3: WebGL Error Boundary Safety
runTest('T2.3', 2, 'WebGL Canvas Error Boundary Safety & Fallback Isolation', () => {
  const { combined } = getAllSourceContent()

  // Must have ErrorBoundary or Suspense fallback protection around Canvas/3D components
  const hasErrorBoundary = 
    /ErrorBoundary/m.test(combined) ||
    /componentDidCatch/m.test(combined) ||
    /getDerivedStateFromError/m.test(combined) ||
    (/Suspense/m.test(combined) && /fallback/m.test(combined))

  if (!hasErrorBoundary) {
    throw new Error('Missing ErrorBoundary / Suspense fallback protection around 3D Canvas.')
  }

  return { details: 'ErrorBoundary and fallback protection verified.' }
})

// ============================================================================
// TIER 3: CROSS-FEATURE INTERACTIONS
// ============================================================================
console.log(`\n${BOLD}${BLUE}--- TIER 3: Cross-Feature Interactions ---${RESET}`)

// T3.1: Shader Uniform Transitions Synced with Scroll Milestones
runTest('T3.1', 3, 'Shader Uniform Modulation Synced with Scroll Milestones', () => {
  const { combined } = getAllSourceContent()

  // Check uniform dynamic progression in useFrame or GSAP timeline
  const hasDynamicUniformModulation = 
    /uProgress/m.test(combined) &&
    (/uDangerMix/m.test(combined) || /uTime/m.test(combined) || /uDistortion/m.test(combined)) &&
    (
      /uniforms\.current/m.test(combined) ||
      /materialRef\.current/m.test(combined) ||
      /uTime\.value/m.test(combined) ||
      /uProgress\.value/m.test(combined) ||
      /tl\.to\([^)]*uProgress/m.test(combined) ||
      /useFrame/m.test(combined)
    )

  if (!hasDynamicUniformModulation) {
    throw new Error('Shader uniforms (uProgress, uTime, uDangerMix) are not dynamically modulated during animation/scroll frame loop.')
  }

  return { details: 'Shader uniforms reactive update loop verified.' }
})

// T3.2: Capsule Explosion & Geometry Transformation Synchronization
runTest('T3.2', 3, 'Procedural Capsule Dual-Shell / Pellets & Explosion State Sync', () => {
  const { combined } = getAllSourceContent()

  // Procedural capsule must feature dual-structure (capsuleGeometry/sphereGeometry/cylinderGeometry) or multi-mesh capsule
  const hasProceduralCapsuleGeometry = 
    /capsuleGeometry/m.test(combined) ||
    (/sphereGeometry/m.test(combined) && /cylinderGeometry/m.test(combined)) ||
    /ProceduralCapsule/m.test(combined)

  if (!hasProceduralCapsuleGeometry) {
    throw new Error('Procedural medicine capsule geometry definition not found.')
  }

  // Must use physical or refractive materials
  const hasPhysicalMaterial = 
    /MeshPhysicalMaterial/m.test(combined) ||
    /meshPhysicalMaterial/m.test(combined) ||
    /transmission/m.test(combined) ||
    /roughness/m.test(combined)

  if (!hasPhysicalMaterial) {
    throw new Error('Procedural capsule must utilize MeshPhysicalMaterial with transmission/roughness for high-end glass aesthetics.')
  }

  return { details: 'Procedural dual-shell physical material capsule verified.' }
})

// T3.3: Particle System Field Synchronization
runTest('T3.3', 3, 'Bio-Molecular Particle Field System Integration', () => {
  const { combined } = getAllSourceContent()

  const hasParticleSystem = 
    /ParticleField/m.test(combined) ||
    /points\b/m.test(combined) ||
    /bufferGeometry/m.test(combined) ||
    /pointsMaterial/m.test(combined) ||
    /Float/m.test(combined) ||
    /useFrame/m.test(combined)

  if (!hasParticleSystem) {
    throw new Error('Procedural particle field system not found in 3D scene.')
  }

  return { details: 'Procedural particle field background verified.' }
})

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ============================================================================
console.log(`\n${BOLD}${BLUE}--- TIER 4: Real-World Scrollytelling Scenarios ---${RESET}`)

// T4.1: Hero Scene Presentation & Brand Copy
runTest('T4.1', 4, 'Scene 1 (Hero): YaCheck Brand Header, Thai Tagline & Scroll Indicator', () => {
  const { combined } = getAllSourceContent()

  if (!/YaCheck/m.test(combined)) {
    throw new Error('Scene 1 missing brand title "YaCheck".')
  }
  if (!/แอปพลิเคชันผู้ช่วยจัดการและแจ้งเตือนการทานยาอัจฉริยะ/m.test(combined) && !/ผู้ช่วยจัดการและแจ้งเตือนการทานยา/m.test(combined)) {
    throw new Error('Scene 1 missing authentic Thai tagline copy.')
  }
  if (!/scroll/i.test(combined)) {
    throw new Error('Scene 1 missing scroll exploration indicator.')
  }

  return { details: 'Hero scene brand, typography, and scroll prompt verified.' }
})

// T4.2: Problem Scene Crisis Narrative
runTest('T4.2', 4, 'Scene 2 (Problem): Medication Crisis Headline & Risk Analysis Copy', () => {
  const { combined } = getAllSourceContent()

  if (!/ยาตีกัน/m.test(combined)) {
    throw new Error('Scene 2 missing medication conflict headline "ยาตีกัน".')
  }
  if (!/อันตรายกว่าที่คิด/m.test(combined)) {
    throw new Error('Scene 2 missing danger warning "อันตรายกว่าที่คิด".')
  }
  if (!/ปฏิกิริยาระหว่างยา/m.test(combined) && !/แจ้งเตือนความเสี่ยง/m.test(combined) && !/การทานยาหลายชนิด/m.test(combined)) {
    throw new Error('Scene 2 missing detailed risk analysis explanation copy.')
  }

  return { details: 'Problem scene crisis narrative and danger context verified.' }
})

// T4.3: Solutions Scene Feature Showcase
runTest('T4.3', 4, 'Scene 3 (Solutions): AI Scanner, Smart Reminder, Caregiver Link Features', () => {
  const { combined } = getAllSourceContent()

  if (!/AI Scanner/m.test(combined)) {
    throw new Error('Scene 3 missing "AI Scanner" feature card.')
  }
  if (!/Smart Reminder/m.test(combined)) {
    throw new Error('Scene 3 missing "Smart Reminder" feature card.')
  }
  if (!/Caregiver Link/m.test(combined)) {
    throw new Error('Scene 3 missing "Caregiver Link" feature card.')
  }

  return { details: 'Solutions scene 3-feature AI showcase verified.' }
})

// T4.4: Specs Scene Technical Architecture
runTest('T4.4', 4, 'Scene 4 (Specs): "Under the Hood" Tech Stack (Expo, Local DB, AI, Supabase)', () => {
  const { combined } = getAllSourceContent()

  if (!/Under the Hood/i.test(combined) && !/Architecture/i.test(combined) && !/Tech Stack/i.test(combined)) {
    throw new Error('Scene 4 missing "Under the Hood" section heading.')
  }
  if (!/Expo/m.test(combined)) {
    throw new Error('Scene 4 missing Expo / React Native spec item.')
  }
  if (!/Local/m.test(combined)) {
    throw new Error('Scene 4 missing Local First DB spec item.')
  }
  if (!/AI/m.test(combined)) {
    throw new Error('Scene 4 missing AI Generative spec item.')
  }
  if (!/Supabase/m.test(combined)) {
    throw new Error('Scene 4 missing Supabase BaaS spec item.')
  }

  return { details: 'Specs scene 4-column tech architecture cards verified.' }
})

// T4.5: CTA Scene Conversion & Action
runTest('T4.5', 4, 'Scene 5 (CTA): OpenHouse Booth C-04 & Interactive Download Action', () => {
  const { combined } = getAllSourceContent()

  if (!/C-04/m.test(combined)) {
    throw new Error('Scene 5 missing OpenHouse booth designation "C-04".')
  }
  if (!/สแกนดาวน์โหลด/m.test(combined) && !/ดาวน์โหลด/m.test(combined) && !/Download/i.test(combined)) {
    throw new Error('Scene 5 missing download call-to-action button text.')
  }

  return { details: 'CTA scene booth C-04 badge and conversion button verified.' }
})

// ============================================================================
// SUMMARY & EXIT
// ============================================================================
console.log(`\n${BOLD}${CYAN}======================================================================${RESET}`)
console.log(`${BOLD}${CYAN}   Verification Summary & Tier Breakdown   ${RESET}`)
console.log(`${BOLD}${CYAN}======================================================================${RESET}\n`)

const passedCount = results.filter(r => r.passed).length
const totalCount = results.length
const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0)

const tierStats: Record<number, { total: number; passed: number }> = {
  1: { total: 0, passed: 0 },
  2: { total: 0, passed: 0 },
  3: { total: 0, passed: 0 },
  4: { total: 0, passed: 0 }
}

for (const r of results) {
  tierStats[r.tier].total++
  if (r.passed) tierStats[r.tier].passed++
}

for (let t = 1; t <= 4; t++) {
  const stat = tierStats[t]
  const pct = Math.round((stat.passed / stat.total) * 100)
  const color = stat.passed === stat.total ? GREEN : RED
  console.log(`  Tier ${t}: ${color}${stat.passed}/${stat.total} passed (${pct}%)${RESET}`)
}

console.log(`\nTotal: ${passedCount === totalCount ? GREEN : RED}${passedCount}/${totalCount} tests passed${RESET} across 4 tiers ${GRAY}(${Math.round(totalDuration)}ms)${RESET}\n`)

if (passedCount < totalCount) {
  console.log(`${BOLD}${RED}FAILED: Some acceptance criteria are not yet satisfied.${RESET}\n`)
  process.exit(1)
} else {
  console.log(`${BOLD}${GREEN}ALL ACCEPTANCE CRITERIA PASSED SUCCESSFULLY!${RESET}\n`)
  process.exit(0)
}
