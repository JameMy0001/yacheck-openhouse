import { Cpu, Database, BrainCircuit, ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export function SpecsSection() {
  const specs = [
    {
      title: 'ลื่นไหลระดับเนทีฟ ทั้ง iOS & Android',
      subtitle: 'React Native & Expo Engine',
      desc: 'พัฒนาด้วยเทคโนโลยีที่ตอบสนองทันใจ แสดงผล 60 FPS นุ่มนวล พร้อมระบบเปิดกล้องสแกนยาที่รวดเร็วทันทีที่หยิบมือถือขึ้นมา',
      icon: Cpu,
      side: 'left' as const,
    },
    {
      title: 'ใช้งานได้ 100% แม้ไม่มีสัญญาณเน็ต',
      subtitle: 'Local-First SQLite Database',
      desc: 'เก็บข้อมูลตู้ยาและกฎความปลอดภัยไว้ในตัวเครื่องแบบออฟไลน์ อยู่ในที่อับสัญญาณก็ยังเปิดเช็กยาและรับการแจ้งเตือนได้ไม่สะดุด',
      icon: Database,
      side: 'right' as const,
    },
    {
      title: 'สแกนฉลากยาแม่นยำ พร้อมระบบคลาวด์วิเคราะห์',
      subtitle: 'Hybrid Intelligence Architecture',
      desc: 'ระบบสแกน QR Code และ Barcode บนเครื่องทำงานได้ทันที พร้อมเชื่อมต่อฐานข้อมูลยากลางเพื่อตรวจสอบความปลอดภัยและคู่ยาตีกัน',
      icon: BrainCircuit,
      side: 'left' as const,
    },
  ]

  const enterpriseBadges = [
    { label: 'คุ้มครองข้อมูลส่วนบุคคลตามกฎหมาย PDPA', icon: ShieldCheck },
    { label: 'เข้ารหัสความปลอดภัยแบบ End-to-End', icon: Lock },
    { label: 'สแกน QR / Barcode บนเครื่องทันใจ (<200ms)', icon: Zap },
    { label: 'ระบบฐานข้อมูลกลาง Supabase เสถียร 99.9%', icon: RefreshCw },
  ]

  return (
    <section
      id="specs"
      className="relative w-full select-none pointer-events-none py-28 sm:py-36"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col pointer-events-auto px-6 sm:px-12 lg:px-16">

        {/* Section Intro — Clean Typography */}
        <div className="flex flex-col items-start max-w-2xl mb-16 sm:mb-24">
          <ScrollReveal direction="left" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
              <Cpu className="w-3.5 h-3.5" />
              <span>Under The Hood</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.12}>
            <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
              Engineering<span className="text-[#f2a65a]">.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.18}>
            <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#216e63] leading-snug mb-4">
              เทคโนโลยีเพื่อความเสถียรและความเป็นส่วนตัว
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.25}>
            <p className="text-sm sm:text-base text-[#4a5855] font-normal leading-relaxed max-w-xl">
              ออกแบบสถาปัตยกรรมให้ใช้งานง่าย รวดเร็ว ปลอดภัย และไม่กินทรัพยากรเครื่อง เพื่อให้ทุกคนเข้าถึงการดูแลสุขภาพได้อย่างไร้กังวล
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
                className={`flex flex-col max-w-lg w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                {/* Icon + Subtitle */}
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className={`flex items-center gap-3 mb-4 ${isRight ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#e5f4f0] text-[#216e63] border border-[#216e63]/20 shadow-xs flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#216e63] uppercase tracking-wider bg-[#e5f4f0] px-3 py-1 rounded-full border border-[#216e63]/20">
                      {item.subtitle}
                    </span>
                  </div>
                </ScrollReveal>

                {/* Title */}
                <ScrollReveal direction={item.side} delay={0.15}>
                  <h3 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-[#17211f] leading-snug mb-2">
                    {item.title}
                  </h3>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction={item.side} delay={0.25}>
                  <p className="text-xs sm:text-sm md:text-base text-[#4a5855] leading-relaxed font-normal max-w-md">
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
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-[#216e63] mb-5">
              มาตรฐานความปลอดภัยและความเป็นส่วนตัว
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap gap-2.5">
            {enterpriseBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <ScrollReveal key={idx} direction="up" delay={0.12 + idx * 0.06}>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#dde5e2] text-[#17211f] font-semibold text-xs shadow-xs hover:border-[#216e63]/30 hover:shadow-sm transition-all">
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
