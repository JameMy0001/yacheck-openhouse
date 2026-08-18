import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Loader2, Sparkles, Power } from 'lucide-react'
import { synth } from '../../utils/audioSynth.ts'

export interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('INITIALIZING SYSTEMS')
  const [isReady, setIsReady] = useState(false)

  // Simulation of loading assets & 3D WebGL compiling
  useEffect(() => {
    let current = 0
    
    const interval = setInterval(() => {
      // Simulate non-linear loading
      current += Math.random() * 15
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        
        setTimeout(() => {
          setIsReady(true)
        }, 500)
      }
      
      setProgress(Math.min(current, 100))
      
      // Update text based on phase
      if (current < 30) setLoadingText('BOOTING YaCheck KERNEL...')
      else if (current < 60) setLoadingText('COMPILING NEURAL NETWORK...')
      else if (current < 90) setLoadingText('BUILDING SCENE SHADERS...')
      else setLoadingText('SYSTEMS ONLINE')
      
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const handleEnter = () => {
    // 1. Initialize Audio Context on User Gesture
    synth.init()
    synth.startAmbientDrone()
    synth.playHoverClick()

    // 2. Play exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
        onComplete()
      }
    })

    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
    })
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
    }, '-=0.2')
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211f] text-white overflow-hidden touch-none"
    >
      {/* Background Tech Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#216e63] rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F2FE] rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div ref={textRef} className="relative z-10 flex flex-col items-center max-w-md w-full px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#216e63] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(33,110,99,0.5)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-black tracking-tight">YaCheck<span className="text-[#00F2FE]">.</span></div>
        </div>

        {/* Dynamic State */}
        {!isReady ? (
          <>
            {/* Loading Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 relative">
              <div 
                ref={barRef}
                className="absolute top-0 left-0 h-full bg-[#00F2FE] transition-all duration-300 ease-out shadow-[0_0_15px_#00F2FE]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Stats / Loading Text */}
            <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-[#a0b0ac] uppercase">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-[#00F2FE]" />
                {loadingText}
              </span>
              <span className="text-[#00F2FE] font-bold">{Math.floor(progress)}%</span>
            </div>
          </>
        ) : (
          <button
            onClick={handleEnter}
            onMouseEnter={() => synth.playHoverClick()}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-[#00F2FE]/40 bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 hover:border-[#00F2FE] transition-all overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-[#00F2FE]/20 to-transparent skew-x-[-45deg] group-hover:animate-[shimmer_1.5s_infinite]" />
            <Power className="w-4 h-4 text-[#00F2FE] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-mono font-bold tracking-widest text-white uppercase group-hover:text-[#00F2FE] transition-colors">
              Tap to Enter Experience
            </span>
          </button>
        )}

      </div>
    </div>
  )
}
