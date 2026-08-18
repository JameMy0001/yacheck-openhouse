import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

/**
 * Raw GLSL Vertex Shader:
 * - Simplex 3D noise vertex displacement
 * - Normal & view-space vector transformation
 * - Varying passing for UV, normal, world position, view position, and displacement
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
    vec3 ns = 0.142857142857 * D.wyz - D.xzx;

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
    float NdotV = max(dot(normal, viewDir), 0.0);
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

    // 4. Color Interpolation: Safe (Cyan/SkyBlue) to Danger (Crimson/Coral)
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

export interface AuraShaderMaterialUniforms {
  uTime: number
  uProgress: number
  uDangerMix: number
  uScanGlow: number
  uDistortion: number
  uSafeColor1: THREE.Color
  uSafeColor2: THREE.Color
  uDangerColor1: THREE.Color
  uDangerColor2: THREE.Color
  uFresnelPower: number
  uOpacity: number
}

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
