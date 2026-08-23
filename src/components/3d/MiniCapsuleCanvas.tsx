import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function CapsuleMesh() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8
      meshRef.current.rotation.x = Math.sin(_ .clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Top half (Teal) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.8, 32]} />
        <meshPhysicalMaterial 
          color="#216e63" 
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color="#216e63" 
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Bottom half (Amber/Cyan or White) - Let's use clean white for medical */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.8, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.58, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

export function MiniCapsuleCanvas() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#f6f8f7] to-[#e5f4f0] rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#bae6fd" />
        
        <Environment preset="city" />
        
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
          <CapsuleMesh />
        </Float>
        
        <ContactShadows 
          position={[0, -1.8, 0]} 
          opacity={0.4} 
          scale={5} 
          blur={1.5} 
          far={3} 
          color="#216e63"
        />
      </Canvas>
    </div>
  )
}
