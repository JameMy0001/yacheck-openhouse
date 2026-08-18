import { BrainCircuit, CheckCircle2, Database, Lock, Activity, UserCheck, ShieldCheck, FileCheck2 } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { AgentPhoneMockup } from './AgentPhoneMockup'

export function AgentSection() {
  const agentDomains = [
    { id: '01', title: 'โรคประจำตัว', desc: 'ตรวจเช็กว่ายาตัวไหนมีข้อห้ามใช้กับโรคที่คุณกำลังรักษาอยู่' },
    { id: '02', title: 'ประวัติแพ้ยา', desc: 'คัดกรองกลุ่มยาที่เสี่ยงแพ้ซ้ำ เพื่อความปลอดภัยสูงสุด' },
    { id: '03', title: 'ยาตีกัน & อาหาร', desc: 'เช็กปฏิกิริยาของยา 117 คู่ และของกินต้องห้าม 23 ชนิด' },
    { id: '04', title: 'ตารางเวลากินยา', desc: 'คำนวณช่วงเวลาการดูดซึมยา ก่อน-หลังอาหารอย่างเหมาะสม' },
    { id: '05', title: 'ยาที่กำลังกินอยู่', desc: 'มองเห็นภาพรวมของยาทุกตัวในบ้านพร้อมกันแบบองค์รวม' },
    { id: '06', title: 'วินัยการกินยาจริง', desc: 'ติดตามความสม่ำเสมอในการกินยา เพื่อผลการรักษาที่ดีที่สุด' },
    { id: '07', title: 'การดื่มน้ำและร่างกาย', desc: 'ดูแลปริมาณน้ำดื่มให้เพียงพอ ช่วยให้ไตขับยาได้อย่างมีประสิทธิภาพ' },
  ]

  const agentHighlights = [
    {
      icon: ShieldCheck,
      title: 'ตรวจด้วยกฎ ไม่ใช้การเดา',
      subtitle: 'Zero-Hallucination Policy',
      desc: 'เราแยกการตรวจความปลอดภัยออกจากโมเดลภาษา AI มีหน้าที่สรุปและอธิบายเป็นภาษาเข้าใจง่าย แต่ผลตรวจยาตีกันจะคำนวณจากกฎทางการแพทย์ที่เภสัชกรรับรองแล้วเท่านั้น',
      badge: 'ความปลอดภัยสูงสุด',
    },
    {
      icon: FileCheck2,
      title: 'ทุกคำตอบ มีที่มาชัดเจน',
      subtitle: 'Explainable Audit Trail',
      desc: 'ทุกคำเตือนที่ระบบแจ้ง จะระบุเอกสารอ้างอิงและระดับความรุนแรงอย่างโปร่งใส สามารถตรวจสอบย้อนหลังได้ทุกขั้นตอน ไม่มีการแต่งข้อมูลขึ้นมาเอง',
      badge: 'ตรวจสอบได้ 100%',
    },
    {
      icon: UserCheck,
      title: 'ส่งต่อเภสัชกรได้ทันที',
      subtitle: 'Human-in-the-Loop Workflow',
      desc: 'หากเจอเคสที่ซับซ้อนหรือไม่แน่ใจ ผู้ใช้สามารถกดส่งคำขอตรวจทาน เพื่อให้ทีมบุคลากรทางการแพทย์ช่วยตรวจสอบและให้คำแนะนำเพิ่มเติมได้โดยตรง',
      badge: 'มีผู้เชี่ยวชาญดูแล',
    },
  ]

  return (
    <section
      id="agent"
      className="relative w-full select-none pointer-events-none py-28 sm:py-36"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col pointer-events-auto px-6 sm:px-12 lg:px-16">

        {/* Section Header & Phone Mockup Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 sm:mb-24">
          
          {/* Header Text */}
          <div className="flex flex-col items-start max-w-xl">
            <ScrollReveal direction="left" delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
                <BrainCircuit className="w-3.5 h-3.5 text-[#216e63]" />
                <span>Intelligent Care Architecture</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.12}>
              <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
                Care Agent<span className="text-[#f2a65a]">.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.18}>
              <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#216e63] leading-snug mb-4">
                ระบบ AI ผู้ช่วยที่คิดรอบคอบ และไม่เดาข้อมูลมั่ว
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.25}>
              <p className="text-sm sm:text-base text-[#4a5855] font-normal leading-relaxed max-w-xl">
                ไม่ใช่แค่แชทบอทที่ตอบไปเรื่อย แต่เป็น <strong className="text-[#17211f] font-bold">AI ผู้ช่วยทางการแพทย์</strong> ที่คิดตามหลักความปลอดภัย ตรวจสอบข้อมูลรอบด้านเพื่อสุขภาพของทุกคนในบ้าน
              </p>
            </ScrollReveal>
          </div>

          {/* Interactive Phone Mockup */}
          <ScrollReveal direction="up" delay={0.3} className="w-full lg:w-auto flex justify-center mt-10 lg:mt-0 lg:ml-auto">
            <AgentPhoneMockup />
          </ScrollReveal>

        </div>

        {/* The 3 Professional Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20 sm:mb-28">
          {agentHighlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <ScrollReveal key={idx} direction="up" delay={0.1 + idx * 0.1}>
                <div className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl border border-[#dde5e2] bg-white/95 shadow-sm hover:shadow-lg hover:border-[#216e63]/40 transition-all group h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#e5f4f0] text-[#216e63] border border-[#216e63]/20 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#f6f8f7] border border-[#dde5e2] text-[#216e63]">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-[#17211f] tracking-tight mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-xs font-bold text-[#216e63] uppercase tracking-wider mb-3 font-mono">
                      {item.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm text-[#4a5855] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#dde5e2]/80 flex items-center gap-2 text-[11px] font-mono text-[#067647] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ผ่านการทดสอบมาตรฐานทางคลินิก</span>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* 7-Domain Patient Snapshot Showcase */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#dde5e2] bg-[#f6f8f7]/90 shadow-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#dde5e2] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#216e63] uppercase tracking-widest mb-1.5">
                <Database className="w-4 h-4" />
                <span>ประมวลผลข้อมูลรอบด้าน</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#17211f] tracking-tight leading-snug">
                สรุปข้อมูลสุขภาพ 7 มิติของผู้ใช้
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#4a5855]">
              <Lock className="w-3.5 h-3.5 text-[#216e63]" />
              <span>คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {agentDomains.map((domain, i) => (
              <ScrollReveal key={i} direction="up" delay={0.05 * i}>
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#dde5e2] shadow-2xs hover:border-[#216e63]/30 transition-all">
                  <span className="text-xs font-mono font-black text-[#216e63] px-2 py-1 rounded-lg bg-[#e5f4f0]">
                    {domain.id}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#17211f] leading-snug">
                      {domain.title}
                    </div>
                    <div className="text-[11px] text-[#4a5855] leading-relaxed mt-1">
                      {domain.desc}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Supervisor Flow Summary Strip */}
          <div className="mt-8 p-4 rounded-2xl bg-[#e5f4f0] border border-[#216e63]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#174e47] font-mono">
            <div className="flex items-center gap-2 font-bold">
              <Activity className="w-4 h-4 text-[#216e63]" />
              <span>ลำดับการทำงาน: อ่านข้อมูล → ตรวจกฎความปลอดภัย → สรุปผลเข้าใจง่าย</span>
            </div>
            <span className="font-semibold text-[11px]">YaCheck Supervisor Core v1.0</span>
          </div>
        </div>

      </div>
    </section>
  )
}
