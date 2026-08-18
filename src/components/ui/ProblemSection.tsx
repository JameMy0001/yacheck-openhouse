import { ScrollReveal } from './ScrollReveal.tsx'
import { AlertCircle } from 'lucide-react'

export function ProblemSection() {
  // Alternating: odd=left, even=right
  const crisisPoints = [
    {
      stat: '1.3M+',
      title: 'อันตรายจากการใช้ยาผิด',
      desc: 'ผู้ป่วยกว่าล้านคนต่อปีใช้ยาผิดวิธีหรือทานซ้ำซ้อนจนเกิดภาวะแทรกซ้อนที่รุนแรงถึงชีวิต',
      side: 'left',
    },
    {
      stat: '42.8%',
      title: 'ความเสี่ยงในผู้สูงอายุ',
      desc: 'ผู้สูงอายุส่วนใหญ่ทานยาเกิน 5 ชนิด เสี่ยงให้เกิดยาตีกัน (Drug Interactions) และผลข้างเคียงสูงมาก',
      side: 'right',
    },
    {
      stat: '78%',
      title: 'ภัยเงียบที่มองไม่เห็น',
      desc: 'ข้อห้ามใช้ระหว่างยาและอาหารที่ไม่เคยรู้ เป็นสาเหตุหลักของการดื้อยา ไตเสื่อม และตับอักเสบ',
      side: 'left',
    },
  ] as const

  return (
    <section
      id="problem"
      className="relative w-full select-none pointer-events-none"
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col pointer-events-auto px-8 sm:px-14 lg:px-20">

        {/* Section Intro — left aligned */}
        <div className="flex flex-col items-start py-20 sm:py-28">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#b42318]/25 bg-[#fee4e2] text-[#b42318] text-[11px] font-mono font-bold tracking-widest uppercase mb-5">
              <AlertCircle className="w-3 h-3" />
              <span>Critical Health Warning</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black tracking-tighter text-[#17211f] leading-[0.93] mb-5">
              ยาตีกัน...<br />
              <span className="text-[#b42318]">อันตรายกว่าที่คิด</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <p className="text-[clamp(0.875rem,1.5vw,1.1rem)] text-[#4a5855] font-normal max-w-md leading-[1.85]">
              การทานยาหลายชนิดร่วมกันอาจหักล้างฤทธิ์กัน หรือทำให้อาการของโรคแย่ลง
              แม้แต่อาหาร เครื่องดื่ม หรือสมุนไพรพื้นบ้าน ก็มีผลรบกวนการออกฤทธิ์ของยา
            </p>
          </ScrollReveal>
        </div>

        {/* Stats — alternating left/right within left half + right half */}
        <div className="flex flex-col gap-20 sm:gap-28 pb-20 sm:pb-28">
          {crisisPoints.map((item, i) => {
            const isRight = item.side === 'right'
            return (
              <div
                key={i}
                className={`flex flex-col max-w-md w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className="text-[clamp(4rem,13vw,7rem)] font-black text-[#b42318]/12 leading-none tracking-tighter mb-1 select-none">
                    {item.stat}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.15}>
                  <h3 className="text-[clamp(1.4rem,3.5vw,2.25rem)] font-black tracking-tight text-[#17211f] leading-tight -mt-1 mb-3">
                    {item.title}
                  </h3>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.25}>
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
