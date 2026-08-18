## 2026-08-18T11:11:15Z
You are an exploration agent (teamwork_preview_explorer_m1_1).
Your working directory is /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_1.
Project root: /Users/mac/Desktop/OpenHouse-3D.
Authoritative requirements: /Users/mac/Desktop/OpenHouse-3D/.agents/ORIGINAL_REQUEST.md.
Project plan: /Users/mac/Desktop/OpenHouse-3D/PROJECT.md.

Your task is to produce a detailed technical design for Milestone 1 (Custom GLSL Shader & Post-Processing):
1. Design `src/components/shaders/AuraShaderMaterial.ts` using Three.js `shaderMaterial` or `THREE.ShaderMaterial` with raw GLSL:
   - Vertex shader: Simplex 3D noise vertex displacement, normal calculation, position transformation, varying UV and normal.
   - Fragment shader: Dynamic time-based pulsing, Fresnel glowing rim, scanline wave effect, color interpolation between safe cyan/emerald (#00F2FE / #4FACFE) and danger crimson (#FF0844 / #FFB199), uniforms (`uTime`, `uProgress`, `uDangerMix`, `uScanGlow`, `uDistortion`).
2. Design `src/components/3d/PostProcessing.tsx` using `@react-three/postprocessing`:
   - `EffectComposer` with `Bloom` (selective luminance threshold, radius, intensity), `ChromaticAberration` (radial offset), `Vignette`, and `ToneMapping`.
3. Provide complete, syntactically correct TypeScript and GLSL code examples.
4. Write your analysis to /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_1/analysis.md and handoff report to /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_1/handoff.md.
