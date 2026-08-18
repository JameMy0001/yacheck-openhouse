# Technical Analysis & Architectural Blueprint: Awwwards-Level 3D WebGL Site for YaCheck

**Author**: `teamwork_preview_explorer_survey_3` (3D Architecture, Shaders & Scrollytelling Survey)  
**Target Project**: YaCheck 3D Promotional Experience (`/Users/mac/Desktop/OpenHouse-3D`)  
**Date**: 2026-08-18  

---

## Executive Summary

This document establishes the comprehensive technical architecture and visual design blueprint for transforming the YaCheck promotional website into an **Awwwards "Site of the Day" caliber 3D WebGL experience**. 

Because no external 3D CAD/GLTF models are provided, all 3D assets and visual effects are generated **100% procedurally in code** using Three.js, `@react-three/fiber`, `@react-three/drei`, custom GLSL vertex/fragment shaders, instanced particle systems, and advanced optical materials (`MeshPhysicalMaterial`).

The architecture seamlessly orchestrates **4 core pillars**:
1. **Procedural 3D Visual Strategy**: Photorealistic dual-tone glass/ceramic capsule with 100+ instanced internal bio-pellets, simplex-noise dynamic neural cores, holographic scan rings, and 2,500+ turbulence-driven ambient particles.
2. **GSAP ScrollTrigger Scrollytelling**: A unified 5-scene timeline driving camera trajectories, mesh spatial transformations, shader distortion/warning uniforms, and exploded-view component disassemblies with inertial scrubbing.
3. **Post-Processing & 60fps Optimization**: High-performance `@react-three/postprocessing` pipeline with selective mipmap Bloom, chromatic aberration, film noise, and ACES Filmic tone mapping optimized for smooth 60fps on modern devices.
4. **Futuristic Glassmorphic UI**: 5 full-height responsive Tailwind CSS sections featuring dark cyber-medical glassmorphism (`backdrop-blur-xl`, obsidian & bio-cyan palette, glowing badges, HUD indicators, and pointer-event passthroughs).

---

## 1. Procedural 3D Visual Strategy (No External Models)

To achieve maximum visual prestige without 3D asset downloads, we utilize procedural primitives, physical transmission materials, and custom GLSL shaders.

```
+-----------------------------------------------------------------------------------+
|                            YaCheck Procedural 3D Scene                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|      +---------------------+        +---------------------+        +-----------+  |
|      | Top Shell (Glass)   |        | Bottom Shell (Opal) |        | Neural    |  |
|      | MeshPhysicalMaterial|        | MeshPhysicalMaterial|        | Core      |  |
|      | - Transmission 0.95 |        | - Metalness 0.4     |        | Custom    |  |
|      | - Roughness 0.05    |        | - Clearcoat 1.0     |        | Simplex   |  |
|      | - Thickness 1.2     |        | - Color: Bio-Blue   |        | Noise GLSL|  |
|      +----------+----------+        +----------+----------+        +-----+-----+  |
|                 |                              |                         |        |
|                 +-----------------------+------+-------------------------+        |
|                                         |                                         |
|                          +--------------v--------------+                          |
|                          |    Main YaCheck Capsule     |                          |
|                          |       Assembly Group        |                          |
|                          +--------------+--------------+                          |
|                                         |                                         |
|                 +-----------------------+----------------------+                  |
|                 |                                              |                  |
|      +----------v----------+                        +----------v----------+       |
|      | Instanced Pellets   |                        | Holographic Rings   |       |
|      | 120x Micro-Spheres  |                        | Concentric Torus /  |       |
|      | Multi-color Emissive|                        | Custom Fresnel Ring |       |
|      +---------------------+                        +---------------------+       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Ambient Particle Matrix: 2,500 Points with Curl Noise & Depth Attenuation   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 1.1 The Dual-Tone Photorealistic Smart Capsule

The hero centerpiece is an ultra-detailed procedural medicine capsule composed of three co-axial components:

1. **Upper Capsule Shell (Optical Gel / Glass)**:
   - **Geometry**: `CapsuleGeometry(0.6, 0.8, 32, 64)` or composite `CylinderGeometry` + `SphereGeometry` with clipping planes.
   - **Material**: `MeshPhysicalMaterial`:
     ```typescript
     transmission: 0.96,        // High optical transparency
     roughness: 0.06,           // Crisp specular reflections
     metalness: 0.05,
     ior: 1.52,                 // Glass/resin index of refraction
     thickness: 1.4,            // Light refraction depth
     attenuationColor: '#00f0ff', // Bio-cyan internal color absorption
     attenuationDistance: 0.8,
     clearcoat: 1.0,            // Mirror-like wet clearcoat finish
     clearcoatRoughness: 0.08,
     envMapIntensity: 1.8
     ```
2. **Internal Active Pharmaceutical Pellets (Instanced Spheres)**:
   - 80–150 micro-spheres (`InstancedMesh`) nestled inside the transparent shell.
   - Matrices generated procedurally inside a bounded cylinder/hemisphere volume using rejection sampling:
     $$\sqrt{x^2 + z^2} \le r_{\text{inner}},\quad y_{\text{min}} \le y \le y_{\text{max}}$$
   - Randomized color palette: Cyan (`#00f0ff`), Magenta (`#ec4899`), Electric Gold (`#fbbf24`), and Pure Emissive White (`#ffffff`).
   - Gentle floating/vibration physics animated in `useFrame` via trigonometric offsets.
3. **Lower Capsule Shell (Ceramic / Metallic Medical Blue)**:
   - **Material**: `MeshPhysicalMaterial`:
     ```typescript
     color: '#1d4ed8',          // Deep medical royal blue
     roughness: 0.18,
     metalness: 0.35,
     clearcoat: 0.9,
     clearcoatRoughness: 0.1,
     reflectivity: 0.8
     ```
4. **Equatorial Holographic Seam Ring**:
   - A slender `TorusGeometry(0.61, 0.02, 16, 100)` located at the junction with high emissive cyan intensity (`emissive: '#00f0ff'`, `emissiveIntensity: 4.0`) that pulses with system activity.

---

### 1.2 Custom GLSL Shader: Neural AI Core & Warning Interaction

When the user navigates between the **Hero** (calm AI) and **Problem** (dangerous drug interaction), the capsule's core transforms via a custom GLSL ShaderMaterial driven by 3D Simplex / Perlin noise.

#### Vertex Shader (`neuralVertex.glsl`):
```glsl
uniform float uTime;
uniform float uDistortion;
uniform float uFrequency;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

// Classic 3D Simplex Noise algorithm
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  
  // Calculate dynamic 3D noise offset
  float noise = snoise(position * uFrequency + vec3(uTime * 0.5));
  vNoise = noise;
  
  // Displace along vertex normal
  vec3 newPosition = position + normal * (noise * uDistortion);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

#### Fragment Shader (`neuralFragment.glsl`):
```glsl
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorDanger;
uniform float uDangerMix; // 0.0 = Safe (Cyan/Blue), 1.0 = Dangerous Interaction (Red/Amber)
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main() {
  // Fresnel calculation for rim glow
  vec3 viewDirection = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), uFresnelPower);
  
  // Mix base bio-cyan color with danger red/amber
  vec3 activeColor = mix(uColorBase, uColorDanger, uDangerMix);
  
  // Pulsing scanlines
  float scanline = sin(vPosition.y * 30.0 + uTime * 4.0) * 0.15 + 0.85;
  
  // Core emission
  vec3 finalColor = activeColor * (1.0 + vNoise * 0.6) * scanline;
  finalColor += activeColor * fresnel * 2.5; // High emissive bloom edge
  
  gl_FragColor = vec4(finalColor, 0.85 + fresnel * 0.15);
}
```

---

### 1.3 Molecular Lattice & Ambient Neural Particle Matrix

1. **Ambient Particle Cloud**:
   - 2,500 points created using `THREE.BufferGeometry` with custom attribute `aScale` and `aRandomness`.
   - Fragment shader uses radial distance discarding to render soft glowing Gaussian spheres without square pixel edges:
     ```glsl
     float dist = length(gl_PointCoord - vec2(0.5));
     if (dist > 0.5) discard;
     float alpha = smoothstep(0.5, 0.0, dist);
     gl_FragColor = vec4(uColor, alpha * 0.8);
     ```
   - Particles follow subtle curl noise orbits around the main capsule.
2. **Scanner Reticle & Holographic Rings**:
   - Concentric thin rings (`RingGeometry` or `TorusGeometry`) that rotate in alternating directions with dashed polar shaders, mimicking an AI diagnostic HUD scanning the medication.

---

## 2. GSAP ScrollTrigger Scrollytelling Architecture

### 2.1 The 5-Scene Core Choreography Table

The page height is structured across **5 full-screen sections** (`500vh` scroll height). GSAP ScrollTrigger binds scroll progress directly to **4 categories of 3D scene properties**:
1. **Camera**: Position $(x, y, z)$, Target look-at $(x, y, z)$, and FOV.
2. **Capsule Group**: Position $(x, y, z)$, Euler Rotation $(x, y, z)$, and Scale $(s)$.
3. **Capsule Internal Geometry**: Shell separation distance (explosion offset for exploded view), pellet dispersal factor.
4. **Shader Uniforms**: `uDistortion`, `uDangerMix`, `uScanGlow`, `uHoloWireframe`.

| Scene # | Section & Theme | Scroll Range | 3D Camera $[x, y, z]$ | Capsule Group $[x, y, z]$ & Rot $[x, y, z]$ | Shader / Mesh Mutation State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Scene 1** | **Hero**<br>AI Medical Intelligence | `0.00 – 0.20` | `[0, 0, 5.0]`<br>FOV: 45° | Pos: `[0, 0, 0]`<br>Rot: `[0.3, 0.2, 0]` | **State: Floating Calm**<br>`uDistortion: 0.08`<br>`uDangerMix: 0.0` (Cyan)<br>Intact capsule, gentle hovering. |
| **Scene 2** | **Problem**<br>Drug Interaction Risk | `0.20 – 0.40` | `[1.2, 0.2, 3.4]`<br>FOV: 42° (Dolly In) | Pos: `[-1.6, 0.2, 0]`<br>Rot: `[0.8, -1.2, 0.4]` | **State: Turbulent Danger**<br>`uDistortion: 0.85` (Severe spikes)<br>`uDangerMix: 1.0` (Vivid Crimson/Amber)<br>Shells separate 0.5 units; inner core erupts. |
| **Scene 3** | **Solutions**<br>AI Scanner & Reminders | `0.40 – 0.60` | `[-1.4, 0.4, 3.8]`<br>FOV: 45° | Pos: `[1.7, -0.1, 0]`<br>Rot: `[0.2, 2.8, -0.3]` | **State: Holographic AI Scan**<br>`uDistortion: 0.05` (Calmed)<br>`uDangerMix: 0.0`<br>`uScanGlow: 1.0` (Laser sweep across mesh). |
| **Scene 4** | **Under the Hood**<br>Tech Architecture Specs | `0.60 – 0.80` | `[0, 2.8, 4.6]`<br>FOV: 50° (Overhead) | Pos: `[0, 0.5, 0]`<br>Rot: `[1.2, 3.14, 0]` | **State: Exploded View**<br>Top shell floats up $+1.5$, bottom down $-1.5$.<br>Pellets expand radially into crystal grid.<br>Holographic wireframe rings activate. |
| **Scene 5** | **CTA**<br>Download & Booth C-04 | `0.80 – 1.00` | `[0, 0, 4.2]`<br>FOV: 45° | Pos: `[0, 0, 0]`<br>Rot: `[0, 6.28, 0.2]` | **State: Climax / Re-assembly**<br>Capsule snaps back together.<br>Max Bloom emission boost.<br>Ambient particles expand outwards in celebration. |

---

### 2.2 GSAP Integration Implementation Strategy

To ensure zero memory leaks, smooth scrubbing, and full React lifecycle safety, use `gsap.context()` inside a `useLayoutEffect` or `useEffect` hook:

```typescript
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface Scene3DState {
  capsuleGroup: THREE.Group
  topShell: THREE.Mesh
  bottomShell: THREE.Mesh
  pelletsGroup: THREE.Group
  neuralMaterial: THREE.ShaderMaterial
  camera: THREE.PerspectiveCamera
}

export function useScrollytellingTimeline(
  containerRef: React.RefObject<HTMLDivElement | null>,
  sceneRefs: React.RefObject<Scene3DState | null>
) {
  useEffect(() => {
    if (!containerRef.current || !sceneRefs.current) return

    const {
      capsuleGroup,
      topShell,
      bottomShell,
      pelletsGroup,
      neuralMaterial,
      camera
    } = sceneRefs.current

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Silk-smooth inertial scrubbing
        }
      })

      // ==========================================
      // SECTION 1 -> 2: HERO TO PROBLEM (0.0 -> 0.25)
      // ==========================================
      tl.to(capsuleGroup.position, { x: -1.6, y: 0.2, z: 0, ease: 'power1.inOut' }, 0)
        .to(capsuleGroup.rotation, { x: 0.8, y: -1.2, z: 0.4, ease: 'power1.inOut' }, 0)
        .to(camera.position, { x: 1.2, y: 0.2, z: 3.4, ease: 'power1.inOut' }, 0)
        // Shader Danger Uniforms
        .to(neuralMaterial.uniforms.uDistortion, { value: 0.85, ease: 'power2.in' }, 0.05)
        .to(neuralMaterial.uniforms.uDangerMix, { value: 1.0, ease: 'power2.in' }, 0.05)
        // Partial shell separation
        .to(topShell.position, { y: 0.4, ease: 'power1.out' }, 0.08)
        .to(bottomShell.position, { y: -0.4, ease: 'power1.out' }, 0.08)

      // ==========================================
      // SECTION 2 -> 3: PROBLEM TO SOLUTIONS (0.25 -> 0.50)
      // ==========================================
      tl.to(capsuleGroup.position, { x: 1.7, y: -0.1, z: 0, ease: 'power2.inOut' }, 0.25)
        .to(capsuleGroup.rotation, { x: 0.2, y: 2.8, z: -0.3, ease: 'power2.inOut' }, 0.25)
        .to(camera.position, { x: -1.4, y: 0.4, z: 3.8, ease: 'power2.inOut' }, 0.25)
        // Restore calm cyan shader & activate scan
        .to(neuralMaterial.uniforms.uDistortion, { value: 0.05, ease: 'power2.out' }, 0.25)
        .to(neuralMaterial.uniforms.uDangerMix, { value: 0.0, ease: 'power2.out' }, 0.25)
        .to(topShell.position, { y: 0.0, ease: 'power2.inOut' }, 0.25)
        .to(bottomShell.position, { y: 0.0, ease: 'power2.inOut' }, 0.25)

      // ==========================================
      // SECTION 3 -> 4: SOLUTIONS TO SPECS (0.50 -> 0.75)
      // ==========================================
      tl.to(capsuleGroup.position, { x: 0, y: 0.5, z: 0, ease: 'power2.inOut' }, 0.50)
        .to(capsuleGroup.rotation, { x: 1.2, y: Math.PI * 2, z: 0, ease: 'power2.inOut' }, 0.50)
        .to(camera.position, { x: 0, y: 2.8, z: 4.6, ease: 'power2.inOut' }, 0.50)
        // Exploded View Disassembly
        .to(topShell.position, { y: 1.5, ease: 'elastic.out(1, 0.75)' }, 0.55)
        .to(bottomShell.position, { y: -1.5, ease: 'elastic.out(1, 0.75)' }, 0.55)
        .to(pelletsGroup.scale, { x: 1.8, y: 1.8, z: 1.8, ease: 'power2.out' }, 0.55)

      // ==========================================
      // SECTION 4 -> 5: SPECS TO CTA (0.75 -> 1.00)
      // ==========================================
      tl.to(capsuleGroup.position, { x: 0, y: 0, z: 0, ease: 'power3.inOut' }, 0.75)
        .to(capsuleGroup.rotation, { x: 0, y: Math.PI * 4, z: 0.2, ease: 'power3.inOut' }, 0.75)
        .to(camera.position, { x: 0, y: 0, z: 4.2, ease: 'power3.inOut' }, 0.75)
        // Snap back into solid unity
        .to(topShell.position, { y: 0.0, ease: 'back.out(1.7)' }, 0.80)
        .to(bottomShell.position, { y: 0.0, ease: 'back.out(1.7)' }, 0.80)
        .to(pelletsGroup.scale, { x: 1.0, y: 1.0, z: 1.0, ease: 'power2.inOut' }, 0.80)
    }, containerRef)

    return () => ctx.revert() // Cleanly removes all ScrollTriggers on unmount
  }, [containerRef, sceneRefs])
}
```

---

### 2.3 Layered Micro-Interactions (Mouse Parallax + Float)

In addition to scroll progress, the 3D scene incorporates continuous organic dynamics via `useFrame`:
- **Floating Hover Oscillation**:
  $$\Delta y(t) = \sin(t \times 1.5) \times 0.08,\quad \Delta \text{rot}_z(t) = \cos(t \times 1.2) \times 0.04$$
- **Damped Mouse Parallax**:
  Cursor position $[x, y] \in [-1, 1]$ smoothly steers camera orientation using `THREE.MathUtils.damp`:
  ```typescript
  useFrame((state, delta) => {
    const { pointer, camera } = state
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -pointer.x * 0.15, 3, delta)
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, pointer.y * 0.15, 3, delta)
  })
  ```

---

## 3. Post-Processing Architecture & 60fps Optimization

To deliver cinematic quality (glowing lasers, refractive diffusion, filmic contrast) while guaranteeing steady 60fps performance, we configure `@react-three/postprocessing`.

### 3.1 Post-Processing Dependency Audit

**Critical Finding**: In the current `package.json`, `@react-three/postprocessing` and `postprocessing` are not listed. The implementation milestone must install them:
```bash
npm install @react-three/postprocessing postprocessing
```

### 3.2 Post-Processing Effects Pipeline

```typescript
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette, 
  ToneMapping 
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

export function PostProcessingEffects() {
  return (
    <EffectComposer 
      multisampling={0}              // Offload MSAA to post-process passes
      disableNormalPass={true}       // Disable unneeded G-Buffer passes
    >
      {/* 1. Mipmap Bloom: Silky soft glow on emissive meshes */}
      <Bloom
        intensity={1.3}
        luminanceThreshold={0.65}     // Only elements brighter than 0.65 trigger bloom
        luminanceSmoothing={0.8}
        mipmapBlur={true}            // Essential: Multi-scale blur removes pixelated fireflies
        radius={0.7}
      />

      {/* 2. Chromatic Aberration: Optical lens refraction at screen edges */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0018, 0.0018)}
        radialModulation={true}      // Center remains sharp; edges diffract
        modulationOffset={0.4}
      />

      {/* 3. Film Grain: Eliminates dark color banding & adds cinematic texture */}
      <Noise
        opacity={0.035}
        blendFunction={BlendFunction.OVERLAY}
      />

      {/* 4. Vignette: Focuses eye on center 3D capsule */}
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.75}
      />

      {/* 5. ACES Filmic ToneMapping: High dynamic range color preservation */}
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
      />
    </EffectComposer>
  )
}
```

### 3.3 60 FPS Performance Optimization Matrix

| Optimization Technique | Implementation Strategy | Performance Impact |
| :--- | :--- | :--- |
| **DPR Clamping** | `<Canvas dpr={[1, 1.8]}>` | Prevents rendering at $3\times$ or $4\times$ retina pixel density ($>8$M pixels). |
| **Mipmap Blur for Bloom** | `mipmapBlur={true}` in `<Bloom>` | Uses downsampled mip levels for Gaussian blur ($10\times$ faster than large-kernel full-res blur). |
| **Instanced Geometries** | Single `<instancedMesh>` with 150 instances for pellets | Reduces 150 draw calls down to **1 single draw call**. |
| **Disable Normal Pass** | `disableNormalPass={true}` on `EffectComposer` | Saves 1 full geometry render pass per frame. |
| **Alpha & Stencil Flag Tuning**| `gl={{ powerPreference: 'high-performance', antialias: false, stencil: false }}` | Minimizes WebGL framebuffer allocation and memory bandwidth. |
| **Adaptive DPR / FPS Guard** | Drei `<AdaptiveDpr pixelated />` or `<PerformanceMonitor>` | Gracefully lowers resolution if GPU frame budget exceeds 16.6ms. |

---

## 4. UI Overlay & Responsive Glassmorphic Layout

The HTML layer sits on top of the fixed full-screen WebGL canvas via `pointer-events-none` on containers and `pointer-events-auto` on interactive glass cards.

### 4.1 Visual Design Tokens (Tailwind CSS v4)

- **Background Obsidian**: `#050811` (Deep dark slate with subtle radial glow).
- **Bio-Cyan Accent**: `#00f0ff` / `text-cyan-400` / `border-cyan-500/30`.
- **Medical Electric Blue**: `#3b82f6` / `text-blue-500` / `bg-blue-600`.
- **Danger Alert Coral**: `#f43f5e` / `text-rose-400` / `border-rose-500/40`.
- **Glassmorphic Card Utility**:
  `backdrop-blur-2xl bg-white/[0.03] border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] rounded-3xl`

---

### 4.2 Section-by-Section UI Specification

```
+-----------------------------------------------------------------------------------+
| Scene 1: HERO                                                                     |
|  [Badge: AI Medication Intelligence]                                              |
|  Title: YaCheck (9xl Gradient Text)                                               |
|  Subtitle: แอปพลิเคชันผู้ช่วยจัดการและแจ้งเตือนการทานยาอัจฉริยะ (Thai/En)          |
|  [CTA Button: สแกนทดลองใช้งาน]       [Scroll Down Indicator: Laser Reticle]        |
+-----------------------------------------------------------------------------------+
| Scene 2: THE PROBLEM (ยาตีกัน... อันตรายกว่าที่คิด)                               |
|  [Left Glass Card]                                                                |
|  - Red Alert Badge: Drug-Drug & Food-Drug Interaction Risks                       |
|  - Stat: 30%+ Polypharmacy Risks in Chronic Patients                              |
|  - Warning Copy: การทานยาหลายชนิดร่วมกันอาจเกิดปฏิกิริยารุนแรง...                 |
+-----------------------------------------------------------------------------------+
| Scene 3: CORE FEATURES (ฟีเจอร์อัจฉริยะ)                                          |
|                                                               [Right Glass Stack] |
|                                             - 📸 AI Visual Scanner (Pill ID)      |
|                                             - ⏰ Smart Circadian Reminder          |
|                                             - 👨‍👩‍👧‍👦 Caregiver Link & Family Sync      |
+-----------------------------------------------------------------------------------+
| Scene 4: UNDER THE HOOD (Architecture Specs)                                      |
|  [Center Glass Dashboard Grid - 4 Pillars]                                        |
|  [ Expo / React Native ]   [ Local-First SQLite ]   [ Multimodal AI ]  [ Supabase]|
|  - <50ms Local Lookups     - CRDT Offline Sync      - 99.4% Pill Model - Edge RLS |
+-----------------------------------------------------------------------------------+
| Scene 5: CALL TO ACTION (ทดลองใช้งาน YaCheck)                                     |
|  [Center Glass Portal Card]                                                       |
|  - Title: สัมผัสประสบการณ์ดูแลการทานยาด้วย AI                                     |
|  - OpenHouse 2026 Booth: บูธ C-04 โซน Health Tech                                 |
|  - [ Primary Button: ดาวน์โหลดแอป ]   [ Secondary: ดูเอกสารเทคนิค ]               |
+-----------------------------------------------------------------------------------+
```

---

## 5. Architectural Directory Layout Proposal

To keep the codebase modular, clean, and extensible for upcoming worker milestones:

```
src/
├── components/
│   ├── 3d/
│   │   ├── CanvasContainer.tsx       # Canvas wrapper, lights, camera & PostProcessing
│   │   ├── YaCheckCapsule.tsx        # Dual-tone procedural capsule & instanced pellets
│   │   ├── NeuralCoreMesh.tsx        # Simplex noise GLSL vertex/fragment core
│   │   ├── HolographicRings.tsx      # HUD scanner reticles & concentric rings
│   │   ├── AmbientParticles.tsx      # 2,500 point cloud with curl noise
│   │   └── PostProcessingPipeline.tsx# Bloom, Chromatic Aberration, Noise, ToneMapping
│   ├── ui/
│   │   ├── Navbar.tsx                # Fixed header with logo & booth badge
│   │   ├── HeroSection.tsx           # Scene 1 UI overlay
│   │   ├── ProblemSection.tsx        # Scene 2 UI overlay (Risk alerts)
│   │   ├── FeaturesSection.tsx       # Scene 3 UI overlay (AI Features)
│   │   ├── SpecsSection.tsx          # Scene 4 UI overlay (Under the Hood specs)
│   │   ├── CtaSection.tsx            # Scene 5 UI overlay (Download & Booth C-04)
│   │   └── GlassCard.tsx             # Reusable glassmorphic UI container
│   └── hooks/
│       ├── useScrollytelling.ts      # GSAP ScrollTrigger timeline orchestrator
│       └── useMouseParallax.ts       # Cursor parallax & floating lerp
├── shaders/
│   ├── neuralVertex.glsl.ts          # Simplex noise vertex displacement
│   └── neuralFragment.glsl.ts        # Dynamic danger Fresnel & scanlines
├── App.tsx                           # Root orchestrator combining 3D & HTML layers
├── index.css                         # Tailwind v4 configuration & base styles
└── main.tsx                          # React 19 entry point
```

---

## 6. Implementation Readiness & Risk Mitigation

1. **Dependency Installation**:
   - Ensure `@react-three/postprocessing` and `postprocessing` are added to `package.json`.
2. **React 19 Compatibility**:
   - Verify `@react-three/fiber` v9.7.0 and `@react-three/postprocessing` mount cleanly without React 19 peer dependency warnings (`npm install --legacy-peer-deps` or standard npm if resolved).
3. **Scroll Jitter Prevention**:
   - Ensure GSAP ScrollTrigger timeline uses `scrub: 1.0` to `1.5` for momentum smoothing.
   - Use `gsap.context()` for clean teardown and hot reload stability.
4. **Mobile & Low-End GPU Fallbacks**:
   - Wrap `<EffectComposer>` with device detection; on low-power devices, gracefully reduce particle count to 1,000 and disable chromatic aberration while preserving bloom.
