import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

export function useAutoLoop() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dangerMix, setDangerMix] = useState(0)
  const [explode, setExplode] = useState(0)
  const [cameraZ, setCameraZ] = useState(6.0)
  const [cameraY, setCameraY] = useState(0.0)
  const [capsuleScale, setCapsuleScale] = useState(1.0)
  const [networkScale, setNetworkScale] = useState(0.0)

  const animStateRef = useRef({
    progress: 0,
    dangerMix: 0,
    explode: 0,
    cameraZ: 6.0,
    cameraY: 0.0,
    capsuleScale: 1.0,
    networkScale: 0.0,
  })

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true, // Play forward then reverse for a seamless loop
      defaults: { ease: "sine.inOut" } // Smooth easing between keyframes
    })

    const syncState = () => {
      setScrollProgress(animStateRef.current.progress)
      setDangerMix(animStateRef.current.dangerMix)
      setExplode(animStateRef.current.explode)
      setCameraZ(animStateRef.current.cameraZ)
      setCameraY(animStateRef.current.cameraY)
      setCapsuleScale(animStateRef.current.capsuleScale)
      setNetworkScale(animStateRef.current.networkScale)
    }

    // Multiply durations by a factor (e.g. 20) to make the whole timeline take ~20 seconds
    const factor = 25

    tl.to(
      animStateRef.current,
      {
        progress: 0.0,
        dangerMix: 0.0,
        explode: 0.0,
        cameraZ: 6.0,
        cameraY: 0.0,
        capsuleScale: 1.0,
        networkScale: 0.0,
        duration: 0.15 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 0.16,
        dangerMix: 1.0,
        explode: 0.2,
        cameraZ: 5.4,
        cameraY: -0.15,
        capsuleScale: 1.0,
        networkScale: 0.0,
        duration: 0.16 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 0.33,
        dangerMix: 0.1,
        explode: 0.85,
        cameraZ: 6.5,
        cameraY: 0.25,
        capsuleScale: 1.0,
        networkScale: 0.0,
        duration: 0.17 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 0.5,
        dangerMix: 0.0,
        explode: 1.5,
        cameraZ: 5.8,
        cameraY: 0.0,
        capsuleScale: 0.0,
        networkScale: 1.0,
        duration: 0.17 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 0.66,
        dangerMix: 0.0,
        explode: 0.0,
        cameraZ: 6.2,
        cameraY: 0.1,
        capsuleScale: 0.0,
        networkScale: 1.5,
        duration: 0.16 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 0.83,
        dangerMix: 0.0,
        explode: 0.0,
        cameraZ: 4.0,
        cameraY: 0.0,
        capsuleScale: 0.0,
        networkScale: 3.5,
        duration: 0.17 * factor,
        onUpdate: syncState,
      }
    )
    .to(
      animStateRef.current,
      {
        progress: 1.0,
        dangerMix: 0.0,
        explode: 0.0,
        cameraZ: 6.2,
        cameraY: 0.0,
        capsuleScale: 0.0,
        networkScale: 1.2,
        duration: 0.17 * factor,
        onUpdate: syncState,
      }
    )
    // Add a small pause at the end before yoyo reversing
    .to(animStateRef.current, { duration: 2.0 })

    return () => {
      tl.kill()
    }
  }, [])

  return {
    scrollProgress,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    capsuleScale,
    networkScale,
  }
}
