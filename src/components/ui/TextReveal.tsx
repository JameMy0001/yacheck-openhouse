import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const words = containerRef.current.querySelectorAll('.reveal-word')
    
    gsap.fromTo(
      words,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    )
  }, [children, delay])

  // Split text into words, then wrap each word in an overflow-hidden span
  const words = children.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
      <span className="reveal-word inline-block transform translate-y-full opacity-0">
        {word}
      </span>
    </span>
  ))

  return (
    <div ref={containerRef} className={`${className} leading-tight`}>
      {words}
    </div>
  )
}
