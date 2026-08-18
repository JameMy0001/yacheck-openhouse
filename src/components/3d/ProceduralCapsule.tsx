import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ProceduralCapsuleProps {
  explodeProgress?: number // 0.0 (compact) to 1.0 (fully exploded)
  scrollProgress?: number // Fallback / scroll progress input
  isExploded?: boolean // Boolean flag for explosion
  dangerMix?: number // 0.0 (safe cyan/emerald) to 1.0 (danger red)
  rotationSpeed?: number
  hoverTilt?: boolean
  position?: [number, number, number]
  scale?: number | [number, number, number]
}

const PELLET_COUNT = 140
const DANGER_COLOR = new THREE.Color('#FF0844')
const TARGET_CYAN = new THREE.Color('#00F2FE')

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
  scrollProgress = 0,
  isExploded = false,
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

  // Calculate combined effective explosion progress
  const effectiveExplode = Math.max(explodeProgress, isExploded ? 1.0 : 0.0, scrollProgress > 0.4 ? Math.min((scrollProgress - 0.4) * 2.5, 1.0) : 0.0)

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
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true
    }
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
    const explodeY = effectiveExplode * 1.75
    if (topShellRef.current) {
      topShellRef.current.position.y = THREE.MathUtils.damp(topShellRef.current.position.y, explodeY, 5, delta)
    }
    if (bottomShellRef.current) {
      bottomShellRef.current.position.y = THREE.MathUtils.damp(bottomShellRef.current.position.y, -explodeY, 5, delta)
    }
    if (collarRef.current) {
      const scaleY = 1 + effectiveExplode * 0.5
      const scaleXZ = 1 - effectiveExplode * 0.15
      collarRef.current.scale.y = THREE.MathUtils.damp(collarRef.current.scale.y, scaleY, 5, delta)
      collarRef.current.scale.x = THREE.MathUtils.damp(collarRef.current.scale.x, scaleXZ, 5, delta)
      collarRef.current.scale.z = THREE.MathUtils.damp(collarRef.current.scale.z, scaleXZ, 5, delta)
    }

    // Bio-Core reveal & pulse
    if (coreRef.current) {
      const targetCoreScale = 0.1 + effectiveExplode * 0.9
      coreRef.current.scale.y = THREE.MathUtils.damp(coreRef.current.scale.y, targetCoreScale, 5, delta)
      coreRef.current.rotation.y += delta * 1.5
      coreMaterial.opacity = 0.2 + effectiveExplode * 0.65 + Math.sin(t * 4) * 0.15
    }

    // Dynamic Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6
      ring1Ref.current.rotation.x = Math.sin(t * 0.4) * 0.3 + 0.9
      const s = 1 + effectiveExplode * 0.35
      ring1Ref.current.scale.set(s, s, s)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.45
      ring2Ref.current.rotation.y = Math.cos(t * 0.5) * 0.35 - 0.7
      const s = 1 + effectiveExplode * 0.45
      ring2Ref.current.scale.set(s, s, s)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3
      ring3Ref.current.rotation.y += delta * 0.3
    }

    // Dynamic Reactive Colors when dangerMix changes
    if (dangerMix > 0) {
      bottomShellMaterial.color.lerpColors(TARGET_CYAN, DANGER_COLOR, dangerMix)
      ring1Material.color.lerpColors(TARGET_CYAN, DANGER_COLOR, dangerMix)
      ring1Material.emissive.lerpColors(TARGET_CYAN, DANGER_COLOR, dangerMix)
    } else {
      bottomShellMaterial.color.set(TARGET_CYAN)
      ring1Material.color.set(TARGET_CYAN)
      ring1Material.emissive.set(TARGET_CYAN)
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
        const dispDistance = effectiveExplode * (2.8 + (i % 5) * 0.3)
        const posX = p.basePos.x + floatX + p.dispDir.x * dispDistance
        const posY = p.basePos.y + floatY + p.dispDir.y * dispDistance
        const posZ = p.basePos.z + floatZ + p.dispDir.z * dispDistance

        dummy.position.set(posX, posY, posZ)

        // Micro rotation and pulse scale
        dummy.rotation.set(t * 0.5 + p.phase, t * 0.7 + p.phase, 0)
        const scalePulse = p.baseScale * (1 + Math.sin(t * 2 + p.phase) * 0.08 + effectiveExplode * 0.25)
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
