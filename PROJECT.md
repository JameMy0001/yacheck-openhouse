# Project: YaCheck 3D WebGL Promotional Website

## Architecture
- **Framework**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4
- **3D Engine**: Three.js (r185) + React Three Fiber (@react-three/fiber v9) + @react-three/drei (v10)
- **Post-Processing**: @react-three/postprocessing + postprocessing (Bloom, Chromatic Aberration, Vignette, ToneMapping)
- **Animation & Scrollytelling**: GSAP (v3.15) + ScrollTrigger
- **Visual Strategy**:
  - Pure procedural 3D generation (no external .glb/.gltf 3D assets).
  - High-refraction medicine capsule with `MeshPhysicalMaterial` (transmission, roughness, thickness, ior).
  - Custom GLSL Shader Material (`AuraShaderMaterial` / `shaderMaterial`) with dynamic vertex noise displacement, Fresnel glow, and reactive uniforms.
  - Multi-tier particle system (floating bio-molecular nodes, orbital ring, internal nano-pellets).
  - Synchronized GSAP ScrollTrigger timeline driving camera position, mesh rotation/explosion, shader uniforms (`uProgress`, `uDangerMix`), and particle dispersion.
  - 5 full-height `<section>` overlay components with Tailwind CSS glassmorphic cards.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dependency & Build Pipeline Setup | Install `@react-three/postprocessing`, `postprocessing`, `lucide-react`; fix TypeScript TS6133 compilation errors to ensure clean `npm run build` | M1 | Survey |
| 2 | Procedural Medicine Capsule & Materials | Build dual-shell capsule (`MeshPhysicalMaterial` with glass transmission, refraction, glossy caps) and internal active medicine pellets | M1 | Survey (R1) |
| 3 | Custom GLSL Shader Material | Implement custom vertex/fragment shader material with simplex noise displacement, scanlines, Fresnel glow, and dynamic uniforms | M1 | Survey (R1, AC) |
| 4 | Bio-Molecular Particle Field | Create procedural background particle system with drifting nodes, connection lines, and orbital rings | M1 | Survey (R1) |
| 5 | Post-Processing Pipeline | Configure `<EffectComposer>` with Bloom, Chromatic Aberration, Vignette, and ToneMapping optimized for 60fps | M1 | Survey (R1, AC) |
| 6 | 5 Full-Height UI Sections Overlay | Implement Hero, Problem, Core Features, Specs, and CTA `<section>` components with Tailwind CSS dark glassmorphism | M2 | Survey (R3, AC) |
| 7 | Multi-Property GSAP ScrollTrigger Binding | Bind ScrollTrigger across 5 scenes to camera position/FOV, mesh rotation/explosion, and shader uniforms (`uProgress`, `uDangerMix`) | M2 | Survey (R2, AC) |
| 8 | Interactive Polish & Micro-interactions | Magnetic buttons, cursor glow, sound toggles, hover states, and smooth navigation scroll anchors | M2 | Survey (R3) |
| 9 | Opaque-Box E2E Testing Suite | Comprehensive test suite (Tiers 1-4: Unit/Integration/E2E specs) validating all 5 sections, 3D Canvas, Shaders, Post-processing, and GSAP bindings | E2E-Track | Survey (AC) |
| 10 | Adversarial Coverage Hardening (Tier 5) | White-box stress testing, WebGL context loss resilience, resize handling, performance FPS audit, and regression prevention | Final-M3 | Survey (AC) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test harness, test runner, and test cases for Tiers 1-4 (Features, Boundaries, Cross-feature, Real-World) | none | DONE |
| M1 | 3D Engine, Procedural Visuals & Shaders | Install dependencies, fix TS build errors, implement procedural capsule, custom GLSL shader, particle cloud, and @react-three/postprocessing pipeline | none | DONE |
| M2 | UI Overlay, GSAP Scrollytelling & 5 Sections | 5 full-height Tailwind sections (Hero, Problem, Features, Specs, CTA), GSAP ScrollTrigger timeline binding >=3 3D scene properties | M1 | DONE |
| Final-M3 | E2E Test Suite Pass & Adversarial Hardening | Pass 100% of E2E test suite (Tiers 1-4), execute Tier 5 adversarial stress testing, perform Forensic Audit and verify zero TS errors | M1, M2, E2E | DONE |

## Interface Contracts
### 3D Scene State & GSAP Timeline Controller
- **Scroll Progress & Timeline State**:
  - `scrollProgress: { current: number }` (0.0 to 1.0)
  - `scenePhase: 'hero' | 'problem' | 'solutions' | 'specs' | 'cta'`
  - `cameraState: { position: [number, number, number], fov: number, lookAt: [number, number, number] }`
  - `capsuleTransform: { position: [number, number, number], rotation: [number, number, number], explodeDistance: number }`
  - `shaderUniforms: { uTime: number, uProgress: number, uDangerMix: number, uScanGlow: number, uDistortion: number }`
- **UI Sections & Navigation**:
  - 5 full-height `<section id="hero | problem | solutions | specs | cta">`
  - Container: `fixed inset-0 pointer-events-none` with card children `pointer-events-auto`
  - Responsive breakpoints: Mobile (`< 768px`) gracefully stacks text; Desktop (`>= 1024px`) splits 3D visual and glass UI cards.

## Code Layout
```
src/
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx                 # Master R3F Canvas & lighting setup
│   │   ├── ProceduralCapsule.tsx     # High-refraction physical capsule & internal pellets
│   │   ├── ParticleField.tsx         # Bio-molecular orbital and ambient particle field
│   │   ├── HologramAura.tsx          # Custom GLSL shader mesh & visual aura
│   │   └── PostProcessing.tsx        # EffectComposer (Bloom, ChromaticAberration, Vignette)
│   ├── shaders/
│   │   └── AuraShaderMaterial.ts     # Custom GLSL shaderMaterial definition & uniforms
│   ├── ui/
│   │   ├── Navigation.tsx            # Floating glass navbar & status pill
│   │   ├── HeroSection.tsx           # Section 1: Hero title, tagline, interactive metrics
│   │   ├── ProblemSection.tsx        # Section 2: Medication error crisis & danger aura
│   │   ├── FeaturesSection.tsx       # Section 3: AI Scanner, Verification & Drug Interaction
│   │   ├── SpecsSection.tsx          # Section 4: Deep technical architecture & telemetry
│   │   └── CTASection.tsx            # Section 5: OpenHouse Booth C-04 & App Store action
│   └── common/
│       └── ErrorBoundary.tsx         # Fallback error boundary
├── hooks/
│   └── useScrollytelling.ts          # GSAP ScrollTrigger timeline coordinator
├── tests/
│   ├── e2e-runner.ts                 # Programmatic verification & static analyzer
│   └── suite.test.ts                 # Test suite definitions
├── App.tsx                           # Root orchestrator combining 3D scene & UI overlay
├── main.tsx                          # App mount point & global styles
└── index.css                         # Tailwind CSS styling & custom scrollbars
```
