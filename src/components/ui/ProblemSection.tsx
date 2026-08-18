import { ScrollReveal } from './ScrollReveal'
import { TextReveal } from './TextReveal'
import { AlertCircle, AlertTriangle } from 'lucide-react'

export function ProblemSection() {
  const crisisPoints = [
    {
      badge: 'ANNUAL IMPACT',
      stat: '1.3M+',
      title: 'ป่วยหนักเพราะใช้ยาไม่ถูกวิธี',
      desc: 'ผู้ป่วยกว่าล้านคนในแต่ละปี ต้องเข้าโรงพยาบาลจากผลข้างเคียงของการทานยาซ้ำซ้อน หรือใช้ยาผิดวิธีโดยไม่ได้ตั้งใจ',
      side: 'left' as const,
    },
    {
      badge: 'POLYPHARMACY RISK',
      stat: '42.8%',
      title: 'ผู้สูงอายุกินยาเกิน 5 ตัวพร้อมกัน',
      desc: 'ยิ่งมียาหลายโรคที่ต้องกินประจำ ยิ่งเสี่ยงที่ยาจะทำปฏิกิริยาหักล้างกันเอง หรือเสริมฤทธิ์จนร่างกายรับไม่ไหว',
      side: 'right' as const,
    },
    {
      badge: 'SILENT THREAT',
      stat: '78%',
      title: 'ไม่รู้ว่าอาหารก็ทำให้ยาเปลี่ยนไป',
      desc: 'คนส่วนใหญ่ไม่เคยรู้มาก่อนว่า นม น้ำเกรปฟรุต หรือสมุนไพรพื้นบ้าน สามารถขัดขวางการดูดซึมยา หรือทำให้ยาเป็นพิษต่อตับและไตได้',
      side: 'left' as const,
    },
  ]

  return (
    <section
      id="problem"
      className="relative w-full select-none pointer-events-none py-28 sm:py-36"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col pointer-events-auto px-6 sm:px-12 lg:px-16">

        <div className="flex flex-col items-start max-w-2xl mb-16 sm:mb-24">
          <ScrollReveal direction="left" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#b42318]/30 bg-[#fee4e2] text-[#b42318] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Critical Health Warning</span>
            </div>
          </ScrollReveal>

          <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
            <TextReveal>อันตรายจากยา</TextReveal>
            <span className="text-[#b42318] block"><TextReveal delay={0.1}>ที่คุณมองไม่เห็น</TextReveal></span>
          </h2>

          <ScrollReveal direction="left" delay={0.18}>
            <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#b42318] leading-snug mb-4">
              แค่กินยาไม่ตรงกัน... ก็กลายเป็นเรื่องใหญ่ได้
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.25}>
            <p className="text-sm sm:text-base text-[#4a5855] font-normal leading-relaxed max-w-xl">
              หลายครั้งที่เรากินยาตามที่หมอสั่ง แต่พอมารวมกันหลายๆ ตัว หรือเผลอกินคู่กับอาหารบางอย่าง ยาที่ควรรักษาโรค กลับกลายเป็นทำร้ายร่างกายโดยที่เราไม่รู้ตัว
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-16 sm:gap-24">
          {crisisPoints.map((item, i) => {
            const isRight = item.side === 'right'
            return (
              <div
                key={i}
                className={`flex flex-col max-w-lg w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee4e2] border border-[#b42318]/25 text-[#b42318] font-mono font-bold text-[11px] tracking-wider mb-2 shadow-2xs ${isRight ? 'flex-row-reverse' : ''}`}>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.12}>
                  <div className="text-[clamp(3.5rem,9vw,5.75rem)] font-black text-[#b42318] font-mono leading-none tracking-tight mb-2 drop-shadow-xs">
                    {item.stat}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.2}>
                  <h3 className="text-[clamp(1.4rem,3vw,2rem)] font-black tracking-tight text-[#17211f] leading-snug mb-2">
                    {item.title}
                  </h3>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.28}>
                  <p className="text-xs sm:text-sm md:text-base text-[#4a5855] leading-relaxed font-normal max-w-md">
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
