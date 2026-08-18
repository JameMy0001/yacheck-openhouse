# YaCheck 3D Promotional Website — Specification & Requirement Analysis

**Document Version**: 1.0.0  
**Authoritative Source**: `/Users/mac/Desktop/OpenHouse-3D/.agents/ORIGINAL_REQUEST.md`  
**Target Application**: YaCheck — AI-Powered Medication Management WebGL Promotional Site  
**Framework Stack**: React 19, React Three Fiber (v9), Three.js (r185), @react-three/drei, @react-three/postprocessing, GSAP 3 (ScrollTrigger), Tailwind CSS v4, Vite 8, TypeScript 6  

---

## 1. Executive Summary & Objective

The objective is to build an **"Awwwards-style" 3D WebGL promotional website** for **YaCheck** (an AI-powered medication management application). Because no pre-rendered or external 3D CAD/glTF models are provided, all 3D assets must be **generated procedurally via code** using React Three Fiber, custom GLSL shaders, procedural geometries, and advanced physical/refractive materials. The experience is driven by a seamless **GSAP ScrollTrigger scrollytelling architecture** across **5 distinct full-height sections**.

---

## 2. Core Requirements Decomposition

### R1. Awwwards-Level Procedural 3D Visuals
- **Procedural Generation**: All 3D objects (capsules, pills, molecular/cellular nodes, bio-scanner rings, data particles) must be procedurally generated via Three.js geometries/buffers without external `.gltf`/`.glb` dependencies.
- **Custom Shaders**: Implement at least one custom GLSL shader (via `shaderMaterial`, `THREE.ShaderMaterial`, or `onBeforeCompile`) driving dynamic visual effects (e.g., iridescent membrane, glowing warning aura, drug interaction dispersion, holographic grid).
- **Physical & Refractive Materials**: Utilize `MeshPhysicalMaterial` or custom glass/subsurface scattering materials featuring transmission, roughness, metalness, clearcoat, and dispersion for photorealistic tactile medicine rendering.
- **Particle Systems**: High-density floating bio-particles, risk-indicator particle clouds, and ambient floating dust with mathematical wave motion.
- **Desktop Visual Impact**: Optimized for desktop viewports (1920x1080, 1440x900, 2560x1440) delivering continuous 60fps rendering with dynamic lighting and shadow play.

### R2. Smooth Scrollytelling Architecture
- **GSAP ScrollTrigger Engine**: Centralized GSAP timeline synchronized to page scroll progress with smooth scrubbing (`scrub: 1` or `scrub: true`).
- **Multi-Property 3D Binding**: ScrollTrigger must actively bind to and mutate at least **3 distinct categories/properties** of the 3D scene:
  1. *Spatial Transforms*: Mesh positions $(x, y, z)$, rotations $(\theta_x, \theta_y, \theta_z)$, and scales.
  2. *Camera Dynamics*: Camera position, focal target / lookAt vectors, and FOV transitions.
  3. *Shader & Material Uniforms*: Uniform values (e.g., `uProgress`, `uDispersion`, `uInteractionRisk`, `uColorMix`, `uTime`).
- **Scene State Transitions**: Seamless morphological transitions between the 5 stages as the user scrolls forwards and backwards.

### R3. Complete 5-Scene Implementation
- **Full-Height Sections**: 5 distinct `<section>` DOM elements, each occupying `100vh` / `min-h-screen`.
- **Futuristic Tailwind CSS UI**: Glassmorphic panels (`backdrop-blur-xl`, `bg-white/10` or `bg-black/40`, subtle glowing borders), high-contrast modern typography, glowing badges, and responsive layout.
- **Layering & Interaction Model**: Canvas fixed in the background (`z-0`, `fixed inset-0`), HTML overlay floating above (`z-10`, `relative`, `pointer-events-none` on wrappers, `pointer-events-auto` on text cards and interactive buttons).

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R1: Visuals | Procedural Dual-Tone Medical Capsule | 3D capsule geometry composed of two distinct halves with custom glass/plastic physical materials | Geometry args (radius, length, segments), physical material props | Procedural 3D mesh rendered on WebGL canvas | Graceful fallback to basic geometry if WebGL context is constrained | ORIGINAL_REQUEST.md & `src/App.tsx` |
| 2 | R1: Visuals | Custom GLSL Shader Material | Custom vertex & fragment shaders controlling surface iridescence, risk aura, or wave distortion | Uniforms (`uTime`, `uProgress`, `uRiskLevel`, `uColorA`, `uColorB`) | Dynamic per-pixel shader animation | Shader compilation error caught during Vite build; fallback to default material | ORIGINAL_REQUEST.md (§ Acceptance Criteria) |
| 3 | R1: Visuals | Procedural Bio-Particle Cloud | Ambient floating particulate field representing molecular bio-chemistry / active ingredients | Point count (e.g., 500-2000), position buffer attribute, point size | Glowing particle swarm with turbulence math | Performance throttling / clamped particle count on low-end GPUs | ORIGINAL_REQUEST.md (§ R1) |
| 4 | R1: Visuals | Post-Processing Pipeline | Screen-space post-effects using `@react-three/postprocessing` (Bloom, Chromatic Aberration, Vignette, Noise) | Canvas scene buffer, bloom luminance thresholds, aberration offset | High-end cinematic post-processed output | Disabled or bypassed if WebGL extension unavailable | ORIGINAL_REQUEST.md (§ Acceptance Criteria) |
| 5 | R2: Scrollytelling | GSAP ScrollTrigger Master Timeline | Unified scroll controller binding document scroll to 3D scene state | Scroll container element, trigger points, scrub smoothing factor | Time-scrubbed animation timeline | Cleanup/kill listeners on unmount to prevent memory leaks | ORIGINAL_REQUEST.md (§ R2 & Acceptance Criteria) |
| 6 | R2: Scrollytelling | Camera Trajectory Interpolation | Dynamic camera dolly, tilt, and pan tied to section milestones | Scroll progress normalized [0, 1] | Interpolated `camera.position` and `camera.lookAt` coordinates | Clamped bounds to prevent out-of-frustum camera flips | ORIGINAL_REQUEST.md (§ R2 & Acceptance Criteria) |
| 7 | R2: Scrollytelling | 3D Mesh Mutation & Explosion/Reassembly | Procedural elements split, rotate, morph, or assemble based on scroll stage | Normalized section offsets | Position/rotation/scale transitions per mesh component | Interpolation clamping between scene boundaries | ORIGINAL_REQUEST.md (§ R2) |
| 8 | R3: Content | Scene 1: Hero Section | Landing screen with bold YaCheck branding, value proposition, and animated scroll indicator | Title copy, subtitle copy, scroll indicator markup | Full-screen hero section (`100vh`) with animated CTA | Text wraps gracefully on smaller desktop viewports | ORIGINAL_REQUEST.md (§ R3 & Acceptance Criteria) |
| 9 | R3: Content | Scene 2: Problem Statement | Pain point presentation highlighting dangerous drug-drug & drug-food interactions | Thai warning headline, explanatory paragraph, danger accents | Full-screen left-aligned problem statement section (`100vh`) | Responsive text box bounding | ORIGINAL_REQUEST.md (§ R3 & `src/App.tsx`) |
| 10 | R3: Content | Scene 3: Core Smart Features | 3-pillar feature breakdown: AI Scanner, Smart Reminder, Caregiver Link | Feature items list with emoji/icons and descriptions | Full-screen right-aligned features section (`100vh`) | Vertical stacking on constrained viewports | ORIGINAL_REQUEST.md (§ R3 & `src/App.tsx`) |
| 11 | R3: Content | Scene 4: Specs (Under the Hood) | Glassmorphic technical architecture grid (Expo, Local-First DB, Generative AI, Supabase) | Tech stack specs cards (title, subtitle, badge) | Centered glassmorphic container (`100vh`) with 4-grid layout | Responsive grid wraps (2x2 on tablet, 4x1 on desktop) | ORIGINAL_REQUEST.md (§ R3 & `src/App.tsx`) |
| 12 | R3: Content | Scene 5: Exhibition CTA | Exhibition booth details (Booth C-04, Health Tech) with interactive download button | CTA header, location copy, button label & hover triggers | Centered high-conversion CTA section (`100vh`) with glowing button | Fallback click handler / console log | ORIGINAL_REQUEST.md (§ R3 & `src/App.tsx`) |
| 13 | Build / Tooling | Zero-Error TypeScript Compilation | Full strict TypeScript typing across all React components, Three.js refs, and shader uniforms | `npm run build` (`tsc -b && vite build`) | Production-ready optimized bundle in `/dist` | TypeScript compiler aborts on type mismatch or undefined refs | ORIGINAL_REQUEST.md (§ Acceptance Criteria) |
| 14 | Architecture | Layered Event & Pointer Passthrough | Multi-layered pointer events architecture enabling smooth canvas mouse hover while keeping HTML interactive | CSS pointer-events rules (`none` on containers, `auto` on cards/buttons) | Seamless scroll and click events across 3D canvas and DOM | Prevents DOM overlay from blocking WebGL orbit/canvas interactions | ORIGINAL_REQUEST.md (§ R3) |

---

## 4. Edge Cases & Boundary Conditions

| # | Feature | Input / Scenario | Observed / Required Behavior |
|---|---------|------------------|------------------------------|
| 1 | GSAP ScrollTrigger | Rapid bidirectional scrolling (wheel fling) | ScrollTrigger scrub (`scrub: 1` or `scrub: true`) smoothly catches up without jumping, glitching, or desynchronizing 3D transformations. |
| 2 | Component Lifecycle | React StrictMode / Fast Refresh re-mounts | All GSAP ScrollTriggers and timelines must be properly cleaned up via `timeline.kill()` and `ScrollTrigger.kill()` to prevent duplicate listeners or phantom tweens. |
| 3 | WebGL Context Loss | High GPU memory pressure or device sleep/resume | R3F handles WebGL context restoration gracefully without crashing the UI thread. |
| 4 | Responsive Viewports | Ultra-wide (21:9 / 3840x1600) vs standard laptop (1366x768) | Full-height `100vh` sections adapt typography and padding; 3D camera aspect ratio automatically updates via R3F Canvas resize listener. |
| 5 | Post-Processing Dependency | Missing `@react-three/postprocessing` in `package.json` | Dependency must be installed and properly configured; package version must be compatible with Three.js r185 and React 19. |
| 6 | Custom Shader Precision | Varied GPU precision support (`highp` vs `mediump` float) | Shader definitions should declare standard precision and avoid platform-specific GLSL extensions. |
| 7 | DOM Overlay Accessibility | Interactive buttons inside `pointer-events-none` container | Interactive elements (buttons, links, glass cards) must explicitly set `pointer-events-auto` and `cursor-pointer` to maintain full accessibility and clickability. |

---

## 5. Detailed Copy & Content Requirements for the 5 Scenes

### Scene 1: Hero Section
- **DOM Container**: `<section className="h-screen w-full flex flex-col items-center justify-center ...">`
- **Primary Headline**: `YaCheck` (Bold, uppercase, glowing gradient styling, e.g. text-7xl md:text-9xl).
- **Tagline / Subtitle**: `แอปพลิเคชันผู้ช่วยจัดการและแจ้งเตือนการทานยาอัจฉริยะ` (Intelligent Medication Management & Reminder Assistant).
- **Secondary CTA / Scroll Prompt**: `Scroll to explore` with animated bouncing indicator line.
- **Visual Motif**: Pristine procedural medicine capsule floating in zero-gravity with subtle ambient rotation and glowing bio-light.

### Scene 2: Problem Statement Section
- **DOM Container**: `<section className="h-screen w-full flex items-center ... pl-[10%]">`
- **Headline**: `ยาตีกัน...` `<br/>` `<span className="text-red-400">อันตรายกว่าที่คิด</span>` (Drug Interactions... More Dangerous Than You Think).
- **Body Content**: `การทานยาหลายชนิดร่วมกัน อาจเกิดปฏิกิริยาระหว่างยา อาหาร สมุนไพร หรือแม้แต่โรคประจำตัวของคุณ YaCheck จะช่วยวิเคราะห์และแจ้งเตือนความเสี่ยงเหล่านี้อย่างแม่นยำ`
- **Design Aesthetic**: Left-aligned card with warning/danger aura, high-contrast readable text over dark background.
- **Visual Motif**: The 3D capsule or molecular structure enters an unstable/turbulent state (e.g., custom warning shader dispersion, red/amber pulse, splitting geometry).

### Scene 3: Core Features Section
- **DOM Container**: `<section className="h-screen w-full flex items-center justify-end ... pr-[10%]">`
- **Headline**: `ฟีเจอร์อัจฉริยะ` (Smart AI Features).
- **Feature Pillars**:
  1. 📸 **AI Scanner**: `สแกนและระบุชนิดยาด้วย Generative AI` (Scan and recognize pills/prescriptions via Generative AI).
  2. ⏰ **Smart Reminder**: `แจ้งเตือนเวลาทานยาไม่ให้พลาด` (Predictive scheduling and timely dosage alarms).
  3. 👨‍👩‍👧‍👦 **Caregiver Link**: `แชร์ข้อมูลสุขภาพให้คนในครอบครัวดูแลได้` (Sync medication adherence with family and healthcare providers).
- **Design Aesthetic**: Right-aligned glassmorphic list, glowing cyan/blue feature badges.
- **Visual Motif**: 3D elements deconstruct or enter scan/holographic mode with scanner beam rings or focus highlights.

### Scene 4: Specs / Technical Architecture Section
- **DOM Container**: `<section className="h-screen w-full flex items-center justify-center ...">`
- **Container Styling**: Centered glassmorphic card (`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12`).
- **Headline**: `Under the Hood` (or `สถาปัตยกรรมระบบ`).
- **Specification Grid (4 Columns)**:
  1. **Card 1**: `Expo` — `React Native` (Cross-platform native mobile foundation).
  2. **Card 2**: `Local` — `First DB` (Offline-first encrypted local storage for privacy).
  3. **Card 3**: `AI` — `Generative` (Multi-modal vision and drug interaction AI).
  4. **Card 4**: `BaaS` — `Supabase` (Real-time sync, secure authentication, and Postgres backend).
- **Visual Motif**: 3D visualization transitions into a structural wireframe / network node matrix demonstrating systemic coherence.

### Scene 5: Exhibition CTA Section
- **DOM Container**: `<section className="h-screen w-full flex flex-col items-center justify-center ...">`
- **Headline**: `ทดลองใช้งาน YaCheck` (Experience YaCheck).
- **Location Subtitle**: `พบพวกเราได้ที่บูธ C-04 โซน Health Tech` (Visit Booth C-04, Health Tech Zone).
- **Primary Action Button**: `สแกนดาวน์โหลดแอป` (Scan & Download App) styled with `bg-blue-500 hover:bg-blue-400 text-white font-bold text-xl rounded-full px-10 py-5 shadow-[0_0_25px_rgba(59,130,246,0.6)] cursor-pointer transition-all`.
- **Visual Motif**: Re-assembled, fully illuminated hero pill/emblem with radiant bloom aura and celebratory particle convergence.

---

## 6. Concrete Acceptance Test Conditions Matrix

| Acceptance Criterion | Verification Method | Pass Threshold | Automated Test Script / Command |
|---|---|---|---|
| **AC-1: TypeScript Compilation & Clean Build** | Compile the entire project with TypeScript compiler and Vite bundler. | Zero TypeScript compiler errors (`tsc -b`), zero build bundling errors, clean output in `/dist`. | `npm run build` |
| **AC-2: Custom GLSL Shader Implementation** | Codebase inspection and runtime check for custom shader code (`shaderMaterial`, `THREE.ShaderMaterial`, or GLSL fragment/vertex code). | Code contains at least 1 custom shader with active uniform updates (e.g. `uTime`, `uProgress`). | Inspect AST / Grep for `shaderMaterial` or `new THREE.ShaderMaterial` or GLSL snippets. |
| **AC-3: Post-Processing Effects Pipeline** | Inspect R3F component tree for `@react-three/postprocessing` integration. | Canvas contains `<EffectComposer>` containing at least 2 distinct effects (e.g. `Bloom`, `ChromaticAberration`, `Noise`, `Vignette`). | Verify `@react-three/postprocessing` import and EffectComposer in React tree. |
| **AC-4: GSAP ScrollTrigger Multi-Property Binding** | Programmatic verification of GSAP ScrollTrigger timeline configuration. | At least 3 distinct 3D scene properties (e.g. `position.x/y/z`, `rotation.x/y/z`, `scale`, `camera.position`, `shader.uniforms`) are bound across the scroll range. | Inspect GSAP timeline bindings and ScrollTrigger trigger configuration. |
| **AC-5: 5 Distinct Full-Height Sections** | DOM query and computed style analysis on rendered page. | React component tree renders exactly 5 `<section>` elements, each with full viewport height (`h-screen` or `min-height: 100vh`) and matching YaCheck copy. | DOM query `document.querySelectorAll('section').length === 5` with height checks. |
| **AC-6: Thai & English Copy Fidelity** | String matching on rendered DOM contents for each section. | All 5 sections contain the exact specified YaCheck promotional Thai & English text (Hero, Problem, Features, Specs, CTA). | Substring search on text contents of the 5 section elements. |

---

## 7. Discovered Implementation Gaps & Next Steps for Team

1. **Dependency Installation Required**:
   - `@react-three/postprocessing` and `postprocessing` need to be installed in `package.json` to satisfy AC-3.
2. **Shader Creation**:
   - Create dedicated custom shader module (e.g., `src/shaders/medicalShader.ts` or `src/components/ProceduralPill.tsx`) with vertex and fragment GLSL routines.
3. **Advanced 3D Geometry & Material Setup**:
   - Enhance the basic placeholder capsule into a multi-part physical procedural mesh with glass/refraction (`MeshPhysicalMaterial`), particle rings, and lighting.
4. **GSAP ScrollTrigger Refactoring**:
   - Expand the single timeline in `src/App.tsx` to bind position, rotation, camera, and shader uniforms smoothly across the 5 section scroll checkpoints.
5. **Post-Processing Pipeline**:
   - Wrap the canvas in `<EffectComposer multisampling={0}>` with `<Bloom />`, `<ChromaticAberration />`, and `<Vignette />`.

---
*End of Specification Analysis.*
