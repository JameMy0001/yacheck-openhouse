# Comprehensive Codebase & Architecture Survey Report

**Project**: YaCheck 3D Promotional Website (OpenHouse-3D)  
**Surveyor**: `teamwork_preview_explorer_survey_2`  
**Date**: 2026-08-18  
**Working Directory**: `/Users/mac/Desktop/OpenHouse-3D`

---

## 1. Executive Summary

The project is an interactive 3D promotional landing page for **YaCheck** (an AI-powered smart medication management application) built with **Vite 8**, **React 19**, **Three.js 0.185**, **React Three Fiber (R3F) 9.7**, **GSAP 3.15 (ScrollTrigger)**, and **Tailwind CSS v4**.

An initial prototype exists in `src/App.tsx` containing a basic 3D capsule mesh and 5 full-height placeholder sections. However:
1. **Compilation Issue**: `npm run build` currently fails with TypeScript errors (`TS6133: unused variable`) due to strict `tsconfig` rules (`noUnusedLocals: true`).
2. **Missing Dependencies**: `@react-three/postprocessing` and `postprocessing` are not yet installed in `package.json` (required for Bloom/Chromatic Aberration/DOF). We verified that `@react-three/postprocessing@3.0.5` + `postprocessing@6.39.4` can be installed without any version or peer dependency conflicts with React 19 and Three.js 0.185.
3. **Awwwards Visual Gap**: The current 3D scene is a minimal placeholder (standard capsule mesh + standard lights) without custom GLSL shaders, procedural complex particle systems, glass/refraction shaders (`MeshPhysicalMaterial`), or post-processing pipelines.
4. **Scrollytelling Gap**: GSAP ScrollTrigger is bound to position/rotation on a single group; it needs multi-stage timeline choreography binding camera, lighting, shader uniforms, particle dispersion, and HTML overlay transitions.

---

## 2. Configuration & Tooling Audit

| Configuration File | Path | Status | Key Findings / Settings |
| :--- | :--- | :--- | :--- |
| `package.json` | `/package.json` | ⚠️ Incomplete | `type: module`, scripts for `dev`, `build`, `lint`, `preview`. Missing postprocessing dependencies. |
| `vite.config.ts` | `/vite.config.ts` | ✅ Configured | Uses `@vitejs/plugin-react` (6.0.4) and `@tailwindcss/vite` (4.3.3). |
| `tsconfig.app.json` | `/tsconfig.app.json` | ⚠️ Strict | Target `es2023`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `noUnusedLocals: true`, `noUnusedParameters: true`, `skipLibCheck: true`. |
| `tsconfig.json` | `/tsconfig.json` | ✅ Valid | Solution-style tsconfig referencing `tsconfig.app.json` and `tsconfig.node.json`. |
| `index.html` | `/index.html` | ⚠️ Minimal | Title is `"openhouse-3d"`, viewport set, loads `/src/main.tsx`. Needs rich metadata & title for YaCheck. |
| `src/index.css` | `/src/index.css` | ✅ Configured | Uses `@import "tailwindcss";` (Tailwind v4), resets body with `#050505` dark background and system fonts. |

---

## 3. Dependency Inventory & Compatibility Analysis

### 3.1 Currently Installed Dependencies

| Package | Version in `package.json` | Installed Version | Role | Status |
| :--- | :--- | :--- | :--- | :--- |
| `react` | `^19.2.8` | `19.2.8` | UI Framework | ✅ Active |
| `react-dom` | `^19.2.8` | `19.2.8` | React DOM Renderer | ✅ Active |
| `three` | `^0.185.1` | `0.185.1` | Core 3D Engine | ✅ Active |
| `@types/three` | `^0.185.4` | `0.185.4` | Three.js TypeScript definitions | ✅ Active |
| `@react-three/fiber` | `^9.7.0` | `9.7.0` | React renderer for Three.js (React 19 support) | ✅ Active |
| `@react-three/drei` | `^10.7.8` | `10.7.8` | R3F Helper ecosystem (Float, Html, Text, MeshDistortMaterial, etc.) | ✅ Active |
| `gsap` | `^3.15.0` | `3.15.0` | Animation & ScrollTrigger library | ✅ Active |
| `tailwindcss` | `^4.3.3` | `4.3.3` | Modern CSS Framework (v4 engine) | ✅ Active |
| `@tailwindcss/vite` | `^4.3.3` | `4.3.3` | Tailwind v4 Vite integration | ✅ Active |
| `oxlint` | `^1.75.0` | `1.78.0` | High performance linter | ✅ Active |
| `vite` | `^8.2.0` | `8.2.1` | Build & Dev Server | ✅ Active |
| `typescript` | `~6.0.2` | `6.0.3` | TypeScript compiler | ✅ Active |

### 3.2 Required & Recommended Additions

| Package | Recommended Version | Reason | Compatibility Assessment |
| :--- | :--- | :--- | :--- |
| `@react-three/postprocessing` | `^3.0.5` | Required by Acceptance Criteria R2 for Bloom, Chromatic Aberration, Noise, Vignette, Depth of Field. | Tested & Verified compatible: Peer deps match `@react-three/fiber >= 9.7.0`, `react ^19.2.0`, `three >= 0.182.0`. |
| `postprocessing` | `^6.39.4` | Core post-processing engine required as peer dependency of `@react-three/postprocessing`. | Installs cleanly without conflicts. |
| `lucide-react` | `^1.16.0` (or latest) | Recommended for high-tech futuristic UI icons in Specs, Features, and Floating HUDs. | Zero conflict with React 19. |
| `clsx` / `tailwind-merge` | `latest` | Optional utility for dynamic Tailwind class composition. | Clean install. |

---

## 4. Build, Lint, and Test Diagnostics

### 4.1 `npm run build` Diagnostic
- **Command Executed**: `tsc -b && vite build`
- **Result**: Fails (exit code 2).
- **Verbatim Error Log**:
  ```
  src/App.tsx(70,10): error TS6133: 'Loader' is declared but its value is never read.
  src/main.tsx(1,1): error TS6133: 'StrictMode' is declared but its value is never read.
  ```
- **Root Cause**: `tsconfig.app.json` has `"noUnusedLocals": true`. In `main.tsx`, `StrictMode` is imported but not rendered (wrapped in `ErrorBoundary` instead). In `App.tsx`, `function Loader()` is defined but not referenced in `Suspense fallback`.
- **Remedy**: Clean up imports / wrap root in `<StrictMode>` and utilize `Loader` or remove unused declarations.

### 4.2 `npm run lint` Diagnostic
- **Command Executed**: `oxlint`
- **Result**: Passes with 0 errors, 2 warnings matching the unused variables above.

### 4.3 Test Runner Diagnostic
- There are currently **no unit / integration test runners** configured in `package.json` (no vitest/jest).
- Quality verification is driven by `tsc -b`, `vite build`, `oxlint`, and browser runtime execution.

---

## 5. Source Code & Component Architecture Review

### 5.1 `src/main.tsx`
- Contains React DOM mounting logic with an inline `ErrorBoundary` class component.
- Loads `src/index.css` and imports `App.tsx`.

### 5.2 `src/App.tsx`
Currently contains everything in a single 168-line file:
- **Canvas Container**: Fixed full-viewport background (`position: fixed; inset: 0; zIndex: 0`).
- **Scene Component**:
  - Contains `groupRef` referencing a 3D pill model composed of `capsuleGeometry` and `sphereGeometry` with basic `meshStandardMaterial`.
  - GSAP `timeline` initialized with `ScrollTrigger` targeting `#scroll-container`, moving position `[2, -1, 0]` -> `[-2, 1, 0]` -> `[0, 0, 0]` and rotating.
  - `useFrame` hook continuously increments `rotation.y` and `rotation.z`.
- **HTML Overlay**:
  - Container with `position: relative; zIndex: 10; pointerEvents: 'none'`.
  - 5 Full-Height (`100vh`) sections with Thai & English copy:
    1. **Scene 1 (Hero)**: Big title "YaCheck", tagline, scroll down prompt.
    2. **Scene 2 (Problem)**: "ยาตีกัน... อันตรายกว่าที่คิด" (Drug interactions warning).
    3. **Scene 3 (Features)**: AI Scanner, Smart Reminder, Caregiver Link.
    4. **Scene 4 (Specs)**: "Under the Hood" tech stack card (Expo, Local First DB, Generative AI, Supabase).
    5. **Scene 5 (CTA)**: "ทดลองใช้งาน YaCheck" with booth C-04 info and CTA button.

---

## 6. Gap Analysis Against Acceptance Criteria

| Acceptance Criterion | Current Status | Required Action for Implementation |
| :--- | :--- | :--- |
| **Zero TS Errors on `npm run build`** | ❌ Fails (TS6133) | Fix unused variables, ensure strict typing across all components. |
| **Custom Shader Implementation** | ❌ Missing | Create custom GLSL shader (e.g., volumetric aura, glowing energy rings, holographic pill scan lines, or procedural interactive noise surface via `shaderMaterial`). |
| **Advanced Post-Processing** | ❌ Missing | Install `@react-three/postprocessing` & `postprocessing`, configure `<EffectComposer>` with `Bloom`, `ChromaticAberration`, `Vignette`, `Noise`, or `DepthOfField`. |
| **ScrollTrigger Bound to 3+ Scene Properties** | ⚠️ Partial (Only pos/rot) | Bind `ScrollTrigger` to camera coordinates, FOV/zoom, light colors/intensities, shader uniforms (`uProgress`, `uExplode`), and particle morphing parameters. |
| **5 Distinct Full-Height Content Sections** | ⚠️ Basic Skeleton | Elevate HTML overlay into high-end Awwwards glassmorphism UI with modern typography, interactive widgets, floating status pills, feature highlights, and booth details. |
| **Procedural 3D Visual Impact** | ⚠️ Basic Mesh | Implement rich procedural elements: multi-layer glass capsule with inner glowing medicine nano-particles, DNA/chemical helix rings, floating data nodes, dynamic lighting, and particle field backgrounds. |

---

## 7. Recommended Component Decomposition Plan

To support clean architecture and maintainability, the project should be structured into modular components:

```
src/
├── components/
│   ├── 3d/
│   │   ├── Experience.tsx            # Canvas setup, Camera controls, Environment, Post-processing
│   │   ├── YaCheckPill.tsx           # Procedural high-end glass/metallic pill with internal nano-particles
│   │   ├── HolographicRings.tsx      # Custom GLSL shader material with glowing scan rings
│   │   ├── MolecularParticles.tsx    # Instanced / BufferGeometry particle field simulating drug compounds
│   │   ├── SceneLighting.tsx         # Dynamic multi-light setup animating with scroll
│   │   └── Effects.tsx               # EffectComposer with Bloom, ChromaticAberration, Vignette
│   ├── ui/
│   │   ├── Navbar.tsx                # Floating frosted glass navbar with logo, audio toggle, booth pill
│   │   ├── HeroSection.tsx           # Scene 1: High-impact hero with glowing badge & typography
│   │   ├── ProblemSection.tsx        # Scene 2: Interactive drug conflict warning & visual hazard cards
│   │   ├── FeaturesSection.tsx       # Scene 3: Glass cards highlighting AI Scanner, Reminder, Caregiver
│   │   ├── SpecsSection.tsx          # Scene 4: "Under the Hood" tech matrix with animated counters
│   │   ├── CTASection.tsx            # Scene 5: Booth C-04 pass, QR code download mockup, action button
│   │   └── ScrollerIndicator.tsx     # Custom progress bar / scroll tracker
│   └── shaders/
│       ├── holographic/              # Custom GLSL vertex & fragment shaders
│       └── energyAura/               # Custom glow/noise shader material
├── hooks/
│   └── useScrollTimeline.ts          # Centralized GSAP ScrollTrigger timeline management
├── data/
│   └── content.ts                    # Structured YaCheck copy and feature specs
├── App.tsx                           # Master page orchestration
├── main.tsx                          # App mount point
└── index.css                         # Tailwind CSS and global visual effects
```

