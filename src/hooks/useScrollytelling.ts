import { useEffect, useState, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type SectionId = 'hero' | 'problem' | 'features' | 'agent' | 'database' | 'specs' | 'cta'

export function useScrollytelling(containerId = '#scroll-container') {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [dangerMix, setDangerMix] = useState(0)
  const [explode, setExplode] = useState(0)
  const [cameraZ, setCameraZ] = useState(6.0)
  const [cameraY, setCameraY] = useState(0.0)
  const [capsuleScale, setCapsuleScale] = useState(1.0)
  const [networkScale, setNetworkScale] = useState(0.0)
  const [currentSection, setCurrentSection] = useState<SectionId>('hero')

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
    const sections: SectionId[] = [
      'hero',
      'problem',
      'features',
      'agent',
      'database',
      'specs',
      'cta',
    ]

    const triggers = sections.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setCurrentSection(id),
        onEnterBack: () => setCurrentSection(id),
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerId,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
          setScrollVelocity(self.getVelocity() / 1000) // normalized velocity
        },
      },
    })

    const syncState = () => {
      setDangerMix(animStateRef.current.dangerMix)
      setExplode(animStateRef.current.explode)
      setCameraZ(animStateRef.current.cameraZ)
      setCameraY(animStateRef.current.cameraY)
      setCapsuleScale(animStateRef.current.capsuleScale)
      setNetworkScale(animStateRef.current.networkScale)
    }

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
        duration: 0.15,
        onUpdate: syncState,
      },
      0.0
    )
      // Scene 2 (Problem): Medication conflict crisis, red dangerMix
      .to(
        animStateRef.current,
        {
          dangerMix: 1.0,
          explode: 0.2,
          cameraZ: 5.4,
          cameraY: -0.15,
          capsuleScale: 1.0,
          networkScale: 0.0,
          duration: 0.15,
          onUpdate: syncState,
        },
        0.16
      )
      // Scene 3 (Features): 5 Core Pillars, exploding nano-nodes
      .to(
        animStateRef.current,
        {
          dangerMix: 0.1,
          explode: 0.85,
          cameraZ: 6.5,
          cameraY: 0.25,
          capsuleScale: 1.0,
          networkScale: 0.0,
          duration: 0.15,
          onUpdate: syncState,
        },
        0.33
      )
      // Scene 4 (Agent): Supervisor Architecture, glowing core focus
      // TRANSITION: Capsule explodes and scales down to 0, Network scales up to 1
      .to(
        animStateRef.current,
        {
          dangerMix: 0.0,
          explode: 1.5,
          cameraZ: 5.8,
          cameraY: 0.0,
          capsuleScale: 0.0,
          networkScale: 1.0,
          duration: 0.15,
          onUpdate: syncState,
        },
        0.5
      )
      // Scene 5 (Database): Clinical Catalogue & Evidence
      // Network expands and rotates
      .to(
        animStateRef.current,
        {
          dangerMix: 0.0,
          explode: 0.0,
          cameraZ: 6.2,
          cameraY: 0.1,
          capsuleScale: 0.0,
          networkScale: 1.5,
          duration: 0.15,
          onUpdate: syncState,
        },
        0.66
      )
      // Scene 6 (Specs): Tech Architecture
      // Camera flies *through* the network (Network scales up aggressively to wrap camera)
      .to(
        animStateRef.current,
        {
          dangerMix: 0.0,
          explode: 0.0,
          cameraZ: 4.0,
          cameraY: 0.0,
          capsuleScale: 0.0,
          networkScale: 3.5,
          duration: 0.15,
          onUpdate: syncState,
        },
        0.83
      )
      // Scene 7 (CTA): Download & OpenHouse
      // Network normalizes in background
      .to(
        animStateRef.current,
        {
          dangerMix: 0.0,
          explode: 0.0,
          cameraZ: 6.2,
          cameraY: 0.0,
          capsuleScale: 0.0,
          networkScale: 1.2,
          duration: 0.15,
          onUpdate: syncState,
        },
        1.0
      )

    return () => {
      triggers.forEach((t) => t?.kill())
      tl.kill()
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
    scrollVelocity,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    capsuleScale,
    networkScale,
    currentSection,
    scrollToSection,
  }
}
