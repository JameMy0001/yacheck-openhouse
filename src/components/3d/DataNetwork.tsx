import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollytelling } from '../../hooks/useScrollytelling'

export function DataNetwork() {
  const { scrollProgress, networkScale } = useScrollytelling()

  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)

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
  const targetScale = useRef<number[]>(Array(nodeCount).fill(1))
  
  useFrame((state, delta) => {
    if (nodesRef.current) {
      // Map pointer from normalized device coordinates to rough 3D world coords
      const pointerX = (state.pointer.x * state.viewport.width) / 2
      const pointerY = (state.pointer.y * state.viewport.height) / 2

      for (let i = 0; i < nodeCount; i++) {
        let x = positions[i * 3]
        let y = positions[i * 3 + 1]
        let z = positions[i * 3 + 2]

        // Calculate distance from pointer to node (in 2D projection)
        // Adjust for network rotation if possible, but a rough approximation is fine for effect
        const dx = x - pointerX
        const dy = y - pointerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let repelX = 0
        let repelY = 0
        let s = 1.0

        if (dist < 1.5) {
          // Repel force
          const force = (1.5 - dist) * 0.5
          repelX = (dx / dist) * force
          repelY = (dy / dist) * force
          s = 1.0 + force * 2.0
        }

        targetScale.current[i] = THREE.MathUtils.damp(targetScale.current[i], s, 4, delta)

        dummy.position.set(x + repelX, y + repelY, z)
        
        // Add subtle floating animation to nodes
        const time = scrollProgress * 10
        dummy.position.y += Math.sin(time + i) * 0.1
        
        const currentS = targetScale.current[i]
        dummy.scale.setScalar(currentS)

        dummy.updateMatrix()
        nodesRef.current.setMatrixAt(i, dummy.matrix)
      }
      nodesRef.current.instanceMatrix.needsUpdate = true
    }

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
    </group>
  )
}
