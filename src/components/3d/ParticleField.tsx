import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ParticleFieldProps {
  count?: number // Default: 1800 bio-molecular nodes
  dangerMix?: number // 0.0 to 1.0 (morphs color to alert red)
  expansion?: number // Multiplier driven by scroll/explosion
  speedMultiplier?: number
  color?: string
}

const DANGER_COLOR = new THREE.Color('#FF0844')
const TEMP_COLOR = new THREE.Color()

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
  color,
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

    const customBaseColor = color ? new THREE.Color(color) : null

    const palette = customBaseColor
      ? [customBaseColor]
      : [
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
  }, [count, speedMultiplier, color])

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
        TEMP_COLOR.copy(data.baseColor).lerp(DANGER_COLOR, dangerMix)
        colArray[i * 3] = TEMP_COLOR.r
        colArray[i * 3 + 1] = TEMP_COLOR.g
        colArray[i * 3 + 2] = TEMP_COLOR.b
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
