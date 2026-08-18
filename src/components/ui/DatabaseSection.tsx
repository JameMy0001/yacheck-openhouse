import { Database, ShieldAlert, Utensils, Award, Check, ExternalLink, ShieldCheck, Layers } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal.tsx'

export function DatabaseSection() {
  const metricCards = [
    {
      title: 'คลังยากลางในระบบ',
      subtitle: 'Clinical Catalogue',
      value: '317',
      status: 'เชื่อมต่อฐานข้อมูลจริง v7',
      statusColor: 'text-[#067647]',
      dotColor: 'bg-[#067647]',
      badgeBg: 'bg-[#d1fadf]',
      icon: Database,
    },
    {
      title: 'คู่ยาที่ต้องระวัง',
      subtitle: 'Drug Interactions',
      value: '117',
      status: 'คัดกรอง 2 ระดับความรุนแรง',
      statusColor: 'text-[#d97706]',
      dotColor: 'bg-[#f2a65a]',
      badgeBg: 'bg-[#fef3c7]',
      icon: ShieldAlert,
    },
    {
      title: 'อาหารและสมุนไพร',
      subtitle: 'Food & Herbal Risks',
      value: '23',
      status: 'ครอบคลุมของกินใกล้ตัว',
      statusColor: 'text-[#216e63]',
      dotColor: 'bg-[#216e63]',
      badgeBg: 'bg-[#e5f4f0]',
      icon: Utensils,
    },
    {
      title: 'สถานะการตรวจทาน',
      subtitle: 'Verification Status',
      value: '100%',
      status: 'ผ่านการรับรองครบทุกรายการ',
      statusColor: 'text-[#067647]',
      dotColor: 'bg-[#067647]',
      badgeBg: 'bg-[#d1fadf]',
      icon: Award,
    },
  ]

  const interactionSamples = [
    {
      drugA: 'ฟลูวอกซามีน (Fluvoxamine)',
      drugB: 'ทิซานิดีน (Tizanidine)',
      severity: 'รุนแรง — ห้ามกินคู่กันเด็ดขาด',
      severityColor: 'text-[#b42318] bg-[#fee4e2] border-[#b42318]/30',
      action: 'ห้ามรับประทานร่วมกัน เพราะอาจทำให้ความดันโลหิตตกอย่างรวดเร็วและง่วงซึมรุนแรง ให้รีบปรึกษาแพทย์',
      sources: ['DailyMed - NIH/NLM', 'accessdata.fda.gov', 'pubmed.ncbi.nlm.nih.gov'],
    },
    {
      drugA: 'เฟอร์รัสซัลเฟต (ธาตุเหล็ก)',
      drugB: 'เลโวไทรอกซิน (ยาไทรอยด์)',
      severity: 'เฝ้าระวัง — ต้องเว้นระยะเวลา',
      severityColor: 'text-[#d97706] bg-[#fef3c7] border-[#f2a65a]/40',
      action: 'ธาตุเหล็กจะไปขัดขวางการดูดซึมยาไทรอยด์ ทำให้ยาไม่ได้ผล ควรเว้นระยะเวลาทานห่างกันอย่างน้อย 4 ชั่วโมง',
      sources: ['DailyMed - NIH/NLM', 'accessdata.fda.gov', 'pubmed.ncbi.nlm.nih.gov'],
    },
    {
      drugA: 'คลาริโทรไมซิน (ยาฆ่าเชื้อ)',
      drugB: 'ดิจอกซิน (ยาโรคหัวใจ)',
      severity: 'เฝ้าระวัง — ติดตามอาการใกล้ชิด',
      severityColor: 'text-[#d97706] bg-[#fef3c7] border-[#f2a65a]/40',
      action: 'ยาฆ่าเชื้ออาจทำให้ระดับยาดิจอกซินในกระแสเลือดสูงขึ้น เสี่ยงหัวใจเต้นผิดจังหวะ ต้องให้แพทย์ช่วยดูแล',
      sources: ['DailyMed - NIH/NLM', 'accessdata.fda.gov'],
    },
  ]

  const foodHerbalSamples = [
    { name: 'ฟ้าทะลายโจร (Andrographis)', code: 'H_ANDROGRAPHIS_001', note: 'ระวังหากกินคู่กับยาลดความดัน เพราะอาจเสริมฤทธิ์จนความดันต่ำเกินไป' },
    { name: 'ใบแปะก๊วย (Ginkgo Biloba)', code: 'H_GINKGO_001', note: 'เสริมฤทธิ์ยาละลายลิ่มเลือด อาจทำให้มีเลือดออกง่ายหรือหยุดยาก' },
    { name: 'น้ำเกรปฟรุต (Grapefruit)', code: 'F_GRAPEFRUIT_001', note: 'ขัดขวางการย่อยสลายยาลดไขมัน ทำให้ตัวยาค้างในเลือดสูงเกินมาตรฐาน' },
    { name: 'นมและผลิตภัณฑ์แคลเซียม', code: 'F_DAIRY_001', note: 'แคลเซียมจะไปจับตัวกับยาฆ่าเชื้อบางกลุ่ม ทำให้ร่างกายดูดซึมยาได้น้อยลง' },
  ]

  const authoritySources = [
    { name: 'US FDA Structured Product Labels', domain: 'accessdata.fda.gov', desc: 'เอกสารกำกับยาและข้อกำหนดความปลอดภัยมาตรฐานองค์การอาหารและยาสหรัฐฯ' },
    { name: 'DailyMed / National Library of Medicine', domain: 'dailymed.nlm.nih.gov', desc: 'คลังข้อมูลฉลากยาและเอกสารทางการแพทย์แห่งชาติ' },
    { name: 'RxNorm Drug Vocabulary Standards', domain: 'rxnorm.nlm.nih.gov', desc: 'รหัสมาตรฐานยาเพื่อการแลกเปลี่ยนข้อมูลอย่างแม่นยำ' },
    { name: 'PubMed / NCBI Peer-Reviewed Evidence', domain: 'pubmed.ncbi.nlm.nih.gov', desc: 'งานวิจัยทางคลินิกและรายงานการเฝ้าระวังความปลอดภัยของยา' },
  ]

  return (
    <section
      id="database"
      className="relative w-full select-none pointer-events-none py-28 sm:py-36"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col pointer-events-auto px-6 sm:px-12 lg:px-16">

        {/* Section Header — Clean Typography */}
        <div className="flex flex-col items-start max-w-2xl mb-16 sm:mb-20">
          <ScrollReveal direction="left" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#216e63]/25 bg-[#e5f4f0] text-[#216e63] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[#216e63]" />
              <span>Verified Clinical Evidence</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.12}>
            <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
              Clinical Database<span className="text-[#f2a65a]">.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.18}>
            <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#216e63] leading-snug mb-4">
              คลังข้อมูลยา & คู่ยาตีกันมาตรฐานสากล
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.25}>
            <p className="text-sm sm:text-base text-[#4a5855] font-normal leading-relaxed max-w-xl">
              เชื่อมต่อกับฐานข้อมูลยากลางเวอร์ชัน <strong className="text-[#17211f] font-bold">v7 บน Supabase</strong> ที่ทีมงานกลั่นกรองและอ้างอิงจากงานวิจัยและเอกสารกำกับยาระดับสากล 100%
            </p>
          </ScrollReveal>
        </div>

        {/* 4 Real Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
          {metricCards.map((card, i) => {
            const Icon = card.icon
            return (
              <ScrollReveal key={i} direction="up" delay={0.08 * i}>
                <div className="p-6 rounded-3xl border border-[#dde5e2] bg-white/95 shadow-sm hover:shadow-md hover:border-[#216e63]/30 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-[#4a5855] uppercase tracking-wider">
                        {card.subtitle}
                      </span>
                      <div className="p-2 rounded-xl bg-[#f6f8f7] text-[#216e63] border border-[#dde5e2]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-[#17211f] font-mono tracking-tight mb-1">
                      {card.value}
                    </div>
                    <div className="text-sm font-bold text-[#17211f] mb-3 leading-snug">
                      {card.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#dde5e2]/70 text-[11px] font-mono font-bold">
                    <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                    <span className={card.statusColor}>{card.status}</span>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Real Drug-Drug Interaction Matrix Preview */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#dde5e2] bg-white shadow-md mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3 border-b border-[#dde5e2] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#b42318] uppercase tracking-widest mb-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>117 คู่ยาอันตรายที่ผ่านการตรวจสอบ</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#17211f] tracking-tight leading-snug">
                ตัวอย่างคู่ยาตีกันในฐานข้อมูล
              </h3>
            </div>
            <span className="text-xs font-mono text-[#067647] font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>อ้างอิงจาก FDA Label & PubMed</span>
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {interactionSamples.map((item, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.08 * idx}>
                <div className="p-5 sm:p-6 rounded-2xl border border-[#dde5e2] bg-[#f6f8f7] hover:border-[#216e63]/40 transition-all flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-black text-[#17211f] leading-snug">
                      <span>{item.drugA}</span>
                      <span className="text-[#f2a65a] font-mono font-normal">↔</span>
                      <span>{item.drugB}</span>
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${item.severityColor} self-start sm:self-auto`}>
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#33413e] font-normal leading-relaxed">
                    {item.action}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#dde5e2]/60 text-[10px] font-mono text-[#64716e]">
                    <span className="font-bold text-[#17211f]">หลักฐานอ้างอิง:</span>
                    {item.sources.map((src, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white border border-[#dde5e2] text-[#216e63] font-medium">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Food & Herbal Interactions Grid */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#dde5e2] bg-[#f6f8f7]/90 shadow-sm mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#216e63] uppercase tracking-widest mb-2">
            <Utensils className="w-4 h-4" />
            <span>23 รายการอาหารและสมุนไพร</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#17211f] tracking-tight mb-6 leading-snug">
            ของกินใกล้ตัว ที่อาจรบกวนฤทธิ์ยา
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodHerbalSamples.map((food, fIdx) => (
              <ScrollReveal key={fIdx} direction="up" delay={0.06 * fIdx}>
                <div className="p-5 rounded-2xl bg-white border border-[#dde5e2] shadow-2xs hover:border-[#216e63]/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#17211f] leading-snug">{food.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#e5f4f0] text-[#216e63]">
                      {food.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a5855] leading-relaxed">
                    {food.note}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Authoritative Medical Sources Strip */}
        <div className="p-8 sm:p-10 rounded-3xl border border-[#dde5e2] bg-white shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#216e63] uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>International Medical Standards</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-[#17211f] leading-snug">
              แหล่งอ้างอิงทางการแพทย์ระดับสากล
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {authoritySources.map((auth, aIdx) => (
              <div key={aIdx} className="p-4 rounded-2xl bg-[#f6f8f7] border border-[#dde5e2] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#216e63] mb-1">
                    <span>{auth.domain}</span>
                    <ExternalLink className="w-3 h-3 text-[#64716e]" />
                  </div>
                  <div className="text-xs font-bold text-[#17211f] mb-1.5 leading-snug">
                    {auth.name}
                  </div>
                  <div className="text-[11px] text-[#4a5855] leading-relaxed">
                    {auth.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
