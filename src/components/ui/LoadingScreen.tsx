import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoMarkRef = useRef<HTMLDivElement>(null)
  const pillIconRef = useRef<SVGSVGElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const wordMarkRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        // After animation, unmount
        setTimeout(() => setHidden(true), 50)
      },
    })

    // Initial states
    gsap.set([logoMarkRef.current, wordMarkRef.current, taglineRef.current, progressBarRef.current], {
      opacity: 0,
    })
    gsap.set(logoMarkRef.current, { scale: 0.4, y: 12 })
    gsap.set(wordMarkRef.current, { y: 18 })
    gsap.set(taglineRef.current, { y: 10 })
    gsap.set(pillIconRef.current, { rotate: -65, transformOrigin: '50% 50%' })
    gsap.set(dotRef.current, { scale: 0, transformOrigin: '50% 50%' })

    // 1. Logo mark pops in
    tl.to(logoMarkRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.6)',
    })

    // 2. Pill icon rotates to final angle, amber dot pops
    tl.to(
      pillIconRef.current,
      { rotate: -45, duration: 0.45, ease: 'power2.out' },
      '-=0.2'
    )
    tl.to(
      dotRef.current,
      { scale: 1, duration: 0.3, ease: 'back.out(2.5)' },
      '-=0.25'
    )

    // 3. WordMark slides up
    tl.to(
      wordMarkRef.current,
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.1'
    )

    // 4. Tagline fades in
    tl.to(
      taglineRef.current,
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )

    // 5. Progress bar appears and fills
    tl.to(
      progressBarRef.current,
      { opacity: 1, duration: 0.3 },
      '-=0.1'
    )
    tl.to(progressFillRef.current, {
      width: '100%',
      duration: 0.85,
      ease: 'power1.inOut',
    })

    // 6. Hold briefly
    tl.to({}, { duration: 0.2 })

    // 7. Fade out entire overlay
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
    })

    return () => { tl.kill() }
  }, [])

  if (hidden) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f6f8f7] pointer-events-all select-none"
    >
      {/* Logo Mark + WordMark stacked vertically */}
      <div className="flex flex-col items-center gap-5">

        {/* Logo Icon — teal pill box */}
        <div
          ref={logoMarkRef}
          className="relative flex items-center justify-center w-20 h-20 rounded-[22px] bg-[#216e63] shadow-2xl shadow-[#216e63]/30"
        >
          {/* Pill SVG */}
          <svg
            ref={pillIconRef}
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Pill icon: two half-capsule rectangles with a center line */}
            <rect x="4.5" y="10.5" width="15" height="3" rx="1.5" />
            <rect x="2" y="6" width="8" height="12" rx="4" />
            <rect x="14" y="6" width="8" height="12" rx="4" />
            <line x1="10" y1="12" x2="14" y2="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          </svg>

          {/* Amber Dot — bottom-right corner */}
          <span
            ref={dotRef}
            className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#f2a65a] border-2 border-[#f6f8f7]"
          />
        </div>

        {/* WordMark */}
        <div ref={wordMarkRef} className="flex flex-col items-center gap-1">
          <span className="text-[2.75rem] font-black tracking-tighter text-[#17211f] leading-none">
            YaCheck<span className="text-[#f2a65a]">.</span>
          </span>
          <p
            ref={taglineRef}
            className="text-[0.78rem] font-mono font-bold tracking-widest uppercase text-[#216e63] mt-1"
          >
            Medication Safety
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="absolute bottom-16 w-36 h-[3px] rounded-full bg-[#dde5e2] overflow-hidden"
      >
        <div
          ref={progressFillRef}
          className="h-full w-0 rounded-full bg-[#216e63]"
        />
      </div>

      {/* Subtle corner label */}
      <div className="absolute bottom-6 text-[10px] font-mono text-[#64716e] tracking-widest">
        OPENHOUSE 2026
      </div>
    </div>
  )
}
