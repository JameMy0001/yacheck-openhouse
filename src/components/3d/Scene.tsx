import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { MedicalCapsuleStudio } from './MedicalCapsuleStudio'
import { DataNetwork } from './DataNetwork'
import { ErrorBoundary } from '../common/ErrorBoundary'

export interface SceneProps {
  scrollProgress?: number
  dangerMix?: number
  isExploded?: boolean
  explodeProgress?: number
  cameraZ?: number
  cameraY?: number
  capsuleScale?: number
  networkScale?: number
  className?: string
  autoSpin?: boolean
}

function PostProcessEffects() {
  return (
    <EffectComposer>
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.1} darkness={0.9} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

/**
 * High-End Studio Lighting Rig (Superlist / Apple / GC Style)
 */
export function StudioLighting() {
  return (
    <group name="studio-lighting">
      <ambientLight intensity={0.75} color="#f8fafc" />
      {/* Key Light */}
      <directionalLight
        position={[6, 12, 8]}
        intensity={2.2}
        color="#ffffff"
      />
      {/* Cool Sky Fill */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={1.2}
        color="#bae6fd"
      />
      {/* Warm Rim / Specular Accent */}
      <directionalLight
        position={[0, -8, 6]}
        intensity={0.8}
        color="#fef08a"
      />
    </group>
  )
}

/**
 * Smooth Interactive Camera Controller
 */
export function CameraController({
  targetCamZ = 6.0,
  targetCamY = 0.0,
}: {
  targetCamZ?: number
  targetCamY?: number
}) {
  const { camera, viewport } = useThree()

  useFrame((_state, delta) => {
    const isPortrait = viewport.aspect < 1
    const baseZ = isPortrait ? targetCamZ * 1.35 : targetCamZ
    const baseY = isPortrait ? targetCamY + 0.25 : targetCamY

    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 2.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, baseY, 2.5, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ, 2.5, delta)
    camera.lookAt(0, baseY, 0)
  })

  return null
}

export function Scene({
  scrollProgress = 0,
  dangerMix = 0,
  explodeProgress = 0,
  cameraZ = 5.8,
  cameraY = 0.0,
  capsuleScale = 1.0,
  networkScale = 0.0,
  className = 'w-full h-full',
  autoSpin = false,
}: SceneProps) {
  // Performance optimization hook
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <ErrorBoundary>
      <div className={`relative ${className}`}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 42, near: 0.1, far: 100 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: !isMobile, // Disable antialiasing on mobile to save performance
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="w-full h-full"
        >
          <CameraController targetCamZ={cameraZ} targetCamY={cameraY} />
          <StudioLighting />

          <Suspense fallback={null}>
            {/* HDRI Studio Reflections */}
            <Environment preset="city" />

            {/* Medical Tech 3D Centerpiece */}
            {capsuleScale > 0.01 && (
              <group scale={capsuleScale}>
                <MedicalCapsuleStudio
                  explodeProgress={explodeProgress}
                  scrollProgress={scrollProgress}
                  dangerMix={dangerMix}
                  autoSpin={autoSpin}
                />
              </group>
            )}

            {/* 3D Data Network & Workflow (Appears later) */}
            {networkScale > 0.01 && (
               <DataNetwork />
            )}

            {/* Soft Studio Floor Contact Shadow - Lower resolution on mobile */}
            <ContactShadows
              position={[0, -2.2, 0]}
              opacity={0.3}
              scale={10}
              blur={2.4}
              far={4}
              resolution={isMobile ? 256 : 512}
              frames={1} // Only render shadow once instead of every frame to save massive performance
              color="#0f172a"
            />
            
            {/* Disable post-processing entirely on mobile for smooth scrolling */}
            {!isMobile && <PostProcessEffects />}
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
