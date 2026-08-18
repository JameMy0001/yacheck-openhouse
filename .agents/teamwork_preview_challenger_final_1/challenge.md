# Tier 5 Adversarial Coverage Hardening — 3D & Performance Challenge Report

## Challenge Summary

**Overall risk assessment**: MEDIUM
**Final Verdict**: REQUEST_CHANGES

The 3D rendering pipeline for the YaCheck promotional website is highly sophisticated, demonstrating exceptional visual fidelity with procedural geometry, custom GLSL vertex/fragment shaders, and responsive camera controllers. The baseline compilation (`npm run build`) and opaque-box E2E test suite (`npm run test:e2e`) pass 100% (16/16 tests across 4 tiers).

However, during Tier 5 Adversarial Coverage Hardening and memory allocation audits, **4 un-memoized object allocations** (`new THREE.Color()`) were empirically discovered executing inside `useFrame` render loops in `ProceduralCapsule.tsx` and `ParticleField.tsx`. At 60–120 FPS, this generates 240–480 unnecessary object allocations every second (14,400–28,800 objects/minute), creating garbage collection (GC) pressure and frame-time jitter on memory-constrained mobile/tablet devices.

---

## Challenges

### [Medium] Challenge 1: Per-Frame `new THREE.Color()` Allocation in `ProceduralCapsule.tsx`

- **Assumption challenged**: The 3D animation loop in `ProceduralCapsule.tsx` is zero-allocation per frame during continuous scrollytelling execution.
- **Attack scenario**: When the user scrolls through Scene 2 (Problem section) where `dangerMix > 0`, `useFrame` runs at 60–120Hz. In lines 304–305, `new THREE.Color('#FF0844')` and `new THREE.Color('#00F2FE')` are instantiated on every single animation frame rather than reusing cached module-level constants or `useMemo` instances.
- **Blast radius**: Generates 120 object allocations per second during standard 60 FPS rendering (240 obj/sec at 120Hz on ProMotion displays). Over sustained browsing sessions, this triggers periodic JavaScript V8 minor GC sweeps, causing dropped frames (jank) during smooth camera/capsule transitions.
- **Mitigation**: Move `dangerColor` and `targetCyan` outside the React component as static module constants:
  ```ts
  const DANGER_COLOR = new THREE.Color('#FF0844')
  const TARGET_CYAN = new THREE.Color('#00F2FE')
  ```
  And inside `useFrame`, reference `DANGER_COLOR` and `TARGET_CYAN`.

---

### [Medium] Challenge 2: Per-Frame `new THREE.Color()` Allocation in `ParticleField.tsx`

- **Assumption challenged**: The particle coordinate & color interpolation loop in `ParticleField.tsx` reuses internal buffers and does not allocate heap objects during frame updates.
- **Attack scenario**: In `ParticleField.tsx` lines 146–147, `new THREE.Color('#FF0844')` and `new THREE.Color()` (`tempColor`) are created inside the `useFrame` callback on every animation tick.
- **Blast radius**: Multiplies heap churn by an additional 120 objects per second at 60 FPS (240 obj/sec at 120Hz). In combination with Challenge 1, total allocation reaches up to ~28,800 heap objects per minute.
- **Mitigation**: Move `DANGER_COLOR` outside the component scope as a static constant, and allocate `tempColor` via `useRef(new THREE.Color())` or a shared scratchpad instance.

---

## Stress Test Results

| Test ID | Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| **S1.1** | Full scene 3D geometries & materials disposal resilience (100 rapid cycles) | Geometries (`LatheGeometry`, `CylinderGeometry`, `SphereGeometry`, `TorusGeometry`, `BufferGeometry`, `IcosahedronGeometry`) and materials dispose cleanly | 1,800 disposals executed without unhandled errors | **PASS** |
| **S1.2** | Simulated WebGL context loss & recovery lifecycle | `webglcontextlost` cancels default, `webglcontextrestored` recovers state | Handlers prevent default and clear context loss state | **PASS** |
| **S2.1** | Viewport matrix & camera projection resilience across 10 resolutions (4K 3840x2160, ultrawide 3440x1440, 1080p, tablet 768x1024, mobile 375x812, 1px edge) | Projection matrices and lookAt vectors remain 100% finite (no `NaN`, no `Infinity`) | All 10 viewports produced valid finite matrices and responsive camera distances (Z: 6.0 to 7.8) | **PASS** |
| **S2.2** | Rapid viewport resize churn (1,000 consecutive random resize events) | Camera damping remains stable under intense resize thrashing | Camera Z converged smoothly to 6.91 with zero NaN corruption | **PASS** |
| **S3.1** | Continuous render loop simulation (3,000 frames benchmark) | Frame calculation time stays within 16.67ms (60 FPS budget) | Avg frame calculation: 0.242ms (1.5% of budget), P95: 0.369ms, P99: 0.522ms (~4,127 simulated math FPS) | **PASS** |
| **S3.2** | High-frequency GSAP scroll scrubbing (500 rapid cycles 0.0 -> 1.0) | Zero state desynchronization or NaN values across timeline properties | Final camera Z: 6.18, dangerMix: 0.0, zero NaN | **PASS** |
| **S4.1** | Sustained 5,000 frame heap allocation & memory drift audit | Heap memory delta remains bounded (< 5MB) | Heap delta: -5.2MB (stable with GC), no sustained memory accumulation | **PASS** |
| **S4.2** | Static AST audit: geometry, material & per-frame allocations | Zero un-memoized object allocations inside `useFrame` render callbacks | Found 4 un-memoized `new THREE.Color()` allocations inside `useFrame` in `ProceduralCapsule.tsx` and `ParticleField.tsx` | **FAIL** |
| **S5.1** | Extreme parameter fuzzing (`dangerMix` [-100..9999], `progress`, delta [0..10s]) | Math functions handle extreme bounds without crash or NaN | Damping, color lerping, and progress calculations all finite | **PASS** |
| **S5.2** | React ErrorBoundary catch & recovery verification | ErrorBoundary implements `getDerivedStateFromError`, `componentDidCatch`, and fallback UI | Fallback UI with reload capability verified | **PASS** |

---

## Unchallenged Areas

- **GPU Hardware Driver-Specific Shading Quirks**: Pure hardware-level GPU vendor bugs (e.g. proprietary Adreno / Mali GPU precision bugs on low-end Android) were verified mathematically via WebGL GLSL specification compliance, but physical mobile device testing was not conducted.
- **Audio Synthesis / Web Audio**: The site is currently visual-only (no Web Audio API pipeline).
