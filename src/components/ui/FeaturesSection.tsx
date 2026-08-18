import { Scan, Clock, Users, Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export function FeaturesSection() {
  const features = [
    {
      id: '01',
      title: 'AI Scanner',
      subtitle: 'สแกนระบุชนิดยาอัตโนมัติ',
      desc: 'แค่ใช้กล้องสแกนเม็ดยา ระบบ Vision AI จะระบุชื่อยา สรรพคุณ และประเมินความเสี่ยงให้คุณทันทีแบบเรียลไทม์',
      icon: Scan,
      side: 'left',
    },
    {
      id: '02',
      title: 'Smart Reminder',
      subtitle: 'แจ้งเตือนตรงเวลา & ตรวจข้อห้ามใช้',
      desc: 'ระบบเตือนทานยาที่วิเคราะห์ข้อห้ามใช้อัตโนมัติ เช่น ยาตัวนี้ห้ามทานพร้อมนม หรือต้องทานห่างจากยาอีกตัวกี่ชั่วโมง',
      icon: Clock,
      side: 'right',
    },
    {
      id: '03',
      title: 'Caregiver Link',
      subtitle: 'แชร์ข้อมูลเรียลไทม์ให้ครอบครัว',
      desc: 'ระบบซิงค์ประวัติการทานยาของคนที่คุณรักมาไว้ในเครื่องคุณ และส่งรายงานสรุปให้แพทย์ประจำตัวได้อย่างง่ายดาย',
      icon: Users,
      side: 'left',
    },
  ] as const

  return (
    <section
      id="features"
      className="relative w-full select-none pointer-events-none"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col pointer-events-auto px-8 sm:px-14 lg:px-20">

        {/* Section Intro — left aligned */}
        <div className="flex flex-col items-start py-20 sm:py-28">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-5">
              <Sparkles className="w-3 h-3" />
              <span>Core Intelligence</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black tracking-tighter text-[#17211f] leading-[0.93] mb-5">
              Features<span className="text-[#f2a65a]">.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <p className="text-[clamp(0.875rem,1.5vw,1.1rem)] text-[#4a5855] font-normal max-w-md leading-[1.85]">
              เทคโนโลยีที่ถูกออกแบบมาเพื่อความปลอดภัยสูงสุดของคุณและคนที่คุณรัก
            </p>
          </ScrollReveal>
        </div>

        {/* Feature Blocks — alternating sides */}
        <div className="flex flex-col gap-20 sm:gap-28 pb-20 sm:pb-28">
          {features.map((item) => {
            const Icon = item.icon
            const isRight = item.side === 'right'
            return (
              <div
                key={item.id}
                className={`flex flex-col max-w-md w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                {/* Icon + Number */}
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className={`flex items-center gap-3 mb-4 ${isRight ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#e5f4f0] text-[#216e63] border border-[#216e63]/15 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[2.5rem] font-black text-[#216e63]/18 leading-none tracking-tighter select-none">
                      {item.id}
                    </span>
                  </div>
                </ScrollReveal>

                {/* Title */}
                <ScrollReveal direction={item.side} delay={0.15}>
                  <h3 className="text-[clamp(2rem,4.5vw,3.25rem)] font-black tracking-tighter text-[#17211f] leading-none mb-2">
                    {item.title}<span className="text-[#f2a65a]">.</span>
                  </h3>
                </ScrollReveal>

                {/* Subtitle */}
                <ScrollReveal direction={item.side} delay={0.22}>
                  <div className="text-[0.75rem] font-bold text-[#216e63] mb-3 uppercase tracking-widest">
                    {item.subtitle}
                  </div>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction={item.side} delay={0.3}>
                  <p className="text-[clamp(0.85rem,1.4vw,1rem)] text-[#4a5855] leading-[1.85] font-normal max-w-sm">
                    {item.desc}
                  </p>
                </ScrollReveal>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
