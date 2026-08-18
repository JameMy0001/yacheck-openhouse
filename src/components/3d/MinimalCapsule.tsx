import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MinimalCapsuleProps {
  explodeProgress?: number
  scrollProgress?: number
  dangerMix?: number
}

const TARGET_CYAN = new THREE.Color('#38bdf8') // Tailwind sky-400
const DANGER_COLOR = new THREE.Color('#f87171') // Tailwind red-400

export function MinimalCapsule({
  explodeProgress = 0,
  dangerMix = 0,
}: MinimalCapsuleProps) {
  const groupRef = useRef<THREE.Group>(null)
  const topHalfRef = useRef<THREE.Mesh>(null)
  const bottomHalfRef = useRef<THREE.Mesh>(null)

  // Minimal, elegant geometry
  const geometry = useMemo(() => new THREE.CapsuleGeometry(0.8, 1.2, 32, 64), [])
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.81, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), [])

  // Soft, elegant materials for Light Background
  const topMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e0f2fe'), // subtle sky blue tint
    transmission: 0.1, 
    opacity: 0.85,
    transparent: true,
    roughness: 0.05,
    metalness: 0.05,
    clearcoat: 1.0,
  }), [])

  const bottomMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: TARGET_CYAN.clone(),
    roughness: 0.2,
    metalness: 0.1,
  }), [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const t = state.clock.getElapsedTime()
    
    // Very gentle float and rotation
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.1
    groupRef.current.rotation.y += delta * 0.3
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1

    // Smooth separation (explode)
    const separation = explodeProgress * 1.2
    if (topHalfRef.current) {
      topHalfRef.current.position.y = THREE.MathUtils.damp(topHalfRef.current.position.y, separation, 4, delta)
    }
    if (bottomHalfRef.current) {
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(bottomHalfRef.current.position.y, -separation, 4, delta)
    }

    // Danger mix color transition
    if (dangerMix > 0) {
      bottomMaterial.color.lerpColors(TARGET_CYAN, DANGER_COLOR, dangerMix)
    } else {
      bottomMaterial.color.lerp(TARGET_CYAN, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Top Half */}
      <mesh ref={topHalfRef} geometry={geometry} material={topMaterial} />
      
      {/* Bottom Half (Overlay to create a two-tone capsule) */}
      <mesh 
        ref={bottomHalfRef} 
        geometry={sphereGeometry} 
        material={bottomMaterial} 
        position={[0, 0, 0]}
        rotation={[Math.PI, 0, 0]} 
      />
    </group>
  )
}
