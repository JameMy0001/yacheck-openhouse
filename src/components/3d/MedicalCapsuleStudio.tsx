import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { animState } from '../../store/animState'

export interface MedicalCapsuleStudioProps {
  autoSpin?: boolean
}

const COLOR_TEAL = new THREE.Color('#216e63') // Official YaCheck Primary Teal
const COLOR_DANGER = new THREE.Color('#b42318') // Official YaCheck Danger Red
const COLOR_AMBER = new THREE.Color('#f2a65a') // Official YaCheck Warm Amber

export function MedicalCapsuleStudio({
  autoSpin = false,
}: MedicalCapsuleStudioProps) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const topShellGroupRef = useRef<THREE.Group>(null)
  const bottomShellGroupRef = useRef<THREE.Group>(null)
  const collarRef = useRef<THREE.Mesh>(null)
  const coreGroupRef = useRef<THREE.Group>(null)
  const holoCrossRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const nodesGroupRef = useRef<THREE.Group>(null)

  // 1. Geometries
  const cylinderGeom = useMemo(() => new THREE.CylinderGeometry(0.72, 0.72, 0.8, 48, 1, true), [])
  const topDomeGeom = useMemo(
    () => new THREE.SphereGeometry(0.72, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    []
  )
  const bottomDomeGeom = useMemo(
    () => new THREE.SphereGeometry(0.72, 48, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    []
  )
  const collarGeom = useMemo(() => new THREE.CylinderGeometry(0.74, 0.74, 0.12, 48), [])
  const rimTorusGeom = useMemo(() => new THREE.TorusGeometry(0.72, 0.02, 16, 48), [])
  
  // Core & details
  const corePillarGeom = useMemo(() => new THREE.CylinderGeometry(0.24, 0.24, 1.2, 32), [])
  const coreRingGeom = useMemo(() => new THREE.TorusGeometry(0.26, 0.018, 16, 32), [])
  const telemetryRing1Geom = useMemo(() => new THREE.TorusGeometry(1.25, 0.012, 16, 64), [])
  const telemetryRing2Geom = useMemo(() => new THREE.TorusGeometry(1.4, 0.009, 16, 64), [])
  const nodeSphereGeom = useMemo(() => new THREE.SphereGeometry(0.085, 24, 24), [])

  // 2. Materials
  const topGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e5f4f0'),
        transmission: 0.88,
        opacity: 1,
        transparent: true,
        roughness: 0.08,
        ior: 1.52,
        thickness: 0.85,
        specularIntensity: 1.0,
        specularColor: new THREE.Color('#ffffff'),
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.5,
      }),
    []
  )

  const bottomCeramicMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: COLOR_TEAL.clone(),
        roughness: 0.16,
        metalness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        reflectivity: 0.9,
        envMapIntensity: 1.3,
      }),
    []
  )

  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e2e8f0'),
        metalness: 0.92,
        roughness: 0.12,
        envMapIntensity: 1.8,
      }),
    []
  )

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#174e47'), // Dark Teal
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  )

  const glowTealMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#216e63'),
        emissive: new THREE.Color('#216e63'),
        emissiveIntensity: 2.5,
        roughness: 0.2,
      }),
    []
  )

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_AMBER,
        emissive: COLOR_AMBER,
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.75,
      }),
    []
  )

  // Floating Nano Nodes Data (YaCheck Brand: Teal, Amber, Emerald)
  const nodePositions = useMemo(() => {
    const nodes = []
    const count = 12
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 4
      const radius = 0.42
      const y = (i / (count - 1) - 0.5) * 1.1
      const palette = ['#216e63', '#f2a65a', '#067647']
      nodes.push({
        basePos: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
        color: palette[i % 3],
      })
    }
    return nodes
  }, [])

  // 3. Animation Frame - PURELY SCROLL-DRIVEN & CURSOR PARALLAX (Zero continuous auto-spinning)
  useFrame((state, delta) => {
    const { pointer } = state
    const { scrollProgress, explode: explodeProgress, dangerMix, capsuleScale } = animState

    if (masterGroupRef.current) {
      // Hide completely if scale is 0 to save processing
      if (capsuleScale < 0.01) {
        masterGroupRef.current.visible = false
        return
      } else {
        masterGroupRef.current.visible = true
        masterGroupRef.current.scale.setScalar(capsuleScale)
      }
      if (autoSpin) {
        masterGroupRef.current.rotation.y += delta * 0.4
        masterGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
        masterGroupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05
      } else {
        // Scrollytelling progressive rotation directly tied to scroll
        const targetRotX = Math.sin(scrollProgress * Math.PI * 1.5) * 0.35 + pointer.y * 0.15
        const targetRotY = scrollProgress * Math.PI * 2.5 + pointer.x * 0.25
        const targetRotZ = Math.sin(scrollProgress * Math.PI) * 0.12

        masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
          masterGroupRef.current.rotation.x,
          targetRotX,
          4,
          delta
        )
        masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
          masterGroupRef.current.rotation.y,
          targetRotY,
          4,
          delta
        )
        masterGroupRef.current.rotation.z = THREE.MathUtils.damp(
          masterGroupRef.current.rotation.z,
          targetRotZ,
          4,
          delta
        )
      }
    }

    // Exploded View Dynamics directly tied to explodeProgress
    const separation = explodeProgress * 1.65
    if (topShellGroupRef.current) {
      topShellGroupRef.current.position.y = THREE.MathUtils.damp(
        topShellGroupRef.current.position.y,
        0.4 + separation,
        5,
        delta
      )
    }
    if (bottomShellGroupRef.current) {
      bottomShellGroupRef.current.position.y = THREE.MathUtils.damp(
        bottomShellGroupRef.current.position.y,
        -0.4 - separation,
        5,
        delta
      )
    }

    // Collar expansion in explode mode
    if (collarRef.current) {
      const collarScale = 1 + explodeProgress * 0.25
      collarRef.current.scale.set(collarScale, 1, collarScale)
    }

    // Central Bio-Core & Holo Cross - orientation tied to scroll
    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y = scrollProgress * Math.PI * 2
    }
    if (holoCrossRef.current) {
      holoCrossRef.current.rotation.y = -scrollProgress * Math.PI * 3
      const pulseScale = 1 + explodeProgress * 0.25
      holoCrossRef.current.scale.set(pulseScale, pulseScale, pulseScale)
    }

    // Orbital Telemetry Gyro Rings - orientation tied to scroll
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = 0.8 + scrollProgress * 1.2
      ring1Ref.current.rotation.y = scrollProgress * Math.PI * 2
      const ringScale = 1 + explodeProgress * 0.35
      ring1Ref.current.scale.set(ringScale, ringScale, ringScale)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -0.6 - scrollProgress * 1.0
      ring2Ref.current.rotation.z = -scrollProgress * Math.PI * 2
      const ringScale = 1 + explodeProgress * 0.45
      ring2Ref.current.scale.set(ringScale, ringScale, ringScale)
    }

    // Floating Nano-Nodes dispersion strictly based on explodeProgress
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = -scrollProgress * Math.PI * 1.5
      nodesGroupRef.current.children.forEach((child, i) => {
        const base = nodePositions[i].basePos
        const expandFactor = 1 + explodeProgress * 1.8
        child.position.x = base.x * expandFactor
        child.position.y = base.y * (1 + explodeProgress * 0.8)
        child.position.z = base.z * expandFactor
      })
    }

    // Dynamic Color Shift based on dangerMix & scroll
    if (dangerMix > 0) {
      bottomCeramicMaterial.color.lerpColors(COLOR_TEAL, COLOR_DANGER, dangerMix)
      glowTealMaterial.color.lerpColors(new THREE.Color('#216e63'), COLOR_DANGER, dangerMix)
      glowTealMaterial.emissive.lerpColors(new THREE.Color('#216e63'), COLOR_DANGER, dangerMix)
    } else {
      bottomCeramicMaterial.color.lerp(COLOR_TEAL, 0.15)
      glowTealMaterial.color.lerp(new THREE.Color('#216e63'), 0.15)
      glowTealMaterial.emissive.lerp(new THREE.Color('#216e63'), 0.15)
    }
  })

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
        {/* 1. TOP CRYSTAL DOME & SHELL */}
        <group ref={topShellGroupRef} position={[0, 0.4, 0]}>
          {/* Half Cylinder */}
          <mesh geometry={cylinderGeom} material={topGlassMaterial} position={[0, 0, 0]} />
          {/* Rounded Top Dome */}
          <mesh geometry={topDomeGeom} material={topGlassMaterial} position={[0, 0.4, 0]} />
          {/* Chamfered Seam Ring */}
          <mesh geometry={rimTorusGeom} material={titaniumMaterial} position={[0, -0.4, 0]} />
        </group>

        {/* 2. CENTER TITANIUM PRECISION COLLAR */}
        <mesh ref={collarRef} geometry={collarGeom} material={titaniumMaterial} position={[0, 0, 0]} />

        {/* 3. BOTTOM CERAMIC HULL */}
        <group ref={bottomShellGroupRef} position={[0, -0.4, 0]}>
          {/* Half Cylinder */}
          <mesh geometry={cylinderGeom} material={bottomCeramicMaterial} position={[0, 0, 0]} />
          {/* Rounded Bottom Dome */}
          <mesh geometry={bottomDomeGeom} material={bottomCeramicMaterial} position={[0, -0.4, 0]} />
          {/* Chamfered Seam Ring */}
          <mesh geometry={rimTorusGeom} material={titaniumMaterial} position={[0, 0.4, 0]} />
        </group>

        {/* 4. INTERNAL BIO-CORE & AI MICRO-ENGINE */}
        <group ref={coreGroupRef} position={[0, 0, 0]}>
          {/* Central Titanium Pillar */}
          <mesh geometry={corePillarGeom} material={coreMaterial} />

          {/* Glowing Energy Emitter Rings along Core */}
          <mesh geometry={coreRingGeom} material={glowTealMaterial} position={[0, 0.35, 0]} />
          <mesh geometry={coreRingGeom} material={glowTealMaterial} position={[0, -0.35, 0]} />

          {/* Holographic 3D Medical Cross / AI Chip */}
          <group ref={holoCrossRef} position={[0, 0, 0]}>
            {/* Vertical Bar */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.38, 0.08]} />
              <meshStandardMaterial
                color="#216e63"
                emissive="#216e63"
                emissiveIntensity={3.0}
                roughness={0.1}
              />
            </mesh>
            {/* Horizontal Bar */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.38, 0.08, 0.08]} />
              <meshStandardMaterial
                color="#216e63"
                emissive="#216e63"
                emissiveIntensity={3.0}
                roughness={0.1}
              />
            </mesh>
            {/* Center Core Spark */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#f2a65a" />
            </mesh>
          </group>
        </group>

        {/* 5. FLOATING NANO-NODES (Double Helix Array) */}
        <group ref={nodesGroupRef}>
          {nodePositions.map((node, i) => (
            <mesh key={i} geometry={nodeSphereGeom} position={node.basePos}>
              <meshPhysicalMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.2}
                clearcoat={1.0}
              />
            </mesh>
          ))}
        </group>

        {/* 6. ORBITAL TELEMETRY GYROSCOPE RINGS */}
        <mesh ref={ring1Ref} geometry={telemetryRing1Geom} material={ringMaterial} />
        <mesh ref={ring2Ref} geometry={telemetryRing2Geom} material={ringMaterial} />
      </group>
  )
}
