import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * DynamicBackground - Pure CSS animated orbs + dot grid.
 * NO scroll-reactive React re-renders. GSAP directly mutates DOM refs.
 */
export function DynamicBackground() {
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Drive orb parallax directly via GSAP without React re-render
    const container = document.getElementById('scroll-container')
    if (!container) return

    if (gridRef.current) {
      gsap.to(gridRef.current, {
        y: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      })
    }

    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        y: -300,
        x: 60,
        scale: 1.4,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,
        },
      })
    }

    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        y: 200,
        x: -40,
        scale: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 4,
        },
      })
    }

    if (orb3Ref.current) {
      gsap.to(orb3Ref.current, {
        y: -150,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3.5,
        },
      })
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden>
      {/* Dot Grid — subtle parallax, never re-renders */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: 'radial-gradient(circle, #216e63 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Teal Orb — top-left, drifts up on scroll */}
      <div
        ref={orb1Ref}
        className="absolute -top-32 -left-20 w-[640px] h-[640px] rounded-full blur-[130px] opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(33,110,99,0.22) 0%, rgba(229,244,240,0.5) 55%, transparent 80%)' }}
      />

      {/* Amber Orb — right-side, drifts down on scroll */}
      <div
        ref={orb2Ref}
        className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full blur-[110px] opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(242,166,90,0.22) 0%, rgba(255,243,196,0.45) 55%, transparent 80%)' }}
      />

      {/* Mint Orb — bottom-left, drifts up slower */}
      <div
        ref={orb3Ref}
        className="absolute -bottom-32 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(6,118,71,0.15) 0%, rgba(209,250,223,0.35) 60%, transparent 80%)' }}
      />
    </div>
  )
}
