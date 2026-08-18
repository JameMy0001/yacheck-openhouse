import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  distance = 36,
  duration = 0.75,
  className = '',
}: ScrollRevealProps) {
  const elemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elemRef.current) return

    let x = 0
    let y = 0

    if (direction === 'left') x = -distance
    if (direction === 'right') x = distance
    if (direction === 'up') y = distance
    if (direction === 'down') y = -distance

    // Set initial hidden state immediately (no flash)
    gsap.set(elemRef.current, { opacity: 0, x, y })

    const anim = gsap.to(elemRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      paused: true,
      // Use will-change for GPU acceleration
      onStart() {
        if (elemRef.current) elemRef.current.style.willChange = 'transform, opacity'
      },
      onComplete() {
        if (elemRef.current) elemRef.current.style.willChange = 'auto'
      },
    })

    const trigger = ScrollTrigger.create({
      trigger: elemRef.current,
      start: 'top 88%',
      // Play once only — no reverse jitter on scroll back
      onEnter: () => anim.play(),
    })

    return () => {
      trigger.kill()
      anim.kill()
    }
  }, [direction, delay, distance, duration])

  return (
    <div ref={elemRef} className={className}>
      {children}
    </div>
  )
}
