import { Sparkles, ShieldCheck, Clock, Users, ArrowDown } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export interface HeroSectionProps {
  onExploreClick?: () => void
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const userPillars = [
    {
      title: 'สแกนฉลากยา รู้ผลทันที',
      desc: 'สแกน QR / Barcode บนซองยา เช็กยาตีกันและของกินต้องห้ามได้ทันที',
      icon: ShieldCheck,
      color: 'text-[#216e63]',
      bg: 'bg-[#e5f4f0]',
      border: 'border-[#216e63]/25',
    },
    {
      title: 'เตือนกินยา ไม่เคยลืม',
      desc: 'จัดตาราง เช้า-กลางวัน-เย็น บอกชัดเจนตัวไหนก่อนหรือหลังอาหาร',
      icon: Clock,
      color: 'text-[#d97706]',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      title: 'ดูแลพ่อแม่ได้จากระยะไกล',
      desc: 'ซิงค์ข้อมูลให้ลูกหลานรู้ทันที ว่าคนที่บ้านกินยาครบหรือยัง',
      icon: Users,
      color: 'text-[#067647]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
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
      <div className="pointer-events-auto w-full max-w-lg flex flex-col items-start mt-16 md:mt-0">

        <ScrollReveal direction="left" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#216e63]" />
            <span>เพื่อนคู่คิดเรื่องยาประจำบ้าน</span>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.18}>
          <h1 className="text-[clamp(3.5rem,9vw,6.5rem)] font-black tracking-tighter leading-[0.88] text-[#17211f]">
            YaCheck<span className="text-[#f2a65a]">.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.28}>
          <p className="mt-4 text-[clamp(1rem,2.2vw,1.25rem)] font-bold text-[#216e63] leading-snug">
            กินยาให้ถูก ไม่ต้องลุ้น ไม่ต้องจำคนเดียว
          </p>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.36}>
          <p className="mt-3 text-[clamp(0.85rem,1.4vw,1rem)] text-[#33413e] max-w-sm font-normal leading-[1.8]">
            แอปช่วยเช็กยาตีกัน เตือนกินยาตรงเวลา และช่วยดูแลสุขภาพของทุกคนในครอบครัว ให้ปลอดภัยในทุกๆ มื้อยา
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-2.5 mt-7 w-full">
          {userPillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <ScrollReveal key={i} direction="left" delay={0.42 + i * 0.08}>
                <div className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border ${pillar.border} bg-white/95 shadow-xs hover:shadow-md hover:border-[#216e63]/40 transition-all w-full max-w-md`}>
                  <div className={`p-2 rounded-xl ${pillar.bg} flex-shrink-0 shadow-2xs`}>
                    <Icon className={`w-4 h-4 ${pillar.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-[#17211f] leading-snug">
                      {pillar.title}
                    </div>
                    <div className="text-[11px] text-[#4a5855] leading-tight mt-0.5 font-normal">
                      {pillar.desc}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#64716e] group-hover:text-[#216e63] mb-2 transition-colors">
          เลื่อนลงเพื่อดูต่อ
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-[#dde5e2] group-hover:border-[#216e63] flex items-start justify-center pt-1.5 transition-colors">
          <ArrowDown className="w-2.5 h-2.5 text-[#216e63] animate-bounce" />
        </div>
      </button>
    </section>
  )
}
