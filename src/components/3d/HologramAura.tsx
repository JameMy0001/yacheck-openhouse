import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import '../../shaders/AuraShaderMaterial.ts'

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
