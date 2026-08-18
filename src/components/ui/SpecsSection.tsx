import { Cpu, Database, BrainCircuit, ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export function SpecsSection() {
  const specs = [
    {
      title: 'React Native Engine',
      subtitle: 'Native Mobile Performance',
      desc: 'พัฒนาด้วย React Native & Expo เพื่อประสิทธิภาพสูงสุด 60 FPS บนทั้ง iOS และ Android พร้อมระบบสแกนกล้องเรียลไทม์',
      icon: Cpu,
      side: 'left',
    },
    {
      title: 'Local-First SQLite',
      subtitle: 'Zero-Latency Offline Resilience',
      desc: 'สถาปัตยกรรม Local-First ฝังฐานข้อมูล SQLite ออฟไลน์ไว้ในเครื่อง ตรวจสอบยาและแจ้งเตือนได้ 100% แม้ไม่มีสัญญาณ',
      icon: Database,
      side: 'right',
    },
    {
      title: 'On-Device + Cloud AI',
      subtitle: 'Hybrid Intelligence Stack',
      desc: 'ผสานพลังโมเดลวิเคราะห์ภาพเม็ดยาบนเครื่อง (On-Device Vision) กับ Generative AI บนคลาวด์เพื่อตรวจจับปฏิกิริยายาตีกัน',
      icon: BrainCircuit,
      side: 'left',
    },
  ] as const

  const enterpriseBadges = [
    { label: 'PDPA & Medical Privacy Compliant', icon: ShieldCheck },
    { label: 'End-to-End Encrypted Sync', icon: Lock },
    { label: '<200ms On-Device Inference', icon: Zap },
    { label: '99.9% Telemetry Uptime', icon: RefreshCw },
  ]

  return (
    <section
      id="specs"
      className="relative w-full select-none pointer-events-none"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col pointer-events-auto px-8 sm:px-14 lg:px-20">

        {/* Section Intro — left aligned */}
        <div className="flex flex-col items-start py-20 sm:py-28">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-5">
              <Cpu className="w-3 h-3" />
              <span>Engineering Stack</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <h2 className="text-[clamp(2rem,6.5vw,4.5rem)] font-black tracking-tighter text-[#17211f] leading-[0.93] mb-5">
              Under the Hood<span className="text-[#f2a65a]">.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <p className="text-[clamp(0.875rem,1.5vw,1.1rem)] text-[#4a5855] font-normal max-w-md leading-[1.85]">
              ขับเคลื่อนด้วยสถาปัตยกรรมระดับ Medical-Grade ที่เสถียร ปลอดภัย และรวดเร็วที่สุด
            </p>
          </ScrollReveal>
        </div>

        {/* Spec Blocks — alternating sides */}
        <div className="flex flex-col gap-20 sm:gap-28 pb-12">
          {specs.map((item, i) => {
            const Icon = item.icon
            const isRight = item.side === 'right'
            return (
              <div
                key={i}
                className={`flex flex-col max-w-md w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                {/* Icon + Subtitle */}
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className={`flex items-center gap-3 mb-4 ${isRight ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#e5f4f0] text-[#216e63] border border-[#216e63]/15 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#216e63] uppercase tracking-widest bg-[#e5f4f0] px-3 py-1 rounded-full border border-[#216e63]/20">
                      {item.subtitle}
                    </span>
                  </div>
                </ScrollReveal>

                {/* Title */}
                <ScrollReveal direction={item.side} delay={0.15}>
                  <h3 className="text-[clamp(1.5rem,4vw,2.75rem)] font-black tracking-tighter text-[#17211f] leading-tight mb-3">
                    {item.title}<span className="text-[#f2a65a]">.</span>
                  </h3>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction={item.side} delay={0.25}>
                  <p className="text-[clamp(0.85rem,1.4vw,1rem)] text-[#4a5855] leading-[1.85] font-normal max-w-sm">
                    {item.desc}
                  </p>
                </ScrollReveal>
              </div>
            )
          })}
        </div>

        {/* Trust Badge Strip */}
        <div className="py-14 border-t border-[#dde5e2]">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#64716e] mb-5">
              Enterprise-Grade Compliance
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap gap-2.5">
            {enterpriseBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <ScrollReveal key={idx} direction="up" delay={0.12 + idx * 0.06}>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#dde5e2] text-[#17211f] font-semibold text-xs shadow-xs hover:border-[#216e63]/30 hover:shadow-sm transition-all">
                    <Icon className="w-3.5 h-3.5 text-[#216e63]" />
                    <span>{badge.label}</span>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
