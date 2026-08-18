import { Sparkles, Activity, ShieldCheck, Zap, ArrowDown } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export interface HeroSectionProps {
  onExploreClick?: () => void
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const stats = [
    { label: 'ความแม่นยำ AI สแกนยา', value: '99.8%', icon: ShieldCheck, color: 'text-[#216e63]', bg: 'bg-[#e5f4f0]' },
    { label: 'วิเคราะห์ยาตีกัน', value: '<200ms', icon: Zap, color: 'text-[#d97706]', bg: 'bg-amber-50' },
    { label: 'ระบบแจ้งเตือน', value: '24/7', icon: Activity, color: 'text-[#067647]', bg: 'bg-emerald-50' },
  ]

  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick()
    } else {
      document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center select-none px-8 sm:px-14 lg:px-20"
    >
      {/* Content — LEFT ALIGNED, max-w constrains to left half away from 3D model */}
      <div className="pointer-events-auto w-full max-w-lg flex flex-col items-start mt-16 md:mt-0">

        {/* Brand Pill Badge */}
        <ScrollReveal direction="left" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Medication Guardian</span>
          </div>
        </ScrollReveal>

        {/* Hero Title */}
        <ScrollReveal direction="left" delay={0.18}>
          <h1 className="text-[clamp(3.5rem,9vw,6.5rem)] font-black tracking-tighter leading-[0.88] text-[#17211f]">
            YaCheck<span className="text-[#f2a65a]">.</span>
          </h1>
        </ScrollReveal>

        {/* Tagline */}
        <ScrollReveal direction="left" delay={0.28}>
          <p className="mt-4 text-[clamp(0.95rem,2vw,1.2rem)] font-bold text-[#216e63] leading-snug">
            ผู้ช่วยดูแลยาในครอบครัวให้ปลอดภัยขึ้นทุกวัน
          </p>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal direction="left" delay={0.36}>
          <p className="mt-3 text-[clamp(0.8rem,1.4vw,1rem)] text-[#4a5855] max-w-sm font-normal leading-[1.8]">
            แอปพลิเคชันอัจฉริยะช่วยจัดการยา ตรวจจับความเสี่ยงยาตีกันด้วย Generative AI
            และสแกนเม็ดยาได้ทันทีเพื่อความปลอดภัยของทุกคนในบ้าน
          </p>
        </ScrollReveal>

        {/* Stats — stacked vertically on left */}
        <div className="flex flex-col gap-2.5 mt-7 w-full">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <ScrollReveal key={i} direction="left" delay={0.44 + i * 0.08}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#dde5e2] bg-white/90 shadow-xs hover:shadow-sm hover:border-[#216e63]/30 transition-all w-full max-w-xs">
                  <div className={`p-1.5 rounded-lg ${stat.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="text-[0.95rem] font-black text-[#17211f] font-mono leading-none">{stat.value}</span>
                    <span className="text-[0.7rem] font-medium text-[#4a5855] ml-2">{stat.label}</span>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      {/* Scroll Indicator — bottom center */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#64716e] group-hover:text-[#216e63] mb-2 transition-colors">
          Scroll to explore
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-[#dde5e2] group-hover:border-[#216e63] flex items-start justify-center pt-1.5 transition-colors">
          <ArrowDown className="w-2.5 h-2.5 text-[#216e63] animate-bounce" />
        </div>
      </button>
    </section>
  )
}
