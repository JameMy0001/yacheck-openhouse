# Dispatch: Worker Final GC Optimization

Working directory: /Users/mac/Desktop/OpenHouse-3D/.agents/teamwork_preview_worker_final_gc
Workspace: /Users/mac/Desktop/OpenHouse-3D
Original Request: /Users/mac/Desktop/OpenHouse-3D/.agents/ORIGINAL_REQUEST.md

## Objective
Hoist `new THREE.Color()` object instantiations out of `useFrame` animation loop callbacks in:
1. `src/components/3d/ProceduralCapsule.tsx` (around lines 304-305: move `DANGER_COLOR` / `TARGET_CYAN` and any other color allocations to module-level constants or component-level refs so no new objects are allocated per-frame at 60/120fps).
2. `src/components/3d/ParticleField.tsx` (around lines 146-147: move color instances or temporary color objects to module-level constants or pre-allocated objects).

## Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Verification
Run `npm run build` and `npm run test:e2e` and `node --experimental-strip-types tests/adversarial-stress.ts` to ensure 0 TypeScript errors and all tests pass.
Write your `handoff.md` and report back.
