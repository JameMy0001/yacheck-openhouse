# E2E Test Infrastructure: YaCheck 3D WebGL Promotional Website

## 1. Test Philosophy
The YaCheck 3D promotional website testing harness is engineered under the **Opaque-Box, Requirement-Driven Verification** paradigm. The test harness treats the implementation as a black/opaque box against the authoritative specifications defined in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Principles
- **Opaque-Box Contract Verification**: Tests evaluate observable outputs, compilation artifacts, AST structure, export signatures, and runtime state contracts without coupling to private implementation trivia.
- **Zero Facade / Anti-Cheat Guarantee**: All assertions execute genuine checks (compilation checks via `tsc`/`vite build`, AST/source structural parsing, shader code analysis, GSAP timeline bindings, and real-world DOM copy validation). Facade stubs or hardcoded passes are strictly forbidden.
- **Progressive Testability & Isolation**: Tests are structured across 4 distinct tiers so that failure points can be isolated precisely to specific subsystems (build, shaders, post-processing, scroll bindings, UI sections, cross-module interactions, or end-to-end user journeys).
- **Adversarial & Boundary Rigor**: Edge cases such as scroll limits (0% to 100%), WebGL context failure handling, responsive viewport styling, and pointer event isolation are explicitly tested.

---

## 2. Feature Inventory & Requirement Mapping

| Feature # | Feature Name | Source | Target Tier | Verification Criteria |
|:---|:---|:---|:---|:---|
| **F1** | Clean TypeScript & Vite Build | ORIGINAL_REQUEST AC | **Tier 1** | `npm run build` succeeds with zero TS errors; `dist/` bundle generated. |
| **F2** | Procedural Medicine Capsule | PROJECT F2 / R1 | **Tier 1, 3** | Procedural capsule geometry (`capsuleGeometry` / `sphereGeometry`), dual-shell / physical materials (`MeshPhysicalMaterial`). |
| **F3** | Custom GLSL Shader Material | ORIGINAL_REQUEST AC, R1 | **Tier 1, 3** | Custom shader (`shaderMaterial` / `ShaderMaterial`), GLSL vertex/fragment code, reactive uniforms (`uTime`, `uProgress`, `uDangerMix`). |
| **F4** | Bio-Molecular Particle Field | PROJECT F4 / R1 | **Tier 1** | Procedural particle system (`points` / `bufferGeometry` / particle nodes). |
| **F5** | Post-Processing Pipeline | ORIGINAL_REQUEST AC, R1 | **Tier 1** | `@react-three/postprocessing` `<EffectComposer>` with `Bloom` and `ChromaticAberration` (plus `Vignette` / `ToneMapping`). |
| **F6** | 5 Full-Height UI Sections | ORIGINAL_REQUEST AC, R3 | **Tier 1, 4** | 5 distinct `<section>` components (`hero`, `problem`, `solutions`/`features`, `specs`, `cta`) with full-height layout. |
| **F7** | Multi-Property GSAP ScrollTrigger | ORIGINAL_REQUEST AC, R2 | **Tier 1, 2, 3**| `ScrollTrigger` bound to >= 3 distinct 3D scene properties (camera, mesh rotation/position, shader uniforms, explosion distance). |
| **F8** | Responsive & Glassmorphic UI | PROJECT F6, F8 | **Tier 2** | `pointer-events-none` on overlay container, `pointer-events-auto` on cards, responsive flex/grid classes. |
| **F9** | WebGL Error Boundary Safety | PROJECT Interface | **Tier 2** | Error boundary component wrapping 3D scene or component tree with fallback handling. |
| **F10**| End-to-End Scrollytelling Journey | ORIGINAL_REQUEST R2, R3 | **Tier 4** | Complete narrative flow with authentic YaCheck copy (Thai typography, AI scanner, Booth C-04 CTA). |

---

## 3. Test Architecture & Directory Layout

```
/Users/mac/Desktop/OpenHouse-3D/
├── tests/
│   ├── e2e-verification.ts           # Master standalone test runner & multi-tier test suite
│   └── fixtures/                     # Test contracts, mock state models, and expected copy
├── TEST_INFRA.md                     # Test infrastructure specification (this document)
├── TEST_READY.md                     # Execution guide and readiness checklist
└── package.json                      # npm run test:e2e script
```

### Test Runner Architecture
The test suite is built as a self-contained TypeScript test runner executed natively via Node.js (`node --experimental-strip-types tests/e2e-verification.ts`).

The runner consists of:
1. **Compilation Engine**: Invokes the project build pipeline (`tsc -b && vite build`) and analyzes compiler diagnostics, stdout, stderr, and exit codes.
2. **Static AST & Contract Inspector**: Parses source files in `src/` to verify imports, exports, JSX hierarchy, shader uniforms, shader code tokens, post-processing effects, and GSAP timeline bindings.
3. **Scroll & State Simulator**: Simulates GSAP scroll progress across milestones (0.0, 0.25, 0.50, 0.75, 1.0) and validates state contract transitions for camera, capsule explosion, and shader uniform mappings.
4. **DOM & Content Validator**: Validates the 5 `<section>` elements, brand copy integrity (Thai language strings, tech specs, CTA actions), and CSS layout classes.
5. **Reporter & Result Formatter**: Formats output with ANSI color-coding, tier grouping, timing metrics, and granular failure forensics.

---

## 4. Four-Tier Verification Framework

### Tier 1: Feature Coverage
Validates the fundamental technical capabilities and acceptance criteria specified in the project prompt:
- **T1.1: TypeScript Compilation & Clean Build**: Executes `npm run build` with zero TypeScript errors (TS6133, TS2304, etc.) and valid Vite bundling.
- **T1.2: Custom GLSL Shader Implementation**: Asserts presence of custom shader material (`shaderMaterial` from `@react-three/drei` or `THREE.ShaderMaterial`), containing vertex displacement/noise, fragment coloring/Fresnel, and reactive uniform definitions (`uTime`, `uProgress`, `uDangerMix`).
- **T1.3: Advanced Post-Processing Integration**: Asserts integration of `@react-three/postprocessing` with `<EffectComposer>`, `<Bloom />`, and `<ChromaticAberration />`.
- **T1.4: Multi-Property GSAP ScrollTrigger Bindings**: Asserts that GSAP `ScrollTrigger` is actively bound to $\ge 3$ distinct 3D scene properties across the scroll timeline (e.g. camera position/FOV, capsule position/rotation, shader uniforms, explosion distance).
- **T1.5: 5 Full-Height UI Sections Structure**: Asserts that the component tree defines 5 distinct `<section>` elements for Hero, Problem, Solutions, Specs, and CTA.

### Tier 2: Boundary & Corner Cases
Tests system behavior under edge conditions and boundary states:
- **T2.1: Scroll Progress Boundaries**: Tests exact scroll progress bounds at 0% (Hero start), 25% (Hero->Problem transition), 50% (Problem->Solutions), 75% (Solutions->Specs), and 100% (CTA completion).
- **T2.2: Viewport & Responsive Layout Properties**: Tests that all sections utilize full viewport height (`100vh` or `h-screen`/`min-h-screen`), overlay container isolates pointer events (`pointer-events-none`), and interactive cards re-enable events (`pointer-events-auto`).
- **T2.3: WebGL Error Boundary Safety**: Tests presence of React `ErrorBoundary` protecting 3D canvas / WebGL context failures.

### Tier 3: Cross-Feature Interactions
Tests synchronization and state coupling between 3D visuals, shaders, animations, and UI states:
- **T3.1: Shader Uniform Transitions Synced to Scroll**: Verifies `uProgress` maps proportionally to scroll progress, and `uDangerMix` activates during the Problem section.
- **T3.2: Capsule Transformation & Explosion Synchronization**: Verifies capsule rotation, position shift, and shell explosion/separation coincide with active section transitions (Hero -> Problem -> Solutions -> Specs).
- **T3.3: Camera Orbit & FOV Dynamics**: Verifies camera positioning and orientation transitions smoothly across all 5 scenes without clipping or disorientation.

### Tier 4: Real-World Scenarios (End-to-End Scrollytelling Journey)
Validates the complete user experience and brand narrative:
- **T4.1: Hero Scene Presentation**: Validates YaCheck brand header, Thai tagline ("แอปพลิเคชันผู้ช่วยจัดการและแจ้งเตือนการทานยาอัจฉริยะ"), and animated scroll indicator.
- **T4.2: Problem Scene Crisis Narrative**: Validates medication interaction crisis copy ("ยาตีกัน... อันตรายกว่าที่คิด") and risk warning text.
- **T4.3: Solutions Scene Feature Showcase**: Validates 3 core AI features: "AI Scanner", "Smart Reminder", and "Caregiver Link".
- **T4.4: Specs Scene Technical Architecture**: Validates technical cards showcasing Expo (React Native), Local First DB, Generative AI, and Supabase BaaS.
- **T4.5: CTA Scene Conversion & Action**: Validates OpenHouse Booth "C-04" location badge, invitation copy, and interactive download button.

---

## 5. Coverage Thresholds & Pass Criteria

| Metric | Target Threshold | Strictness |
|:---|:---|:---|
| TypeScript Compilation Errors | **0** | Strict (Exit Code 0) |
| Tier 1: Feature Coverage Pass Rate | **100%** (5/5 suites) | Blocking |
| Tier 2: Boundary & Corner Pass Rate | **100%** (3/3 suites) | Blocking |
| Tier 3: Cross-Feature Interactions Pass Rate | **100%** (3/3 suites) | Blocking |
| Tier 4: Real-World Scenarios Pass Rate | **100%** (5/5 suites) | Blocking |
| Total Test Cases Pass Rate | **100%** (16/16 checks) | Blocking |

---

## 6. Execution Command
To execute the comprehensive test suite:
```bash
npm run test:e2e
```
Or directly via Node:
```bash
node --experimental-strip-types tests/e2e-verification.ts
```
