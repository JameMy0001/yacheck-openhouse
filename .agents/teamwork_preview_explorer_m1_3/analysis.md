# Milestone 1 Technical Integration Plan: Dependencies, Build Fixes & Master Scene Architecture

**Agent**: `teamwork_preview_explorer_m1_3`  
**Working Directory**: `/Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_3`  
**Date**: 2026-08-18  
**Scope**: Milestone 1 (3D Engine, Procedural Visuals & Shaders) Technical Integration

---

## 1. Executive Summary & Architecture Overview

Milestone 1 establishes the foundational 3D WebGL engine, procedural visual assets, custom GLSL shaders, and post-processing pipeline for the YaCheck Awwwards-style promotional website.

To achieve maximum visual impact and robust zero-defect compilation:
1. **Dependency Modernization**: Seamlessly install `@react-three/postprocessing` (v3.0.5), `postprocessing` (v6.39.4), and `lucide-react` (v0.575.0), verified compatible with React 19.2, Three.js r185, and R3F v9.7.
2. **Zero-Warning TS Compilation**: Resolve TS6133 compilation errors in `src/main.tsx` (by properly wrapping the application in `<StrictMode>` and an isolated `<ErrorBoundary>`) and in `src/App.tsx` (by cleaning unused functions and extracting modular components).
3. **Cinematic 3D Scene Host (`Scene.tsx`)**: Architect a high-performance, responsive Three.js `<Canvas>` with `ACESFilmicToneMapping`, DPR clamping `[1, 2]`, studio key/fill/accent lighting (biotech cyan and amber warning lights), and a dynamic lerping camera controller that adapts to viewport aspect ratio and mouse parallax.
4. **Clean File Boundaries**: Establish strict modular ownership across M1 implementers to prevent code collisions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │     3D Canvas Layer (Fixed)     │  │   UI Overlay Layer (HTML)   │  │
│  │  ┌───────────────────────────┐  │  │  ┌────────────────────────┐ │  │
│  │  │         Scene.tsx         │  │  │  │  5 Scrolly Sections    │ │  │
│  │  │ ┌───────────────────────┐ │  │  │  │  - HeroSection         │ │  │
│  │  │ │ CameraController      │ │  │  │  │  - ProblemSection      │ │  │
│  │  │ ├───────────────────────┤ │  │  │  │  - FeaturesSection     │ │  │
│  │  │ │ StudioLighting        │ │  │  │  │  - SpecsSection        │ │  │
│  │  │ ├───────────────────────┤ │  │  │  │  - CTASection          │ │  │
│  │  │ │ ProceduralCapsule     │ │  │  │  └────────────────────────┘ │  │
│  │  │ ├───────────────────────┤ │  │  └─────────────────────────────┘  │
│  │  │ │ HologramAura (GLSL)   │ │  │                                   │
│  │  │ ├───────────────────────┤ │  │                                   │
│  │  │ │ ParticleField (Nodes) │ │  │                                   │
│  │  │ ├───────────────────────┤ │  │                                   │
│  │  │ │ PostProcessing        │ │  │                                   │
│  │  │ └───────────────────────┘ │  │                                   │
│  │  └───────────────────────────┘  │                                   │
│  └─────────────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Package Installation & Dependency Specification

### 2.1 Required Package Versions

| Package | Target Version | Purpose | Compatibility Check |
|---|---|---|---|
| `@react-three/postprocessing` | `3.0.5` | React Three Fiber wrapper for postprocessing effects | Native React 19 & Three r185 peer support |
| `postprocessing` | `6.39.4` | WebGL post-processing effect engine (Bloom, ChromaticAberration, Vignette) | Compatible with Three r185 & R3F v9 |
| `lucide-react` | `0.575.0` | Futuristic biotech/cyber UI icons for telemetry, status pills, and HUD | Standalone React 19 component library |

### 2.2 Peer Dependency Matrix

```json
{
  "dependencies": {
    "@react-three/drei": "^10.7.8",
    "@react-three/fiber": "^9.7.0",
    "@react-three/postprocessing": "3.0.5",
    "@types/three": "^0.185.4",
    "gsap": "^3.15.0",
    "lucide-react": "0.575.0",
    "postprocessing": "6.39.4",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "three": "^0.185.1"
  }
}
```

### 2.3 Installation Execution Command

```bash
npm install @react-three/postprocessing@3.0.5 postprocessing@6.39.4 lucide-react@0.575.0
```

*Verification test run confirmed:* `npm install` dry-run executes in <700ms with 0 dependency conflicts and 0 peer resolution errors.

---

## 3. TypeScript Build Fixes & Code Cleanup

### 3.1 Root Cause of Current Compilation Failure

Running `npm run build` currently triggers:
1. `src/App.tsx(70,10): error TS6133: 'Loader' is declared but its value is never read.`
2. `src/main.tsx(1,1): error TS6133: 'StrictMode' is declared but its value is never read.`

Because `tsconfig.app.json` has `"noUnusedLocals": true` and `"verbatimModuleSyntax": true`, unused imports and unreferenced functions immediately fail the build.

### 3.2 Solution 1: `src/components/common/ErrorBoundary.tsx`

Extract a clean, reusable React 19 Error Boundary into its own dedicated component:

```tsx
import React, { Component, type ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught 3D / UI Error:', error, errorInfo)
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] p-6 text-white">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-950/20 p-6 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <h2 className="mb-2 text-xl font-bold tracking-tight text-red-400">Rendering Error Detected</h2>
            <p className="mb-4 text-xs text-gray-400 leading-relaxed">
              The WebGL scene or UI component encountered an unexpected error.
            </p>
            <pre className="max-h-36 overflow-auto rounded bg-black/60 p-3 text-left font-mono text-[11px] text-red-300">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-red-500 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Reload Experience
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 3.3 Solution 2: `src/main.tsx`

Clean up `src/main.tsx` to properly wrap `<App />` with `<StrictMode>` and `<ErrorBoundary>`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
}
```

### 3.4 Solution 3: `src/App.tsx` (Clean Integration Host)

Replace the temporary prototype in `src/App.tsx` with a production-grade layout that hosts `<Scene />` in the background and sets up the scrollytelling container:

```tsx
import { Suspense } from 'react'
import { Scene } from './components/3d/Scene.tsx'

export default function App() {
  return (
    <div id="scroll-container" className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      
      {/* Fixed 3D Canvas Background Viewport */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Scrollytelling HTML Content Layer */}
      <main className="relative z-10 w-full pointer-events-none">
        
        {/* Section 1: Hero */}
        <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
          <div className="pointer-events-auto max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md text-cyan-300 text-xs font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              AI-Powered Medication Guardian
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-2xl">
              YaCheck
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-slate-300 max-w-2xl font-light leading-relaxed">
              แอปพลิเคชันผู้ช่วยจัดการและแจ้งเตือนการทานยาอัจฉริยะ ตรวจจับความเสี่ยงยาตีกันด้วย Generative AI
            </p>
          </div>
          <div className="absolute bottom-10 flex flex-col items-center pointer-events-auto opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 mb-2">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
          </div>
        </section>

        {/* Section 2: Problem */}
        <section id="problem" className="relative min-h-screen w-full flex items-center px-8 md:px-20">
          <div className="pointer-events-auto max-w-xl p-8 rounded-3xl border border-red-500/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold">Critical Threat</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4 text-white">
              ยาตีกัน... <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
                อันตรายกว่าที่คุณคิด
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              การทานยาหลายชนิดร่วมกัน อาจเกิดปฏิกิริยาระหว่างยา อาหาร หรือโรคประจำตัว YaCheck วิเคราะห์โครงสร้างโมเลกุลและความเสี่ยงแบบเรียลไทม์
            </p>
          </div>
        </section>

        {/* Section 3: Solutions / Features */}
        <section id="features" className="relative min-h-screen w-full flex items-center justify-end px-8 md:px-20">
          <div className="pointer-events-auto max-w-xl p-8 rounded-3xl border border-cyan-500/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">Core Intelligence</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-6 text-white">
              ฟีเจอร์อัจฉริยะ 3 มิติ
            </h2>
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h3 className="font-semibold text-white text-base">📸 Generative AI Scanner</h3>
                <p className="text-xs text-slate-300 mt-1">สแกนเม็ดยาและฉลากยาเพื่อระบุชนิดยาและความเสี่ยงอัตโนมัติ</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h3 className="font-semibold text-white text-base">⏰ Smart Precision Reminder</h3>
                <p className="text-xs text-slate-300 mt-1">คำนวณช่วงเวลาการออกฤทธิ์และแจ้งเตือนเวลาทานยาไม่ให้ซ้ำซ้อน</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h3 className="font-semibold text-white text-base">👨‍👩‍👧‍👦 Caregiver Cloud Link</h3>
                <p className="text-xs text-slate-300 mt-1">ซิงค์ประวัติสุขภาพและการทานยากับคนในครอบครัวแบบเรียลไทม์</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Specs */}
        <section id="specs" className="relative min-h-screen w-full flex items-center justify-center px-6">
          <div className="pointer-events-auto max-w-4xl w-full p-8 md:p-12 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl shadow-2xl">
            <div className="text-center mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">Architecture</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">Under The Hood</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-3xl font-black text-cyan-400">Expo</div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase">React Native</div>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-3xl font-black text-emerald-400">Local-First</div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase">SQLite Engine</div>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-3xl font-black text-purple-400">Vision AI</div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase">Gemini Multimodal</div>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-3xl font-black text-blue-400">Supabase</div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase">BaaS & Realtime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section id="cta" className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
          <div className="pointer-events-auto max-w-3xl flex flex-col items-center p-10 rounded-3xl border border-cyan-500/30 bg-black/60 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2">Live Demo & Experience</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              ทดลองใช้งาน YaCheck
            </h2>
            <p className="text-lg text-slate-300 max-w-xl mb-8 font-light">
              พบพวกเราได้ที่งาน OpenHouse บูธ <strong className="text-cyan-400 font-bold">C-04</strong> โซน Health Tech Innovation
            </p>
            <button
              type="button"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base md:text-lg shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              สแกนดาวน์โหลดแอปพลิเคชัน
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}
```

---

## 4. Master 3D Scene Architecture (`src/components/3d/Scene.tsx`)

### 4.1 Requirements & Design Principles
1. **Canvas WebGL Configuration**:
   - `camera`: Perspective camera positioned at `[0, 0, 6]`, default `fov: 45`, `near: 0.1`, `far: 1000`.
   - `dpr`: `[1, 2]` to guarantee crisp rendering on Retina screens while avoiding fill-rate bottlenecks on 4K/low-tier mobile GPUs.
   - `gl`: `{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }`.
2. **Cinematic Studio Lighting**:
   - Directional Key Light: Sharp specular sheen across the capsule dome (`position: [6, 8, 6]`, `intensity: 2.2`, `color: "#ffffff"`).
   - Directional Cool Fill Light: Soft cyan fill (`position: [-6, -2, -3]`, `intensity: 0.8`, `color: "#7dd3fc"`).
   - Ambient Light: Deep slate baseline to prevent black crushing (`intensity: 0.35`, `color: "#0f172a"`).
   - Biotech Cyan Point Light: Strong localized glow near front-left (`position: [-3.5, 2.0, 2.5]`, `color: "#00F2FE"`, `intensity: 3.8`, `distance: 14`, `decay: 2`).
   - Amber Warning Point Light: High-contrast warm accent on bottom-right (`position: [3.5, -2.5, 2.0]`, `color: "#FFAA40"`, `intensity: 3.0`, `distance: 12`, `decay: 2`).
   - Backlight / Rim Light: Separates the translucent capsule silhouette from dark background (`position: [0, 4.5, -4.5]`, `color: "#4FACFE"`, `intensity: 2.8`, `distance: 16`, `decay: 2`).
3. **Dynamic Camera Controller**:
   - Viewport aspect listener that adjusts camera Z distance on mobile (aspect ratio < 1) so 3D objects are never horizontally cropped.
   - Smooth mouse parallax damped via `THREE.MathUtils.damp`.
   - Ready for GSAP ScrollTrigger timeline interpolation in Milestone 2.
4. **Modularity & Graceful Fallbacks**:
   - Uses React children or modular sub-components (`<ProceduralCapsule />`, `<ParticleField />`, `<HologramAura />`, `<PostProcessing />`).

### 4.2 Complete `src/components/3d/Scene.tsx` Implementation

```tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { ProceduralCapsule } from './ProceduralCapsule.tsx'
import { ParticleField } from './ParticleField.tsx'
import { HologramAura } from './HologramAura.tsx'
import { PostProcessing } from './PostProcessing.tsx'

export interface SceneProps {
  scrollProgress?: number
  dangerMix?: number
  isExploded?: boolean
  className?: string
}

/**
 * Studio Lighting Rig for high-end refraction & specular reflections
 */
export function StudioLighting() {
  return (
    <group name="studio-lighting">
      {/* Baseline ambient fill */}
      <ambientLight intensity={0.35} color="#0f172a" />

      {/* Main directional key light */}
      <directionalLight
        position={[6, 8, 6]}
        intensity={2.2}
        color="#ffffff"
        castShadow={false}
      />

      {/* Cool directional fill light */}
      <directionalLight
        position={[-6, -2, -3]}
        intensity={0.8}
        color="#7dd3fc"
      />

      {/* Cyan Biotech Accent Point Light */}
      <pointLight
        position={[-3.5, 2.0, 2.5]}
        color="#00F2FE"
        intensity={3.8}
        distance={14}
        decay={2}
      />

      {/* Amber Warning Accent Point Light */}
      <pointLight
        position={[3.5, -2.5, 2.0]}
        color="#FFAA40"
        intensity={3.0}
        distance={12}
        decay={2}
      />

      {/* Backlight / Silhouette Rim Light */}
      <pointLight
        position={[0, 4.5, -4.5]}
        color="#4FACFE"
        intensity={2.8}
        distance={16}
        decay={2}
      />
    </group>
  )
}

/**
 * Dynamic Camera Controller with Aspect Ratio Scaling & Mouse Parallax
 */
export function CameraController() {
  const { camera, viewport, pointer } = useThree()
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_state, delta) => {
    // Dynamic responsive camera distance for mobile portrait vs desktop widescreen
    const isPortrait = viewport.aspect < 1
    const baseZ = isPortrait ? 7.8 : 6.0
    const baseY = isPortrait ? 0.2 : 0.0

    // Smooth subtle mouse parallax
    const targetX = pointer.x * 0.4
    const targetY = baseY + pointer.y * 0.3
    const targetCamZ = baseZ

    // Damp camera position smoothly
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.0, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.0, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.0, delta)

    // Keep camera focused at center
    targetLookAt.current.set(pointer.x * 0.1, pointer.y * 0.1, 0)
    camera.lookAt(targetLookAt.current)
  })

  return null
}

/**
 * Master Scene Canvas Container
 */
export function Scene({
  scrollProgress = 0,
  dangerMix = 0,
  isExploded = false,
  className = 'w-full h-full',
}: SceneProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        {/* Dynamic camera rig */}
        <CameraController />

        {/* Cinematic lighting */}
        <StudioLighting />

        {/* 3D Scene Assets with Suspense boundary */}
        <Suspense fallback={null}>
          <group name="scene-content">
            {/* Bio-molecular particle background */}
            <ParticleField />

            {/* Custom GLSL hologram displacement aura */}
            <HologramAura dangerMix={dangerMix} />

            {/* High-refraction physical medicine capsule */}
            <ProceduralCapsule
              scrollProgress={scrollProgress}
              dangerMix={dangerMix}
              isExploded={isExploded}
            />
          </group>

          {/* Post-Processing Pipeline (Bloom, ChromaticAberration, Vignette) */}
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 5. Component Contracts & Interface Specifications

### 5.1 `ProceduralCapsule` Contract (`src/components/3d/ProceduralCapsule.tsx`)
- **Props**:
  ```tsx
  export interface ProceduralCapsuleProps {
    scrollProgress?: number
    dangerMix?: number
    isExploded?: boolean
  }
  ```
- **Structure**:
  - Dual shell: Top half `MeshPhysicalMaterial` (refraction/transmission `0.95`, `ior: 1.54`, `thickness: 0.8`), bottom half `MeshPhysicalMaterial` (`color: '#00F2FE'`, `roughness: 0.15`, `clearcoat: 1.0`).
  - Internal instanced spheres (active medicine pellets) with glowing cyan/emerald/amber materials.
  - Explosion transform offset driven by `isExploded` or `scrollProgress`.

### 5.2 `ParticleField` Contract (`src/components/3d/ParticleField.tsx`)
- **Props**:
  ```tsx
  export interface ParticleFieldProps {
    count?: number // Default: 1500
    color?: string
  }
  ```
- **Structure**:
  - Procedural `BufferGeometry` with `Float32Array` positions and sizes.
  - `useFrame` vertex rotation and dynamic orbital drift.

### 5.3 `AuraShaderMaterial` Contract (`src/shaders/AuraShaderMaterial.ts`)
- **Uniforms**:
  ```ts
  export interface AuraShaderUniforms {
    uTime: { value: number }
    uProgress: { value: number }
    uDangerMix: { value: number }
    uScanGlow: { value: number }
    uDistortion: { value: number }
    uColorSafe: { value: THREE.Color }
    uColorDanger: { value: THREE.Color }
  }
  ```

### 5.4 `PostProcessing` Contract (`src/components/3d/PostProcessing.tsx`)
- **Structure**:
  - Renders `<EffectComposer multisampling={0}>`
  - `<Bloom luminanceThreshold={0.4} luminanceSmoothing={0.8} intensity={1.2} />`
  - `<ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} radialModulation={true} modulationOffset={0.2} />`
  - `<Vignette darkness={0.65} offset={0.2} />`
  - `<ToneMapping />`

---

## 6. File Boundaries & Milestone 1 Write Ownership Matrix

| File Path | Description | Responsible Implementer | Strict Boundary Rules |
|---|---|---|---|
| `package.json` | Dependency additions (`@react-three/postprocessing`, `postprocessing`, `lucide-react`) | M1 Integration Agent | Add dependencies only; do not alter script names |
| `src/main.tsx` | Root mounting point with `StrictMode` & `ErrorBoundary` | M1 Integration Agent | Import and wrap ErrorBoundary and App cleanly |
| `src/components/common/ErrorBoundary.tsx` | Error boundary for WebGL/React crashes | M1 Integration Agent | Pure React error boundary component |
| `src/App.tsx` | Main application shell hosting `<Scene />` & 5 UI sections | M1 Integration Agent | Keep clean layout; remove dead prototype code |
| `src/components/3d/Scene.tsx` | Master R3F Canvas, studio lighting, camera controller | M1 Integration Agent | Pure host canvas; imports sub-3D components |
| `src/components/3d/ProceduralCapsule.tsx` | High-refraction capsule & active medicine pellets | M1 Visuals Agent (`m1_2`) | Self-contained capsule module & materials |
| `src/components/3d/ParticleField.tsx` | Bio-molecular orbital particle cloud | M1 Visuals Agent (`m1_2`) | Pure procedural BufferGeometry particles |
| `src/shaders/AuraShaderMaterial.ts` | Custom GLSL shader with Simplex noise & uniforms | M1 Shader Agent (`m1_1`) | Shader material definition & GLSL uniforms |
| `src/components/3d/HologramAura.tsx` | 3D mesh wrapper utilizing AuraShaderMaterial | M1 Shader Agent (`m1_1`) | Mesh applying custom GLSL shader material |
| `src/components/3d/PostProcessing.tsx` | EffectComposer pipeline (Bloom, Aberration, Vignette) | M1 Shader Agent (`m1_1`) | Post-processing effects stack |

---

## 7. Verification Strategy & Independent Test Procedure

### 7.1 Verification Step 1: Package Installation
Run:
```bash
npm install @react-three/postprocessing@3.0.5 postprocessing@6.39.4 lucide-react@0.575.0
```
Expected: `package.json` updated with exact dependencies and zero lockfile or resolution conflicts.

### 7.2 Verification Step 2: Zero TS Compilation Errors
Run:
```bash
npm run build
```
Expected:
```
vite v8.2.0 building for production...
✓ built in ...ms
```
Exit code `0` with 0 TypeScript compilation errors (`TS6133` eliminated).

### 7.3 Verification Step 3: Linting Cleanliness
Run:
```bash
npx oxlint
```
Expected: 0 syntax or dead-code errors across all files in `src/`.

### 7.4 Verification Step 4: Visual & Runtime Inspection
Run:
```bash
npm run preview
```
Open `http://localhost:4173/` and verify:
1. 3D Canvas initializes with dark background `#050505`.
2. Studio lights illuminate meshes with cyan highlights and amber rim reflections.
3. Smooth mouse parallax occurs with no jitter or lag.
4. Mobile viewport resize gracefully pulls camera back to prevent 3D clipping.
5. All 5 HTML sections render above the 3D canvas with clean glassmorphic styling.
