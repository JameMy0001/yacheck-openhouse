# BRIEFING — 2026-08-18T11:12:45Z

## Mission
Produce a comprehensive, production-ready technical design and TypeScript implementation specification for Milestone 1: Procedural Medicine Capsule (refractive dual-shell, instanced active nano-pellets, orbital rings, exploded view controls) and Bio-Molecular Particle Field (procedural BufferGeometry with 1,500+ nodes and dynamic orbital animation).

## 🔒 My Identity
- Archetype: explorer
- Roles: 3D Graphics Engineer, Three.js/R3F Material Specialist, Procedural Geometry Architect
- Working directory: /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2
- Original parent: 098e47be-c7f2-4a08-8858-f58ee31a0bd6
- Milestone: M1 (Procedural Capsule, Materials & Particle Field)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement source files directly; produce designs and reference code in `.agents/teamwork_preview_explorer_m1_2/`
- Target Three.js r185, @react-three/fiber v9, @react-three/drei v10, React 19, TypeScript strict mode (no unused vars, no implicit any)
- Exploded view and transforms must support reactive GSAP ScrollTrigger timeline props
- Pure procedural generation (zero external .glb/.gltf assets)
- Maximum desktop visual impact & 60fps performance

## Current Parent
- Conversation ID: 098e47be-c7f2-4a08-8858-f58ee31a0bd6
- Updated: 2026-08-18T11:12:45Z

## Investigation State
- **Explored paths**: `PROJECT.md`, `ORIGINAL_REQUEST.md`, `package.json`, `tsconfig.app.json`, `src/App.tsx`, `.agents/teamwork_preview_explorer_m1_1/DISPATCH.md`, `.agents/teamwork_preview_explorer_survey_2/analysis.md`
- **Key findings**:
  - Full procedural design for `ProceduralCapsule.tsx` using lathe geometry, `MeshPhysicalMaterial` transmission optics (`ior: 1.54`, `thickness: 0.85`), 140 instanced glowing pellets (`<instancedMesh>`), 3 orbital rings, and dynamic exploded view state machine.
  - Full procedural design for `ParticleField.tsx` using `BufferGeometry` for 1,800 bio-molecular nodes, orbital velocity vector field in `useFrame`, dynamic danger warning color morphing, and constellation links.
  - Both components require only $\approx 9$ GPU draw calls combined.
- **Unexplored areas**: None for M1 capsule and particle field design.

## Key Decisions Made
- Used procedural lathe profiles instead of monolithic capsule geometry to achieve physically accurate independent top/bottom shell rendering and clean exploded view translations.
- Used `<instancedMesh>` with precomputed rejection sampling for internal active pellets, delivering 60fps with 1 draw call.
- Integrated `THREE.LineSegments` for molecular constellation links connecting core nodes.

## Artifact Index
- `/Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2/analysis.md` — Complete technical specifications, geometry math, optical parameters, and full TypeScript code listings.
- `/Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_explorer_m1_2/handoff.md` — 5-component formal handoff report.
