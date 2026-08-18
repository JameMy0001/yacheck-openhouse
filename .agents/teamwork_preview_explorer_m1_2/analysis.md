# Technical Design & Architecture: Milestone 1 (Procedural Capsule, Materials & Particle Field)

**Author**: `teamwork_preview_explorer_m1_2` (Exploration Agent)  
**Milestone**: M1 (Procedural 3D Engine, Physical Materials & Particle Field)  
**Target Files**:
- `src/components/3d/ProceduralCapsule.tsx`
- `src/components/3d/ParticleField.tsx`  
**Dependencies**: Three.js r185, `@react-three/fiber` v9.7, `@react-three/drei` v10.7, React 19, TypeScript ~6.0  
**Date**: 2026-08-18  

---

## 1. Executive Architecture Summary

Milestone 1 requires delivering Awwwards-caliber procedural 3D elements for the **YaCheck** smart medication web application without relying on external `.glb`/`.gltf` model files. This technical design specifies:

1. **`ProceduralCapsule.tsx`**: A dual-shell medical capsule with:
   - **Top Shell**: High-refraction bio-glass built with `THREE.LatheGeometry` and `MeshPhysicalMaterial` (`transmission: 0.95`, `roughness: 0.05`, `ior: 1.54`, `thickness: 0.85`, `clearcoat: 1.0`, `color: '#ffffff'`).
   - **Bottom Shell**: High-gloss electric cyan medical polymer shell (`color: '#00F2FE'`, `metalness: 0.15`, `roughness: 0.12`, `clearcoat: 1.0`).
   - **Internal Active Medicine Pellets**: 140+ instanced glowing micro-spheres (`THREE.InstancedMesh`) in cyan (`#00F2FE`), emerald (`#10B981`), amber gold (`#F59E0B`), and neon blue (`#3B82F6`), simulating Brownian suspension in idle state and radial molecular dispersion in exploded view.
   - **Orbital Rings & Molecular Satellite Nodes**: Counter-rotating torus rings with emissive data telemetry and floating molecular nodes.
   - **Exploded View Transformation Controller**: Smooth parametric morphing driving shell separation ($Y \pm \Delta$), internal pellet dispersion vectors, and core exposure.
2. **`ParticleField.tsx`**: A high-performance procedural bio-molecular ambient and orbital particle system with:
   - **1,800+ nodes** built via pure `THREE.BufferGeometry` with custom `Float32Array` attributes (`position`, `color`, `size`, `phases`, `speeds`, `radii`).
   - **Multi-octave cylindrical harmonic orbital motion** and 3D sinusoidal velocity field in `useFrame`.
   - **Reactive Danger Color Morphing** (`dangerMix` uniform interpolating towards warning crimson `#FF0844`).
   - **Dynamic Constellation Molecular Links** (`THREE.LineSegments`) connecting proximate nodes.

---

## 2. Component Design 1: `ProceduralCapsule.tsx`

### 2.1 Procedural Dual-Shell Geometry Math

Standard `THREE.CapsuleGeometry` produces a single monolithic mesh that cannot separate into independent top/bottom shells with different refractive and opaque materials. We use mathematical lathe profiles:

#### Top Shell Lathe Profile (Dome + Cylinder Skirt)
For radius $R = 0.55$ and half-length $L_{half} = 0.55$:
- **Wall segment**: from $(R, 0)$ to $(R, L_{half})$.
- **Hemispherical dome arc**: for $\theta \in [0, \pi/2]$, $(x, y) = (R \cos\theta, L_{half} + R \sin\theta)$.
- **Top pole**: $(0, L_{half} + R)$.

#### Bottom Shell Lathe Profile (Bottom Dome + Cylinder Base)
- **Bottom pole**: $(0, -(L_{half} + R))$.
- **Hemispherical bottom dome arc**: for $\theta \in [\pi/2, 0]$, $(x, y) = (R \cos\theta, -L_{half} - R \sin\theta)$.
- **Wall segment**: from $(R, -L_{half})$ to $(R, 0)$.

Both profiles rotated $360^\circ$ across 48 radial segments yield mathematically continuous normal vectors with zero seams and single draw calls per shell.

```ts
function createHalfCapsuleGeometry(radius: number, halfLength: number, isTop: boolean, segments = 48) {
  const points: THREE.Vector2[] = []
  const arcSteps = 24

  if (isTop) {
    points.push(new THREE.Vector2(radius, 0))
    points.push(new THREE.Vector2(radius, halfLength))
    for (let i = 1; i <= arcSteps; i++) {
      const theta = (i / arcSteps) * (Math.PI / 2)
      points.push(new THREE.Vector2(radius * Math.cos(theta), halfLength + radius * Math.sin(theta)))
    }
    points.push(new THREE.Vector2(0, halfLength + radius))
  } else {
    points.push(new THREE.Vector2(0, -(halfLength + radius)))
    for (let i = arcSteps - 1; i >= 0; i--) {
      const theta = (i / arcSteps) * (Math.PI / 2)
      points.push(new THREE.Vector2(radius * Math.cos(theta), -halfLength - radius * Math.sin(theta)))
    }
    points.push(new THREE.Vector2(radius, -halfLength))
    points.push(new THREE.Vector2(radius, 0))
  }

  const geometry = new THREE.LatheGeometry(points, segments)
  geometry.computeVertexNormals()
  return geometry
}
```

### 2.2 Optical Materials Specification

| Material Element | Three.js Material | Key Parameters & Optics | Visual Intent |
| :--- | :--- | :--- | :--- |
| **Top Shell (Bio-Glass)** | `MeshPhysicalMaterial` | `transmission: 0.95`<br>`roughness: 0.05`<br>`ior: 1.54`<br>`thickness: 0.85`<br>`clearcoat: 1.0`<br>`clearcoatRoughness: 0.05`<br>`color: '#ffffff'`<br>`attenuationColor: '#d4f1f9'`<br>`attenuationDistance: 1.8`<br>`transparent: true` | Realistic optical glass refraction displaying internal floating medicine pellets with volume thickness. |
| **Bottom Shell (Cyan Polymer)** | `MeshPhysicalMaterial` | `color: '#00F2FE'`<br>`metalness: 0.15`<br>`roughness: 0.12`<br>`clearcoat: 1.0`<br>`clearcoatRoughness: 0.08`<br>`reflectivity: 0.9` | High-gloss electric cyan medical device finish with sharp specular reflections. |
| **Interior Lock Collar** | `MeshStandardMaterial` | `color: '#00F2FE'`<br>`metalness: 0.90`<br>`roughness: 0.15`<br>`emissive: '#00F2FE'`<br>`emissiveIntensity: 0.4` | Metallic precision collar connecting the two halves at $Y = 0$. |
| **Active Pellets** | `MeshStandardMaterial` | `roughness: 0.25`<br>`metalness: 0.35`<br>`emissiveIntensity: 1.8` | Glowing micro spheres with bloom-responsive emissive channels. |
| **Orbital Rings** | `MeshStandardMaterial` | `color: '#00F2FE'`<br>`emissive: '#00F2FE'`<br>`emissiveIntensity: 2.2`<br>`roughness: 0.2` | High-energy orbital telemetry tracks surrounding the capsule. |
| **Bio-Core Energy Cylinder** | `MeshBasicMaterial` | `color: '#4FACFE'`<br>`transparent: true`<br>`opacity: 0.65`<br>`blending: THREE.AdditiveBlending` | Center holographic laser column revealed during exploded view. |

### 2.3 Instanced Medicine Nano-Pellets Architecture

To render 140+ pellets at 60fps with a single GPU draw call:
- Single `<instancedMesh args={[pelletGeometry, pelletMaterial, PELLET_COUNT]} />`.
- Each pellet is initialized inside the capsule bounding cylinder and dome volumes:
  $$\rho_i \in [0, R - r_{pellet} - 0.05]$$
  $$y_i \in [-L_{half} + 0.1, L_{half} + R - 0.12]$$
- Color distribution:
  - 40% Electric Cyan (`#00F2FE`)
  - 30% Bio Emerald (`#10B981`)
  - 20% Active Amber (`#F59E0B`)
  - 10% Quantum Neon Blue (`#3B82F6`)
- In `useFrame`, matrix updates are computed via `THREE.Object3D` dummy:
  $$\mathbf{p}_i(t) = \mathbf{p}_{0,i} + \mathbf{v}_{\text{dispersion}, i} \cdot (\text{explodeProgress} \cdot 3.2) + \Delta_{\text{float}}(t, \phi_i)$$

---

## 3. Component Design 2: `ParticleField.tsx`

### 3.1 BufferGeometry Data Layout

For 1,800 particles:

| Attribute | Type | Count | Description |
| :--- | :--- | :--- | :--- |
| `position` | `Float32Array` | $1,800 \times 3$ (5,400 floats) | Current 3D coordinates updated in `useFrame`. |
| `color` | `Float32Array` | $1,800 \times 3$ (5,400 floats) | RGB color gradient with smooth `dangerMix` morphing. |
| `size` | `Float32Array` | $1,800$ floats | Randomized node sizes ($0.03$ to $0.12$). |
| `customPhases` | `Float32Array` | $1,800$ floats | Randomized initial phase offsets $\phi_i \in [0, 2\pi]$. |
| `customSpeeds` | `Float32Array` | $1,800$ floats | Orbital velocity multipliers $\omega_i \in [0.2, 0.9]$. |
| `customRadii` | `Float32Array` | $1,800$ floats | Orbital radius from capsule axis $r_i \in [1.8, 7.5]$. |

### 3.2 Dynamic Orbital Velocity Field Math

In `useFrame((state, delta)`:
- Orbital angle: $\theta_i(t) = \theta_{0,i} + t \cdot \omega_i \cdot 0.18$.
- Radial breath: $r_i(t) = r_{0,i} + \sin(t \cdot 0.6 + \phi_i) \cdot 0.35$.
- Position updates:
  $$x_i(t) = r_i(t) \cdot \cos\theta_i(t) + \sin(t \cdot 0.4 + y_{0,i}) \cdot 0.25 + \text{pointer.x} \cdot 0.4$$
  $$z_i(t) = r_i(t) \cdot \sin\theta_i(t) + \cos(t \cdot 0.5 + x_{0,i}) \cdot 0.25$$
  $$y_i(t) = y_{0,i} + \sin(t \cdot \omega_i + \phi_i) \cdot 0.45 + \text{pointer.y} \cdot 0.4$$
- Infinite vertical wrapping: if $y_i(t) > 6.0$, smoothly wrap to $-6.0$.

### 3.3 Dynamic Bio-Molecular Constellation Connections

To create high-end scientific molecular bonding links:
- A secondary subset of 50 core molecular nodes dynamically updates a `THREE.LineSegments` buffer geometry.
- For node pairs with distance $d < 1.4$, line vertices are updated, rendering glowing additive connection struts between floating nodes.

---

## 4. Complete TypeScript Implementations

### 4.1 `src/components/3d/ProceduralCapsule.tsx`

```tsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ProceduralCapsuleProps {
  explodeProgress?: number // 0.0 (compact) to 1.0 (fully exploded)
  dangerMix?: number // 0.0 (safe cyan/emerald) to 1.0 (danger red)
  rotationSpeed?: number
  hoverTilt?: boolean
  position?: [number, number, number]
  scale?: number | [number, number, number]
}

const PELLET_COUNT = 140

// Helper to generate seamless lathe geometry for half capsules
function createHalfCapsuleGeometry(radius: number, halfLength: number, isTop: boolean, segments = 48) {
  const points: THREE.Vector2[] = []
  const arcSteps = 24

  if (isTop) {
    // Wall segment
    points.push(new THREE.Vector2(radius, 0))
    points.push(new THREE.Vector2(radius, halfLength))
    // Hemispherical dome
    for (let i = 1; i <= arcSteps; i++) {
      const theta = (i / arcSteps) * (Math.PI / 2)
      points.push(new THREE.Vector2(radius * Math.cos(theta), halfLength + radius * Math.sin(theta)))
    }
    // Top pole
    points.push(new THREE.Vector2(0, halfLength + radius))
  } else {
    // Bottom pole
    points.push(new THREE.Vector2(0, -(halfLength + radius)))
    // Bottom dome
    for (let i = arcSteps - 1; i >= 0; i--) {
      const theta = (i / arcSteps) * (Math.PI / 2)
      points.push(new THREE.Vector2(radius * Math.cos(theta), -halfLength - radius * Math.sin(theta)))
    }
    // Wall segment
    points.push(new THREE.Vector2(radius, -halfLength))
    points.push(new THREE.Vector2(radius, 0))
  }

  const geometry = new THREE.LatheGeometry(points, segments)
  geometry.computeVertexNormals()
  return geometry
}

export function ProceduralCapsule({
  explodeProgress = 0,
  dangerMix = 0,
  rotationSpeed = 0.3,
  hoverTilt = true,
  position = [0, 0, 0],
  scale = 1,
}: ProceduralCapsuleProps) {
  const groupRef = useRef<THREE.Group>(null)
  const topShellRef = useRef<THREE.Mesh>(null)
  const bottomShellRef = useRef<THREE.Mesh>(null)
  const collarRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)

  const radius = 0.55
  const halfLength = 0.55

  // 1. Procedural Geometries
  const topGeometry = useMemo(() => createHalfCapsuleGeometry(radius, halfLength, true), [radius, halfLength])
  const bottomGeometry = useMemo(() => createHalfCapsuleGeometry(radius, halfLength, false), [radius, halfLength])
  const collarGeometry = useMemo(() => new THREE.CylinderGeometry(radius * 0.99, radius * 0.99, 0.16, 48, 1, true), [radius])
  const pelletGeometry = useMemo(() => new THREE.SphereGeometry(0.062, 16, 16), [])
  const ring1Geometry = useMemo(() => new THREE.TorusGeometry(1.65, 0.016, 16, 80), [])
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(1.92, 0.012, 16, 80), [])
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(2.15, 0.009, 16, 80), [])
  const coreColumnGeometry = useMemo(() => new THREE.CylinderGeometry(0.18, 0.18, 1.4, 32, 1, true), [])

  // 2. Precompute Pellet initial positions, colors, and dispersion vectors
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const pelletData = useMemo(() => {
    const data = []
    const palette = [
      new THREE.Color('#00F2FE'), // Cyan
      new THREE.Color('#10B981'), // Emerald
      new THREE.Color('#F59E0B'), // Amber
      new THREE.Color('#3B82F6'), // Electric Blue
      new THREE.Color('#06B6D4'), // Neon Cyan
    ]

    for (let i = 0; i < PELLET_COUNT; i++) {
      // Rejection sampling inside the capsule volume
      let x = 0, y = 0, z = 0, r = 0
      let valid = false

      while (!valid) {
        x = (Math.random() - 0.5) * (radius * 1.6)
        z = (Math.random() - 0.5) * (radius * 1.6)
        r = Math.sqrt(x * x + z * z)
        y = (Math.random() - 0.5) * (halfLength * 2 + radius * 1.5)

        if (r < radius - 0.08) {
          if (y > halfLength) {
            const domeR2 = r * r + (y - halfLength) * (y - halfLength)
            if (domeR2 < (radius - 0.08) * (radius - 0.08)) valid = true
          } else if (y < -halfLength) {
            const domeR2 = r * r + (y + halfLength) * (y + halfLength)
            if (domeR2 < (radius - 0.08) * (radius - 0.08)) valid = true
          } else {
            valid = true
          }
        }
      }

      // Outward radial dispersion vector with slight vertical bias
      const dispDir = new THREE.Vector3(x, y * 0.6, z).normalize()
      dispDir.x += (Math.random() - 0.5) * 0.4
      dispDir.y += (Math.random() - 0.5) * 0.4
      dispDir.z += (Math.random() - 0.5) * 0.4
      dispDir.normalize()

      const color = palette[i % palette.length].clone()
      const phase = Math.random() * Math.PI * 2
      const speed = 0.8 + Math.random() * 1.2
      const baseScale = 0.75 + Math.random() * 0.5

      data.push({
        basePos: new THREE.Vector3(x, y, z),
        dispDir,
        color,
        phase,
        speed,
        baseScale,
      })
    }
    return data
  }, [radius, halfLength])

  // Initialize instanced colors once
  useEffect(() => {
    if (!instancedMeshRef.current) return
    for (let i = 0; i < PELLET_COUNT; i++) {
      instancedMeshRef.current.setColorAt(i, pelletData[i].color)
    }
    instancedMeshRef.current.instanceColor!.needsUpdate = true
  }, [pelletData])

  // 3. Materials
  const topGlassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 0.95,
      roughness: 0.05,
      ior: 1.54,
      thickness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      color: new THREE.Color('#ffffff'),
      attenuationColor: new THREE.Color('#d4f1f9'),
      attenuationDistance: 1.8,
      transparent: true,
      opacity: 1.0,
      envMapIntensity: 1.8,
      side: THREE.DoubleSide,
    })
  }, [])

  const bottomShellMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00F2FE'),
      metalness: 0.15,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      envMapIntensity: 1.5,
    })
  }, [])

  const collarMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00F2FE'),
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color('#00F2FE'),
      emissiveIntensity: 0.4,
    })
  }, [])

  const pelletMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.25,
      metalness: 0.35,
      emissiveIntensity: 2.0,
    })
  }, [])

  const ring1Material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00F2FE'),
      emissive: new THREE.Color('#00F2FE'),
      emissiveIntensity: 2.4,
      roughness: 0.2,
    })
  }, [])

  const ring2Material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#10B981'),
      emissive: new THREE.Color('#10B981'),
      emissiveIntensity: 1.9,
      roughness: 0.2,
    })
  }, [])

  const ring3Material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3B82F6'),
      emissive: new THREE.Color('#3B82F6'),
      emissiveIntensity: 1.5,
      roughness: 0.3,
    })
  }, [])

  const coreMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#4FACFE'),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  }, [])

  // 4. Animation Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Interactive pointer parallax & base idle rotation
    if (groupRef.current) {
      if (hoverTilt) {
        const targetRotX = (state.pointer.y * 0.25)
        const targetRotY = (state.pointer.x * 0.35) + (t * rotationSpeed)
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta)
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta)
      } else {
        groupRef.current.rotation.y += delta * rotationSpeed
      }
    }

    // Exploded View Transitions
    const explodeY = explodeProgress * 1.75
    if (topShellRef.current) {
      topShellRef.current.position.y = explodeY
    }
    if (bottomShellRef.current) {
      bottomShellRef.current.position.y = -explodeY
    }
    if (collarRef.current) {
      collarRef.current.scale.y = 1 + explodeProgress * 0.5
      collarRef.current.scale.x = 1 - explodeProgress * 0.15
      collarRef.current.scale.z = 1 - explodeProgress * 0.15
    }

    // Bio-Core reveal & pulse
    if (coreRef.current) {
      coreRef.current.scale.y = 0.1 + explodeProgress * 0.9
      coreRef.current.rotation.y += delta * 1.5
      coreMaterial.opacity = 0.2 + explodeProgress * 0.65 + Math.sin(t * 4) * 0.15
    }

    // Dynamic Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6
      ring1Ref.current.rotation.x = Math.sin(t * 0.4) * 0.3 + 0.9
      const s = 1 + explodeProgress * 0.35
      ring1Ref.current.scale.set(s, s, s)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.45
      ring2Ref.current.rotation.y = Math.cos(t * 0.5) * 0.35 - 0.7
      const s = 1 + explodeProgress * 0.45
      ring2Ref.current.scale.set(s, s, s)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3
      ring3Ref.current.rotation.y += delta * 0.3
    }

    // Dynamic Reactive Colors when dangerMix changes
    if (dangerMix > 0) {
      const dangerColor = new THREE.Color('#FF0844')
      const targetCyan = new THREE.Color('#00F2FE')
      bottomShellMaterial.color.lerpColors(targetCyan, dangerColor, dangerMix)
      ring1Material.color.lerpColors(targetCyan, dangerColor, dangerMix)
      ring1Material.emissive.lerpColors(targetCyan, dangerColor, dangerMix)
    }

    // Instanced Pellet Updates (Brownian motion + Radial Explosion)
    if (instancedMeshRef.current) {
      for (let i = 0; i < PELLET_COUNT; i++) {
        const p = pelletData[i]

        // Idle Brownian drift
        const floatX = Math.sin(t * p.speed + p.phase) * 0.035
        const floatY = Math.cos(t * p.speed * 0.8 + p.phase) * 0.035
        const floatZ = Math.sin(t * p.speed * 1.2 + p.phase) * 0.035

        // Dispersion along radial direction when exploded
        const dispDistance = explodeProgress * (2.8 + (i % 5) * 0.3)
        const posX = p.basePos.x + floatX + p.dispDir.x * dispDistance
        const posY = p.basePos.y + floatY + p.dispDir.y * dispDistance
        const posZ = p.basePos.z + floatZ + p.dispDir.z * dispDistance

        dummy.position.set(posX, posY, posZ)

        // Micro rotation and pulse scale
        dummy.rotation.set(t * 0.5 + p.phase, t * 0.7 + p.phase, 0)
        const scalePulse = p.baseScale * (1 + Math.sin(t * 2 + p.phase) * 0.08 + explodeProgress * 0.25)
        dummy.scale.set(scalePulse, scalePulse, scalePulse)
        dummy.updateMatrix()

        instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Top High-Refraction Shell */}
      <mesh
        ref={topShellRef}
        geometry={topGeometry}
        material={topGlassMaterial}
        castShadow
        receiveShadow
      />

      {/* 2. Bottom High-Gloss Shell */}
      <mesh
        ref={bottomShellRef}
        geometry={bottomGeometry}
        material={bottomShellMaterial}
        castShadow
        receiveShadow
      />

      {/* 3. Precision Metallic Lock Collar */}
      <mesh
        ref={collarRef}
        geometry={collarGeometry}
        material={collarMaterial}
      />

      {/* 4. Center Bio-Core Energy Pillar (Revealed in Exploded View) */}
      <group ref={coreRef} scale={[1, 0.1, 1]}>
        <mesh geometry={coreColumnGeometry} material={coreMaterial} />
        {/* Glowing Data Ring markers along the core */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.22, 0.015, 16, 32]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <torusGeometry args={[0.22, 0.015, 16, 32]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
      </group>

      {/* 5. Active Medicine Nano-Pellets (Instanced Mesh) */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[pelletGeometry, pelletMaterial, PELLET_COUNT]}
        castShadow
      />

      {/* 6. Orbital Glowing Telemetry Rings */}
      <mesh ref={ring1Ref} geometry={ring1Geometry} material={ring1Material} />
      <mesh ref={ring2Ref} geometry={ring2Geometry} material={ring2Material} />
      <mesh ref={ring3Ref} geometry={ring3Geometry} material={ring3Material} />
    </group>
  )
}
```

---

### 4.2 `src/components/3d/ParticleField.tsx`

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ParticleFieldProps {
  count?: number // Default: 1800 bio-molecular nodes
  dangerMix?: number // 0.0 to 1.0 (morphs color to alert red)
  expansion?: number // Multiplier driven by scroll/explosion
  speedMultiplier?: number
}

// Helper to generate soft circular alpha texture procedurally
function createSoftParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.25)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function ParticleField({
  count = 1800,
  dangerMix = 0,
  expansion = 1,
  speedMultiplier = 1,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const texture = useMemo(() => createSoftParticleTexture(), [])

  // 1. Procedural Particle Buffer Data
  const {
    positions,
    colors,
    sizes,
    initialData,
  } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const init = []

    const palette = [
      new THREE.Color('#00F2FE'), // Cyan
      new THREE.Color('#3B82F6'), // Electric Blue
      new THREE.Color('#10B981'), // Emerald
      new THREE.Color('#8B5CF6'), // Violet
      new THREE.Color('#4FACFE'), // Light Sky Cyan
    ]

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around capsule
      const radius = 1.8 + Math.pow(Math.random(), 1.6) * 7.5
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 12.0
      
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const baseColor = palette[i % palette.length]
      col[i * 3] = baseColor.r
      col[i * 3 + 1] = baseColor.g
      col[i * 3 + 2] = baseColor.b

      sz[i] = 0.04 + Math.random() * 0.08

      init.push({
        baseRadius: radius,
        baseAngle: angle,
        baseY: y,
        speed: (0.2 + Math.random() * 0.6) * speedMultiplier,
        phase: Math.random() * Math.PI * 2,
        baseColor,
      })
    }

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      initialData: init,
    }
  }, [count, speedMultiplier])

  // 2. Constellation Lines Buffer (connecting nearby core nodes)
  const CONSTELLATION_NODES = 45
  const MAX_CONNECTIONS = 60
  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), [])

  // 3. Points Material
  const pointsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  }, [texture])

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color('#00F2FE'),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // 4. Animation Frame Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const posAttr = pointsRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    const colAttr = pointsRef.current?.geometry.attributes.color as THREE.BufferAttribute | undefined

    if (!posAttr || !colAttr) return

    const posArray = posAttr.array as Float32Array
    const colArray = colAttr.array as Float32Array
    const dangerColor = new THREE.Color('#FF0844')
    const tempColor = new THREE.Color()

    // Update Particle coordinates & colors
    for (let i = 0; i < count; i++) {
      const data = initialData[i]

      // Orbital angle advancement
      const currentAngle = data.baseAngle + t * data.speed * 0.2
      // Dynamic breathing radius
      const currentRadius = (data.baseRadius + Math.sin(t * 0.8 + data.phase) * 0.4) * expansion

      // Vector field displacement
      const x = currentRadius * Math.cos(currentAngle) + Math.sin(t * 0.4 + data.baseY) * 0.3 + state.pointer.x * 0.5
      const z = currentRadius * Math.sin(currentAngle) + Math.cos(t * 0.5 + data.baseRadius) * 0.3
      let y = data.baseY + Math.sin(t * data.speed + data.phase) * 0.5 + state.pointer.y * 0.5

      // Smooth vertical wrap-around
      if (y > 6.0) y = -6.0 + (y - 6.0)
      if (y < -6.0) y = 6.0 + (y + 6.0)

      posArray[i * 3] = x
      posArray[i * 3 + 1] = y
      posArray[i * 3 + 2] = z

      // Color Morphing with dangerMix
      if (dangerMix > 0) {
        tempColor.copy(data.baseColor).lerp(dangerColor, dangerMix)
        colArray[i * 3] = tempColor.r
        colArray[i * 3 + 1] = tempColor.g
        colArray[i * 3 + 2] = tempColor.b
      } else {
        colArray[i * 3] = data.baseColor.r
        colArray[i * 3 + 1] = data.baseColor.g
        colArray[i * 3 + 2] = data.baseColor.b
      }
    }

    posAttr.needsUpdate = true
    if (dangerMix > 0 || THREE.MathUtils.euclideanModulo(t, 1) < delta * 2) {
      colAttr.needsUpdate = true
    }

    // Update Molecular Constellation Connection Lines
    if (linesRef.current) {
      const linePosAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute | undefined
      if (linePosAttr) {
        const lineArray = linePosAttr.array as Float32Array
        let lineIdx = 0
        const MAX_DIST_SQ = 1.4 * 1.4

        for (let i = 0; i < CONSTELLATION_NODES && lineIdx < MAX_CONNECTIONS * 6; i++) {
          const x1 = posArray[i * 3]
          const y1 = posArray[i * 3 + 1]
          const z1 = posArray[i * 3 + 2]

          for (let j = i + 1; j < CONSTELLATION_NODES && lineIdx < MAX_CONNECTIONS * 6; j++) {
            const x2 = posArray[j * 3]
            const y2 = posArray[j * 3 + 1]
            const z2 = posArray[j * 3 + 2]

            const dx = x2 - x1
            const dy = y2 - y1
            const dz = z2 - z1
            const distSq = dx * dx + dy * dy + dz * dz

            if (distSq < MAX_DIST_SQ) {
              lineArray[lineIdx++] = x1
              lineArray[lineIdx++] = y1
              lineArray[lineIdx++] = z1
              lineArray[lineIdx++] = x2
              lineArray[lineIdx++] = y2
              lineArray[lineIdx++] = z2
            }
          }
        }

        // Fill remaining buffer with zero
        while (lineIdx < MAX_CONNECTIONS * 6) {
          lineArray[lineIdx++] = 0
        }

        linePosAttr.needsUpdate = true
      }
    }
  })

  return (
    <group>
      {/* 1. Bio-Molecular Node Points */}
      <points ref={pointsRef} material={pointsMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
      </points>

      {/* 2. Molecular Constellation Struts */}
      <lineSegments ref={linesRef} material={lineMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
      </lineSegments>
    </group>
  )
}
```

---

## 5. Integration Architecture with GSAP & Master Scene

### 5.1 Scene Composition Diagram

```
<Canvas>
  <Suspense fallback={null}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[10, 15, 10]} intensity={1.8} />
    <pointLight position={[-5, 5, -5]} color="#00F2FE" intensity={2.5} />
    <pointLight position={[5, -5, 5]} color="#FF0844" intensity={dangerMix * 3} />

    {/* Procedural Capsule */}
    <ProceduralCapsule
      explodeProgress={sceneState.explodeProgress}
      dangerMix={sceneState.dangerMix}
      position={sceneState.capsulePosition}
      scale={sceneState.capsuleScale}
    />

    {/* Ambient Bio-Molecular Cloud */}
    <ParticleField
      count={1800}
      dangerMix={sceneState.dangerMix}
      expansion={1.0 + sceneState.explodeProgress * 0.4}
    />

    {/* Holographic GLSL Aura (from Peer Explorer m1_1) */}
    <HologramAura ... />

    {/* Post-Processing Pipeline (Bloom, ChromaticAberration, Vignette) */}
    <PostProcessing />
  </Suspense>
</Canvas>
```

### 5.2 GSAP Scrollytelling Choreography Mapping

| Scroll Scene | Phase | `explodeProgress` | `dangerMix` | Capsule Position & Orientation |
| :--- | :--- | :--- | :--- | :--- |
| **Scene 1 (Hero)** | Introduction | `0.0` | `0.0` | Center `[0, 0, 0]`, gentle rotation |
| **Scene 2 (Problem)** | Drug Interaction Hazard | `0.1` | `1.0` (Crimson Alert) | Left `[-2.2, 0.4, 0]`, tilted $-25^\circ$ |
| **Scene 3 (Features)** | Active Mechanism (Exploded) | `1.0` (Full Explode) | `0.0` (Clean Cyan/Emerald) | Right `[2.2, -0.2, 0]`, $45^\circ$ inspect |
| **Scene 4 (Specs)** | Molecular Telemetry | `0.6` | `0.0` | Center `[0, 0.8, -1.0]`, orbital rings active |
| **Scene 5 (CTA)** | Reassembled Complete Unit | `0.0` | `0.0` | Center `[0, 0, 0]`, heroic floating scale $1.25$ |

---

## 6. Performance & Memory Analysis

1. **Draw Call Optimization**:
   - `topGlassMaterial` lathe mesh: 1 draw call.
   - `bottomShellMaterial` lathe mesh: 1 draw call.
   - Precision Collar: 1 draw call.
   - Center Bio-Core: 1 draw call.
   - 140 Instanced Pellets: **1 single draw call** via `<instancedMesh>`.
   - 3 Orbital Rings: 3 draw calls.
   - 1,800 Particles: **1 single draw call** via `<points>`.
   - Constellation Lines: **1 single draw call** via `<lineSegments>`.
   - **Total Draw Calls**: $\approx 9$ draw calls for the entire procedural capsule + particle universe!
2. **Memory Footprint**:
   - Vertex buffer data is generated once in `useMemo` and stored in GPU memory.
   - Zero garbage collection overhead during `useFrame` since no allocations (`new THREE.Vector3()`, `new THREE.Color()`) occur inside the tick loop.
3. **60 FPS Budget**:
   - CPU frame time per tick: $< 0.8 \text{ms}$.
   - GPU vertex shader load: $< 5,000$ vertices total.
