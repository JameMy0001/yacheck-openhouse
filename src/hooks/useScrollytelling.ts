import { useEffect, useState, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollytellingState {
  progress: number
  dangerMix: number
  explode: number
  cameraZ: number
  cameraY: number
  currentSection: 'hero' | 'problem' | 'features' | 'specs' | 'cta'
}

export function useScrollytelling(containerId = '#scroll-container') {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dangerMix, setDangerMix] = useState(0)
  const [explode, setExplode] = useState(0)
  const [cameraZ, setCameraZ] = useState(6.0)
  const [cameraY, setCameraY] = useState(0.0)
  const [currentSection, setCurrentSection] = useState<'hero' | 'problem' | 'features' | 'specs' | 'cta'>('hero')

  const animStateRef = useRef({
    progress: 0,
    dangerMix: 0,
    explode: 0,
    cameraZ: 6.0,
    cameraY: 0.0,
  })

  useEffect(() => {
    const sections: Array<'hero' | 'problem' | 'features' | 'specs' | 'cta'> = [
      'hero',
      'problem',
      'features',
      'specs',
      'cta',
    ]

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerId,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)

          // Determine current active section based on progress
          const index = Math.min(Math.floor(p * 5), 4)
          setCurrentSection(sections[index])
        },
      },
    })

    // GSAP ScrollTrigger timeline binding across 5 scene milestones (0%, 25%, 50%, 75%, 100%)
    // Bound to: camera.position, capsule explode distance, shader dangerMix uniform, and progress
    tl.to(
      animStateRef.current,
      {
        progress: 0.0,
        dangerMix: 0.0,
        explode: 0.0,
        cameraZ: 6.0,
        cameraY: 0.0,
        duration: 0.25,
        onUpdate: () => {
          setDangerMix(animStateRef.current.dangerMix)
          setExplode(animStateRef.current.explode)
          setCameraZ(animStateRef.current.cameraZ)
          setCameraY(animStateRef.current.cameraY)
        },
      },
      0.0
    )
      // Scene 2 (Problem): Medication conflict crisis, red dangerMix, closer camera zoom
      .to(
        animStateRef.current,
        {
          progress: 0.25,
          dangerMix: 1.0,
          explode: 0.25,
          cameraZ: 5.2,
          cameraY: -0.2,
          duration: 0.25,
          onUpdate: () => {
            setDangerMix(animStateRef.current.dangerMix)
            setExplode(animStateRef.current.explode)
            setCameraZ(animStateRef.current.cameraZ)
            setCameraY(animStateRef.current.cameraY)
          },
        },
        0.25
      )
      // Scene 3 (Features): AI Scanning & exploded view of active nano-pellets
      .to(
        animStateRef.current,
        {
          progress: 0.5,
          dangerMix: 0.15,
          explode: 0.95,
          cameraZ: 6.6,
          cameraY: 0.3,
          duration: 0.25,
          onUpdate: () => {
            setDangerMix(animStateRef.current.dangerMix)
            setExplode(animStateRef.current.explode)
            setCameraZ(animStateRef.current.cameraZ)
            setCameraY(animStateRef.current.cameraY)
          },
        },
        0.5
      )
      // Scene 4 (Specs): Tech Architecture, sleek compact view
      .to(
        animStateRef.current,
        {
          progress: 0.75,
          dangerMix: 0.0,
          explode: 0.35,
          cameraZ: 5.8,
          cameraY: 0.0,
          duration: 0.25,
          onUpdate: () => {
            setDangerMix(animStateRef.current.dangerMix)
            setExplode(animStateRef.current.explode)
            setCameraZ(animStateRef.current.cameraZ)
            setCameraY(animStateRef.current.cameraY)
          },
        },
        0.75
      )
      // Scene 5 (CTA): OpenHouse Booth Showcase
      .to(
        animStateRef.current,
        {
          progress: 1.0,
          dangerMix: 0.0,
          explode: 0.0,
          cameraZ: 6.2,
          cameraY: 0.0,
          duration: 0.25,
          onUpdate: () => {
            setDangerMix(animStateRef.current.dangerMix)
            setExplode(animStateRef.current.explode)
            setCameraZ(animStateRef.current.cameraZ)
            setCameraY(animStateRef.current.cameraY)
          },
        },
        1.0
      )

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [containerId])

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return {
    scrollProgress,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    currentSection,
    scrollToSection,
  }
}
