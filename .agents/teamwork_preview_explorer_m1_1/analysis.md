# Milestone 1 Technical Design: Custom GLSL Shader & Post-Processing Pipeline

**Project**: YaCheck 3D WebGL Promotional Website  
**Milestone**: M1 (Custom GLSL Shader & Post-Processing)  
**Target Files**:
- `src/components/shaders/AuraShaderMaterial.ts`
- `src/components/3d/PostProcessing.tsx`
- `src/components/3d/HologramAura.tsx` (Integration reference)

---

## 1. Executive Summary & Architecture Overview

The YaCheck 3D promotional website requires an Awwwards-caliber procedural visual identity representing an intelligent AI medication management platform. In the absence of external 3D asset files (`.glb`/`.gltf`), visual quality is achieved through mathematical procedural generation:
1. **Custom GLSL Shader Material (`AuraShaderMaterial`)**: An organic, holographic energy shield enveloping the procedural medicine capsule. It utilizes 3D Simplex noise for vertex displacement, view-vector Fresnel formulas for luminous rim glows, dynamic scanlines for a medical-scanner motif, and smooth color palette transitions (Safe Cyan/Sky Blue `#00F2FE`/`#4FACFE` to Danger Crimson/Coral `#FF0844`/`#FFB199`) driven by GSAP scroll progress and state uniforms.
2. **Post-Processing Pipeline (`PostProcessing`)**: An `@react-three/postprocessing` pipeline featuring selective HDR `Bloom` with mipmap blur, radial `ChromaticAberration` modulated during medication error crisis states, framing `Vignette`, and `ToneMapping` (ACES Filmic) to preserve high dynamic range color fidelity without clipping.

---

## 2. GLSL Mathematics & Shader Engineering

### 2.1 Simplex 3D Noise Vertex Displacement
To generate organic, pulsating surface turbulence without texture lookups, the vertex shader implements Ashima Arts / Stefan Gustavson Simplex 3D Noise ($snoise$).
- **Position Sampling**: Noise coordinates are sampled as:
  $$\mathbf{p}_{\text{noise}} = \mathbf{p}_{\text{local}} \cdot 1.5 + (0, uTime \cdot 0.4, 0)$$
- **Multi-Octave Turbulence**:
  $$N(\mathbf{p}) = 0.667 \cdot \left( snoise(\mathbf{p}_{\text{noise}}) + 0.5 \cdot snoise(\mathbf{p}_{\text{noise}} \cdot 3.0 - (0, uTime \cdot 0.6, 0)) \right)$$
- **Normal-Aligned Displacement**:
  $$\mathbf{p}_{\text{displaced}} = \mathbf{p}_{\text{local}} + \mathbf{n}_{\text{local}} \cdot (N(\mathbf{p}) \cdot uDistortion)$$
- **Varying Output**: Passes the computed scalar displacement $vDisplacement$, view-space normal $vNormal$, and view-space position $vViewPosition$ to the fragment shader.

### 2.2 Fresnel Glowing Rim Calculation
The holographic aura glows brightly at grazing angles (edges) and remains translucent at the center:
- Normalized view vector: $\mathbf{v} = \text{normalize}(\mathbf{v}_{\text{view}})$
- Normalized surface normal: $\mathbf{n} = \text{normalize}(\mathbf{n}_{\text{view}})$
- Rim factor:
  $$\text{Fresnel} = \left( 1.0 - \max(\mathbf{v} \cdot \mathbf{n}, 0.0) \right)^{uFresnelPower}$$
- Configured with default power exponent $2.8$ to create a razor-sharp, luminous halo.

### 2.3 Holographic Scanline & Diagnostic Radar Wave
Medical scanning aesthetics are rendered directly in the fragment shader:
- **High-Frequency Scanlines**:
  $$\text{scanline} = \left( 0.5 + 0.5 \cdot \sin(vPosition.y \cdot 40.0 + uTime \cdot 5.0) \right)^5$$
- **Sweeping Radar Pulse**:
  $$\text{sweep} = \text{smoothstep}(0.7, 1.0, 0.5 + 0.5 \cdot \sin(vPosition.y \cdot 2.0 - uTime \cdot 2.5))$$
- **Total Scan Emission**:
  $$\text{ScanGlow} = (\text{scanline} \cdot 0.7 + \text{sweep} \cdot 0.6) \cdot uScanGlow$$

### 2.4 Dual-Palette Color Interpolation
Color interpolation shifts seamlessly between normal safe operation and medication interaction warning:
- **Safe Mode**:
  - Color 1 (`uSafeColor1`): `#00F2FE` $\rightarrow \text{vec3}(0.0, 0.949, 0.996)$ (Vibrant Cyan)
  - Color 2 (`uSafeColor2`): `#4FACFE` $\rightarrow \text{vec3}(0.310, 0.675, 0.996)$ (Medical Sky Blue)
  - Spatial gradient: $\mathbf{C}_{\text{safe}} = \text{mix}(uSafeColor1, uSafeColor2, \text{clamp}(vUv.y + vDisplacement \cdot 1.5, 0.0, 1.0))$
- **Danger Mode (Crisis State)**:
  - Color 1 (`uDangerColor1`): `#FF0844` $\rightarrow \text{vec3}(1.0, 0.031, 0.267)$ (Crimson Danger)
  - Color 2 (`uDangerColor2`): `#FFB199` $\rightarrow \text{vec3}(1.0, 0.694, 0.600)$ (Warning Coral)
  - Spatial gradient: $\mathbf{C}_{\text{danger}} = \text{mix}(uDangerColor1, uDangerColor2, \text{clamp}(vUv.y + vDisplacement \cdot 1.5, 0.0, 1.0))$
- **State Blending**:
  $$\mathbf{C}_{\text{base}} = \text{mix}(\mathbf{C}_{\text{safe}}, \mathbf{C}_{\text{danger}}, \text{clamp}(uDangerMix, 0.0, 1.0))$$
- **Final Fragment Emission**:
  $$\mathbf{C}_{\text{final}} = \mathbf{C}_{\text{base}} \cdot (0.25 + 0.35 \cdot \text{pulse}) + (\mathbf{C}_{\text{base}} \cdot \text{Fresnel} \cdot 2.5) + (\mathbf{C}_{\text{highlight}} \cdot \text{ScanGlow} \cdot 1.8) + (\mathbf{C}_{\text{base}} \cdot |vDisplacement| \cdot 4.0)$$

---

## 3. Design of `src/components/shaders/AuraShaderMaterial.ts`

### 3.1 Uniform Interface & Defaults
```typescript
export interface AuraShaderMaterialUniforms {
  uTime: number
  uProgress: number
  uDangerMix: number
  uScanGlow: number
  uDistortion: number
  uSafeColor1: THREE.Color | string
  uSafeColor2: THREE.Color | string
  uDangerColor1: THREE.Color | string
  uDangerColor2: THREE.Color | string
  uFresnelPower: number
  uOpacity: number
}
```

### 3.2 Full Source Code Implementation
```typescript
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

/**
 * Raw GLSL Vertex Shader:
 * - Simplex 3D noise vertex displacement
 * - Normal & view-space vector transformation
 * - Varying passing for UV, normal, position, and displacement
 */
const vertexShader = /* glsl */ `
  // Simplex 3D Noise by Ian McEwan, Stefan Gustavson (Ashima Arts)
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1.0 / 7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p, 7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalize gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix contributions
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  uniform float uTime;
  uniform float uProgress;
  uniform float uDistortion;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vUv = uv;

    // Compute view-space normal for Fresnel
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    // Multi-octave organic noise displacement
    vec3 noiseCoord = position * 1.5 + vec3(0.0, uTime * 0.4, 0.0);
    float n1 = snoise(noiseCoord);
    float n2 = snoise(noiseCoord * 3.0 - vec3(uTime * 0.6)) * 0.5;
    float totalNoise = (n1 + n2) * 0.667;

    float displacement = totalNoise * uDistortion;
    vDisplacement = displacement;

    // Displace vertex along surface normal
    vec3 displacedPosition = position + normal * displacement;
    vPosition = displacedPosition;

    // Calculate view and world space positions
    vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
    vWorldPosition = worldPos.xyz;

    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * Raw GLSL Fragment Shader:
 * - Dynamic time pulsing & breathing rhythm
 * - Fresnel rim light glow
 * - Holographic scanlines & sweep beam
 * - Safe (Cyan/SkyBlue) to Danger (Crimson/Coral) interpolation
 */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform float uDangerMix;
  uniform float uScanGlow;
  uniform vec3 uSafeColor1;
  uniform vec3 uSafeColor2;
  uniform vec3 uDangerColor1;
  uniform vec3 uDangerColor2;
  uniform float uFresnelPower;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // 1. Fresnel Glowing Rim
    float NdotV = max(dot(viewDir, normal), 0.0);
    float fresnel = pow(1.0 - NdotV, uFresnelPower);

    // 2. Dynamic Time-Based Pulsing
    float pulse = 0.5 + 0.5 * sin(uTime * 3.0 - vPosition.y * 4.0);
    float pulseCore = 0.5 + 0.5 * cos(uTime * 1.8 + vDisplacement * 6.0);

    // 3. Scanline Wave & Sweeping Radar Beam
    float scanline = sin(vPosition.y * 40.0 + uTime * 5.0) * 0.5 + 0.5;
    scanline = pow(scanline, 5.0);

    float sweepWave = sin((vPosition.y * 2.0) - (uTime * 2.5)) * 0.5 + 0.5;
    sweepWave = smoothstep(0.7, 1.0, sweepWave);

    float totalScan = (scanline * 0.7 + sweepWave * 0.6) * uScanGlow;

    // 4. Color Interpolation: Safe (Cyan/Emerald) to Danger (Crimson/Peach)
    vec3 safeColor = mix(uSafeColor1, uSafeColor2, clamp(vUv.y + vDisplacement * 1.5, 0.0, 1.0));
    vec3 dangerColor = mix(uDangerColor1, uDangerColor2, clamp(vUv.y + vDisplacement * 1.5, 0.0, 1.0));

    float dangerFactor = clamp(uDangerMix, 0.0, 1.0);
    vec3 activeBaseColor = mix(safeColor, dangerColor, dangerFactor);

    // Emission Highlights
    vec3 highlightColor = mix(vec3(0.6, 1.0, 1.0), vec3(1.0, 0.8, 0.6), dangerFactor);

    // 5. Final Color Composition
    vec3 color = activeBaseColor * (0.25 + 0.35 * pulse);
    color += activeBaseColor * fresnel * 2.5;
    color += highlightColor * totalScan * 1.8;
    color += activeBaseColor * abs(vDisplacement) * 4.0;

    // 6. Dynamic Alpha & Hologram Transparency
    float alpha = (fresnel * 0.9 + totalScan * 0.5 + 0.12 * pulseCore) * uOpacity;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * AuraShaderMaterial Class created with Drei shaderMaterial
 */
export const AuraShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uDangerMix: 0,
    uScanGlow: 1.0,
    uDistortion: 0.2,
    uSafeColor1: new THREE.Color('#00F2FE'),
    uSafeColor2: new THREE.Color('#4FACFE'),
    uDangerColor1: new THREE.Color('#FF0844'),
    uDangerColor2: new THREE.Color('#FFB199'),
    uFresnelPower: 2.8,
    uOpacity: 0.9,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (material) {
      material.transparent = true
      material.side = THREE.DoubleSide
      material.depthWrite = false
      material.blending = THREE.AdditiveBlending
    }
  }
)

// Register custom shader material with React Three Fiber
extend({ AuraShaderMaterial })

// TypeScript Intrinsic JSX Declarations
declare module '@react-three/fiber' {
  interface ThreeElements {
    auraShaderMaterial: ThreeElements['shaderMaterial'] & {
      uTime?: number
      uProgress?: number
      uDangerMix?: number
      uScanGlow?: number
      uDistortion?: number
      uSafeColor1?: THREE.Color | string
      uSafeColor2?: THREE.Color | string
      uDangerColor1?: THREE.Color | string
      uDangerColor2?: THREE.Color | string
      uFresnelPower?: number
      uOpacity?: number
    }
  }
}
```

---

## 4. Design of `src/components/3d/PostProcessing.tsx`

### 4.1 Post-Processing Pipeline Architecture
The post-processing graph is ordered to ensure physical correctness:
1. **Scene Render**: Render scene to high-precision HDR floating-point buffer.
2. **Bloom Pass (`Bloom`)**:
   - `luminanceThreshold={0.65}`: Isolates emissive shader rims, glowing scanlines, and lights.
   - `luminanceSmoothing={0.3}`: Prevents harsh luminance threshold boundary artifacts.
   - `mipmapBlur={true}`: Downsamples across mipmap pyramid for soft, cinema-grade glow.
   - `intensity={1.5}`: Elevated energy emission.
   - `radius={0.75}`: Wide atmospheric dispersion.
3. **Chromatic Aberration Pass (`ChromaticAberration`)**:
   - `radialModulation={true}`: Distorts only peripheral screen edges while keeping the central 3D capsule and text crisp.
   - Dynamic danger expansion: When `dangerMix` increases during Scene 2 (Medication Error Crisis), radial RGB split intensifies.
4. **Vignette Pass (`Vignette`)**:
   - `offset={0.25}` & `darkness={0.75}`: Darkens viewport boundaries to draw the eye toward the hero 3D pill.
5. **Tone Mapping Pass (`ToneMapping`)**:
   - `ToneMappingMode.ACES_FILMIC`: Emulates Kodak film response curves, tonemapping high HDR bloom peaks naturally into display sRGB space without washing out colors into flat white.

### 4.2 Full Source Code Implementation
```tsx
import { useMemo } from 'react'
import * as THREE from 'three'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'

export interface PostProcessingProps {
  /** Bloom intensity scalar (default: 1.5) */
  bloomIntensity?: number
  /** Selective luminance threshold for bloom (default: 0.65) */
  bloomThreshold?: number
  /** Danger crisis mix factor [0..1] driving chromatic aberration expansion */
  dangerMix?: number
  /** Enable/disable postprocessing pipeline */
  enabled?: boolean
}

export function PostProcessing({
  bloomIntensity = 1.5,
  bloomThreshold = 0.65,
  dangerMix = 0.0,
  enabled = true,
}: PostProcessingProps) {
  if (!enabled) return null

  // Compute dynamic chromatic aberration vector reacting to danger/error state
  const aberrationOffset = useMemo(() => {
    const base = 0.0018
    const boost = dangerMix * 0.0035
    return new THREE.Vector2(base + boost, base + boost)
  }, [dangerMix])

  // Modulate bloom intensity during crisis alerts
  const activeBloom = useMemo(() => {
    return bloomIntensity + dangerMix * 0.7
  }, [bloomIntensity, dangerMix])

  return (
    <EffectComposer
      multisampling={4}
      disableNormalPass
      stencilBuffer={false}
    >
      {/* 1. Selective HDR Bloom with progressive mipmap blur */}
      <Bloom
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.3}
        intensity={activeBloom}
        radius={0.75}
        mipmapBlur
      />

      {/* 2. Radial Chromatic Aberration (reactive to medication errors) */}
      <ChromaticAberration
        offset={aberrationOffset}
        radialModulation
        modulationOffset={0.35}
      />

      {/* 3. Cinematic Framing Vignette */}
      <Vignette
        offset={0.25}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
      />

      {/* 4. ACES Filmic Tone Mapping */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
```

---

## 5. Integration Blueprint: `HologramAura.tsx` & R3F Scene

### 5.1 `HologramAura.tsx` Implementation
To attach the custom shader material to the 3D scene, `HologramAura.tsx` wraps an `icosahedronGeometry` (with high detail subdivisions) or `sphereGeometry` enveloping the YaCheck capsule:

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './shaders/AuraShaderMaterial'

export interface HologramAuraProps {
  progress?: number
  dangerMix?: number
  scanGlow?: number
  distortion?: number
  scale?: number
}

export function HologramAura({
  progress = 0,
  dangerMix = 0,
  scanGlow = 1.0,
  distortion = 0.2,
  scale = 1.35,
}: HologramAuraProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Update elapsed time uniform
      materialRef.current.uTime = state.clock.getElapsedTime()
      // Smoothly sync reactive uniforms
      materialRef.current.uProgress = progress
      materialRef.current.uDangerMix = dangerMix
      materialRef.current.uScanGlow = scanGlow
      materialRef.current.uDistortion = distortion
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
      meshRef.current.rotation.z += delta * 0.08
    }
  })

  return (
    <mesh ref={meshRef} scale={scale}>
      <icosahedronGeometry args={[1.0, 32]} />
      <auraShaderMaterial ref={materialRef} />
    </mesh>
  )
}
```

### 5.2 Scene Integration & GSAP Scroll Binding Overview
In `src/components/3d/Scene.tsx`, the timeline animates:
- `progress` (0.0 to 1.0)
- `dangerMix`:
  - Hero (Scene 1): `0.0` (Safe Cyan)
  - Problem (Scene 2): `1.0` (Danger Crimson & high distortion $0.38$)
  - Features (Scene 3): `0.2` (Diagnostic Scanner glow $2.8$)
  - Specs (Scene 4): `0.0` (Technical clarity)
  - CTA (Scene 5): `0.0` (Vibrant finale)

---

## 6. Verification & Compilation Checkpoints

1. **TypeScript Compilation**:
   - All types must pass with `verbatimModuleSyntax: true` and `allowArbitraryExtensions: true`.
   - Zero `TS6133` (unused variables) or `TS2304` (missing types) errors.
2. **GLSL Compilation**:
   - Zero syntax errors, correct vector swizzling (`.xzyw`, `.wyz`), valid precision specifiers (`precision highp float`).
3. **PostProcessing Performance**:
   - `disableNormalPass` enabled to save unnecessary depth/normal render pass.
   - `mipmapBlur` active on `Bloom` for high-quality glow at 60 FPS.
