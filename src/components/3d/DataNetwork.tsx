import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

export interface DataNetworkProps {
  scrollProgress?: number
  networkScale?: number
}

const LABELS = [
  'PARACETAMOL', 'RX:392', 'DB_SYNC', 'AI_CHECK:OK', 'CONFLICT:0',
  'USER_992', 'API_OK', 'AMOXICILLIN', 'SAFE', 'CHLORPHENIRAMINE'
]

export function DataNetwork({ scrollProgress = 0, networkScale = 0 }: DataNetworkProps) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const textRefs = useRef<(THREE.Mesh | null)[]>([])
  
  const { camera } = useThree()

  const nodeCount = 150
  const maxDistance = 2.5

  // Generate nodes and edges once
  const { positions, lineGeometry } = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3)
    const points: THREE.Vector3[] = []

    for (let i = 0; i < nodeCount; i++) {
      // Random position in a sphere
      const r = 4.0 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      points.push(new THREE.Vector3(x, y, z))
    }

    // Connect nearby nodes
    const indices: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = points[i].distanceTo(points[j])
        if (dist < maxDistance) {
          indices.push(i, j)
        }
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geom.setIndex(indices)

    return { positions: pos, lineGeometry: geom }
  }, [])

  // Setup instanced mesh matrix
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    if (nodesRef.current) {
      for (let i = 0; i < nodeCount; i++) {
        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )
        // Add subtle floating animation to nodes
        const time = scrollProgress * 10
        dummy.position.y += Math.sin(time + i) * 0.1
        dummy.updateMatrix()
        nodesRef.current.setMatrixAt(i, dummy.matrix)
      }
      nodesRef.current.instanceMatrix.needsUpdate = true
    }
    
    // Update labels to float above their nodes and face the camera
    LABELS.forEach((_, i) => {
      const textMesh = textRefs.current[i]
      if (textMesh && groupRef.current) {
        const time = scrollProgress * 10
        const wobble = Math.sin(time + i) * 0.1
        textMesh.position.set(
          positions[i * 3],
          positions[i * 3 + 1] + wobble + 0.12,
          positions[i * 3 + 2]
        )
        
        // We want the text to face the camera, but the group itself is rotating.
        // So we get the camera's world position, convert it to the group's local space,
        // and make the text look at that local position.
        const localCamPos = camera.position.clone()
        groupRef.current.worldToLocal(localCamPos)
        textMesh.lookAt(localCamPos)
      }
    })

    if (groupRef.current) {
      // Rotation animates slowly
      groupRef.current.rotation.y = scrollProgress * Math.PI * 1.5
      groupRef.current.rotation.x = scrollProgress * Math.PI * 0.5
      
      // Apply the animated scale from GSAP
      groupRef.current.scale.setScalar(networkScale)

      // Hide if scale is 0 to save performance
      groupRef.current.visible = networkScale > 0.01
    }

    if (linesRef.current) {
      // Make lines pulse opacity based on scroll
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = (Math.sin(scrollProgress * 20) * 0.5 + 0.5) * 0.4 * Math.min(networkScale, 1.0)
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#216e63" transparent opacity={0.8} />
      </instancedMesh>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#f2a65a" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      
      {/* Dynamic Text Labels */}
      {LABELS.map((label, i) => (
        <Text
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          fontSize={0.08}
          color="#216e63"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_:"
          fillOpacity={0.85}
        >
          {label}
        </Text>
      ))}
    </group>
  )
}
