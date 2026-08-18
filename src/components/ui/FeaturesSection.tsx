import { CalendarClock, Pill, Scan, ShieldAlert, Users, Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

export function FeaturesSection() {
  const features = [
    {
      id: '01',
      tag: 'ตารางรายวัน',
      title: 'ตารางยาวันนี้ & บันทึกดื่มน้ำ',
      subtitle: 'Today Schedule & Hydration',
      desc: 'เปิดแอปมาก็เห็นทันทีว่ามื้อนี้ต้องกินยาอะไร ตัวไหนก่อนหรือหลังอาหาร ไม่ต้องคอยหยิบซองยามาเพ่งอ่าน พร้อมปุ่มกดบันทึกดื่มน้ำช่วยดูแลร่างกาย',
      icon: CalendarClock,
      side: 'left' as const,
    },
    {
      id: '02',
      tag: 'ตู้ยาในบ้าน',
      title: 'ตู้ยาอัจฉริยะ แยกยาไม่ให้ปนกัน',
      subtitle: 'Smart Medicine Cabinet',
      desc: 'จัดระเบียบยาทั้งหมดในบ้าน แยกชัดเจนระหว่าง “ยาที่กำลังกินอยู่” กับ “ยาที่หยุดกินชั่วคราว” ป้องกันคนในบ้านหยิบยาเก่ามากินซ้ำซ้อน',
      icon: Pill,
      side: 'right' as const,
    },
    {
      id: '03',
      tag: 'สแกนฉลากยา',
      title: 'สแกน QR Code & Barcode บนฉลากยา',
      subtitle: 'QR & Barcode Prescription Scanner',
      desc: 'แค่ยกกล้องสแกน QR Code หรือ Barcode บนซองยาจากโรงพยาบาลหรือร้านยา ระบบจะดึงชื่อยา วิธีการทาน และคำเตือนความปลอดภัยเข้าตู้ยาให้อัตโนมัติ',
      icon: Scan,
      side: 'left' as const,
    },
    {
      id: '04',
      tag: 'ตรวจความปลอดภัย',
      title: 'เช็ก 117 คู่ยาตีกัน & ของกินต้องห้าม',
      subtitle: 'Dual-Layer Safety Matrix',
      desc: 'ตรวจเช็กคู่ยาที่ห้ามกินร่วมกัน พร้อมเตือนของกินใกล้ตัว 23 ชนิด เช่น ฟ้าทะลายโจร นม หรือน้ำเกรปฟรุต ที่อาจทำให้ยาหมดฤทธิ์หรือเป็นอันตราย',
      icon: ShieldAlert,
      side: 'right' as const,
    },
    {
      id: '05',
      tag: 'ดูแลครอบครัว',
      title: 'ส่งต่อความห่วงใยให้ครอบครัว',
      subtitle: 'Caregiver Family Link',
      desc: 'อยู่ไกลแค่ไหนก็อุ่นใจ ซิงค์ประวัติการกินยาของพ่อแม่มาไว้ในมือถือลูกหลาน รู้ทันทีว่าท่านกินยาครบหรือยัง พร้อมช่วยเตือนเมื่อถึงเวลา',
      icon: Users,
      side: 'left' as const,
    },
  ]

  return (
    <section
      id="features"
      className="relative w-full select-none pointer-events-none py-28 sm:py-36"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col pointer-events-auto px-6 sm:px-12 lg:px-16">

        <div className="flex flex-col items-start max-w-2xl mb-20 sm:mb-28">
          <ScrollReveal direction="left" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#216e63]" />
              <span>Designed For Real Life</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.12}>
            <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
              Core Features<span className="text-[#f2a65a]">.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.18}>
            <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#216e63] leading-snug mb-4">
              5 ฟังก์ชันหลัก เพื่อความปลอดภัยในทุกมื้อยา
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.25}>
            <p className="text-sm sm:text-base text-[#4a5855] font-normal leading-relaxed max-w-xl">
              ออกแบบจากปัญหาจริงที่คนกินยาต้องเจอทุกวัน ตั้งแต่วินัยการกินยารายมื้อ การเช็กความปลอดภัย ไปจนถึงการดูแลคนที่เรารัก
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {features.map((item) => {
            const Icon = item.icon
            const isRight = item.side === 'right'
            return (
              <div
                key={item.id}
                className={`flex flex-col max-w-xl w-full ${isRight ? 'self-end text-right items-end' : 'self-start text-left items-start'}`}
              >
                <ScrollReveal direction={item.side} delay={0.05}>
                  <div className={`flex items-center gap-3 mb-4 ${isRight ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#e5f4f0] text-[#216e63] border border-[#216e63]/20 shadow-xs flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-[#f6f8f7] border border-[#dde5e2] text-[#216e63]">
                      {item.tag}
                    </span>
                    <span className="text-[2.25rem] font-black text-[#216e63]/20 leading-none tracking-tighter select-none font-mono">
                      {item.id}
                    </span>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.15}>
                  <h3 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-tight text-[#17211f] leading-snug mb-1.5">
                    {item.title}
                  </h3>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.22}>
                  <div className="text-xs sm:text-sm font-bold text-[#216e63] mb-3 uppercase tracking-wider font-mono">
                    {item.subtitle}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction={item.side} delay={0.3}>
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
