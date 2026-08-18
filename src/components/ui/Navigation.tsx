import { useState, useEffect } from 'react'
import { Pill, Volume2, VolumeX, Sparkles, Activity, ShieldAlert, Cpu, Download, Menu, X } from 'lucide-react'

export interface NavigationProps {
  currentSection?: string
  onNavigate?: (sectionId: string) => void
}

export function Navigation({ currentSection = 'hero', onNavigate }: NavigationProps) {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const playInteractionSound = (freq = 440, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } catch {
      // Audio context might be restricted
    }
  }

  const toggleSound = () => {
    const nextState = !soundEnabled
    setSoundEnabled(nextState)
    if (nextState) {
      playInteractionSound(587.33, 'triangle')
    }
  }

  const handleNavClick = (sectionId: string) => {
    playInteractionSound(523.25, 'sine')
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(sectionId)
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const navItems = [
    { id: 'hero', label: 'Overview', icon: Pill },
    { id: 'problem', label: 'Problem', icon: ShieldAlert },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'specs', label: 'Tech Stack', icon: Cpu },
    { id: 'cta', label: 'Get App', icon: Download },
  ]

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-5xl rounded-full border transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 border-[#dde5e2] shadow-lg shadow-[#216e63]/5 backdrop-blur-xl py-2.5 px-4 sm:px-6'
            : 'bg-white/80 border-[#dde5e2] shadow-sm backdrop-blur-lg py-3 px-5 sm:px-7'
        } flex items-center justify-between`}
      >
        {/* Brand Logo with YaCheck Teal + Amber Mark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('hero')
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#216e63] shadow-md shadow-[#216e63]/20 group-hover:scale-105 transition-transform">
            <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-white transform -rotate-45" />
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#f2a65a] border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#17211f]">
              YaCheck<span className="text-[#f2a65a]">.</span>
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#216e63] -mt-1 hidden sm:block">
              MEDICATION SAFETY
            </span>
          </div>
        </a>

        {/* Live System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[#067647]/20 bg-[#d1fadf]/50 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#067647] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#067647]" />
          </span>
          <span className="text-xs font-mono font-bold text-[#067647] tracking-wide">
            OpenHouse 2026 Live
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#216e63] bg-[#e5f4f0] border border-[#216e63]/30 shadow-xs'
                    : 'text-[#4a5855] hover:text-[#17211f] hover:bg-[#f6f8f7] border border-transparent'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        {/* Action Controls & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'border-[#216e63]/30 bg-[#e5f4f0] text-[#216e63]'
                : 'border-[#dde5e2] bg-white text-[#64716e] hover:text-[#17211f]'
            }`}
            title={soundEnabled ? 'Mute Bio-Telemetry FX' : 'Enable Bio-Telemetry FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('cta')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#216e63] hover:bg-[#174e47] text-white text-xs font-bold shadow-md shadow-[#216e63]/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ลองใช้งาน</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-[#dde5e2] bg-white text-[#17211f] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 p-4 rounded-2xl bg-white/95 border border-[#dde5e2] backdrop-blur-2xl shadow-2xl flex flex-col gap-2 md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dde5e2]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#067647]" />
              </span>
              <span className="text-xs font-mono font-bold text-[#067647]">OpenHouse 2026 Live</span>
            </div>
            <span className="text-[10px] font-mono text-[#64716e]">Booth YaCheck</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-[#216e63] bg-[#e5f4f0]'
                    : 'text-[#4a5855] hover:bg-[#f6f8f7]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#216e63]" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </div>
      )}
    </header>
  )
}
