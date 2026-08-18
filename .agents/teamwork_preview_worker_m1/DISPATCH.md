## 2026-08-18T11:13:18Z

You are the implementation worker agent (teamwork_preview_worker_m1).
Your working directory is /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_worker_m1.
Project root: /Users/mac/Desktop/OpenHouse-3D.
Authoritative requirements: /Users/mac/Desktop/OpenHouse-3D/.agents/ORIGINAL_REQUEST.md.
Project plan: /Users/mac/Desktop/OpenHouse-3D/PROJECT.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Technical Designs & Explorer Findings to review before writing code:
- Shader & Postprocessing Design: /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_1/analysis.md
- Procedural 3D & Materials Design: /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2/analysis.md
- Scene & Integration Plan: /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_3/analysis.md
- E2E Test Suite & Runner: /Users/mac/Desktop/OpenHouse-3D/tests/e2e-verification.ts and TEST_READY.md

Your Task (Milestone 1 Implementation):
1. Install dependencies: Run `npm i @react-three/postprocessing postprocessing lucide-react` in the project directory.
2. Fix TS6133 compilation errors in `src/main.tsx` and create `src/components/common/ErrorBoundary.tsx` so that `npm run build` passes cleanly.
3. Implement `src/shaders/AuraShaderMaterial.ts` (and/or `src/components/shaders/AuraShaderMaterial.ts` with re-export) using `@react-three/drei` `shaderMaterial` with raw GLSL: Simplex 3D noise vertex displacement, normal transformations, dynamic time pulsing, Fresnel rim glow, scanlines, dual-palette color interpolation (Safe Cyan #00F2FE -> Danger Crimson #FF0844), and uniforms (`uTime`, `uProgress`, `uDangerMix`, `uScanGlow`, `uDistortion`). Include proper TypeScript / R3F JSX element declarations.
4. Implement `src/components/3d/ProceduralCapsule.tsx`: Dual-shell geometry with top shell `MeshPhysicalMaterial` (transmission 0.95, roughness 0.05, ior 1.54, thickness 0.85, clearcoat 1.0), bottom shell high-gloss cyan, 140-node instanced glowing medicine pellets (`<instancedMesh>`), central energy core, and exploded view transform animation.
5. Implement `src/components/3d/ParticleField.tsx`: Pure procedural `BufferGeometry` particle system with 1,800+ nodes, orbital animation, sinusoidal velocity vectors, dynamic danger color morphing, and molecular constellation line links.
6. Implement `src/components/3d/HologramAura.tsx`: Connecting custom shader material to geometry and animation uniforms.
7. Implement `src/components/3d/PostProcessing.tsx`: `@react-three/postprocessing` `<EffectComposer>`, selective `Bloom` (`mipmapBlur={true}`), radial `ChromaticAberration`, `Vignette`, and ACES Filmic `ToneMapping`.
8. Implement `src/components/3d/Scene.tsx`: Responsive R3F `<Canvas>`, cinematic 6-point studio lighting, responsive camera controller, and composing ProceduralCapsule, ParticleField, HologramAura, and PostProcessing.
9. Connect `Scene.tsx` into `src/App.tsx` cleanly while keeping the 5 sections intact.
10. Run `npm run build` and `npm run test:e2e` to verify zero TypeScript errors and milestone test improvements.
11. Document all created files, executed commands, and build/test outputs in /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_worker_m1/changes.md and write a complete handoff report to /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_worker_m1/handoff.md. Send a completion message when done.
