## 2026-08-18T11:11:16Z
You are an exploration agent (teamwork_preview_explorer_m1_2).
Your working directory is /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2.
Project root: /Users/mac/Desktop/OpenHouse-3D.
Authoritative requirements: /Users/mac/Desktop/OpenHouse-3D/.agents/ORIGINAL_REQUEST.md.
Project plan: /Users/mac/Desktop/OpenHouse-3D/PROJECT.md.

Your task is to produce a detailed technical design for Milestone 1 (Procedural Capsule, Materials & Particle Field):
1. Design `src/components/3d/ProceduralCapsule.tsx`:
   - High-refraction top shell using `MeshPhysicalMaterial` (transmission: 0.95, roughness: 0.05, ior: 1.54, thickness: 0.8, clearcoat: 1.0, color: '#ffffff').
   - High-gloss bottom shell using `MeshPhysicalMaterial` (color: '#00F2FE', metalness: 0.1, roughness: 0.15, clearcoat: 1.0).
   - Internal active medicine pellets (instanced spheres inside the glass shell, colored glowing cyan, emerald, and amber).
   - Floating molecular connection nodes and orbital glowing rings with `MeshStandardMaterial` / `MeshBasicMaterial`.
   - Exploded view transform controls (top shell shifts up, bottom shell shifts down, pellets disperse).
2. Design `src/components/3d/ParticleField.tsx`:
   - Pure procedural `BufferGeometry` particle system with 1,500+ bio-molecular nodes.
   - Dynamic orbital movement and noise-based floating animation in `useFrame`.
3. Provide complete, syntactically correct TypeScript code.
4. Write your analysis to /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2/analysis.md and handoff report to /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2/handoff.md.
