# Original User Request

## 2026-08-18T11:07:56Z

# Teamwork Project Prompt — Draft

Build a highly polished, "Awwwards-style" 3D WebGL promotional website for YaCheck (an AI-powered medication management app) using React Three Fiber and GSAP ScrollTrigger. The site must feature high-end 3D visual effects generated via code, smooth scrollytelling animations, and a spectacular design focusing on maximum desktop visual impact.

Working directory: /Users/mac/Desktop/OpenHouse-3D
Integrity mode: development

## Requirements

### R1. Awwwards-Level Procedural 3D Visuals
The team must implement spectacular, high-end 3D visual effects using React Three Fiber. Since no external 3D models are provided, the visuals must be generated procedurally through code. This should include custom shaders, complex particle systems, or glass/refractive materials (`MeshPhysicalMaterial`), aiming for maximum "wow" factor on desktop.

### R2. Smooth Scrollytelling Architecture
Implement a seamless scroll-based animation system using GSAP ScrollTrigger. The procedural 3D elements must animate, transition, and mutate smoothly across the scroll progress.

### R3. Complete 5-Scene Implementation
Fully build out the 5 sections of the promotional website (Hero, Problem, Core Features, Specs, CTA). The HTML overlay must be styled with Tailwind CSS to match the high-end, futuristic aesthetic of the 3D scene.

## Acceptance Criteria

### Technical & Compilation
- [ ] The application successfully compiles via `npm run build` with zero TypeScript errors.

### Visual & Shader Implementation (Agent-as-judge)
- [ ] The codebase contains at least one custom shader implementation (using `shaderMaterial`, `THREE.ShaderMaterial`, or raw GLSL injections).
- [ ] The codebase integrates advanced post-processing effects (e.g., Bloom, DOF, Chromatic Aberration) using `@react-three/postprocessing`.

### Scroll Integration (Programmatic/Agent-as-judge)
- [ ] GSAP `ScrollTrigger` is actively bound to at least 3 distinct properties of the 3D scene (e.g., camera position, mesh rotation, shader uniforms) across the scroll timeline.

### Content Structure
- [ ] The React component tree renders 5 distinct, full-height `<section>` elements containing the YaCheck promotional copy.
