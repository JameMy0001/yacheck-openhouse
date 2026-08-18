import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReady } from '../../context/ReadyContext.tsx'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  distance?: number
  duration?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 32,
  duration = 0.7,
  className = '',
}: ScrollRevealProps) {
  const elemRef = useRef<HTMLDivElement>(null)
  const isReady = useReady()

  // Always start hidden — before ReadyContext fires
  useEffect(() => {
    if (!elemRef.current) return
    gsap.set(elemRef.current, {
      opacity: 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    })
  }, [direction, distance])

  // Setup ScrollTrigger ONLY after LoadingScreen completes
  useEffect(() => {
    if (!isReady || !elemRef.current) return

    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0
    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0

    const trigger = gsap.fromTo(
      elemRef.current,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elemRef.current,
          start: 'top 88%',
          // play on enter, reverse on scroll back up — bidirectional
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      if (trigger.scrollTrigger) trigger.scrollTrigger.kill()
      trigger.kill()
    }
  }, [isReady, direction, delay, distance, duration])

  return (
    <div ref={elemRef} className={className}>
      {children}
    </div>
  )
}
