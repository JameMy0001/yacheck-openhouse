import { ScrollReveal } from './ScrollReveal'
import { Trophy } from 'lucide-react'

export function TeamSection() {
  const team = [
    {
      nameTH: 'ธนเดช ชูระบำ',
      nameEN: 'Thanadet Churabum',
      nickname: 'Jame',
    },
    {
      nameTH: 'นาวิน สุธรรมชัย',
      nameEN: 'Navin Sutramchai',
      nickname: 'Boom',
    },
    {
      nameTH: 'ธณเมธาวัฒน์ ศรีพิทักษ์',
      nameEN: 'Thanamethawat Sripitak',
      nickname: 'Meth',
    },
    {
      nameTH: 'ภูตะวัน รุ่งเจริญกุล',
      nameEN: 'Photawan Roungcharoenkul',
      nickname: 'Phill',
    },
  ]

  return (
    <section id="team" className="relative w-full bg-white py-32 px-8 sm:px-14 lg:px-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Column: Project & University Info */}
        <div className="flex-1">
          <ScrollReveal direction="up" distance={20}>
            <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#216e63] uppercase mb-4">
              Project Development Team
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#17211f] mb-8 font-prompt">
              YaCheck.
            </h2>
            <div className="w-12 h-1 bg-[#00F2FE] mb-8" />
            <div className="flex flex-col gap-2 text-sm text-[#4a5855] leading-relaxed">
              <p className="font-bold text-[#17211f]">คณะวิศวกรรมศาสตร์</p>
              <p>สาขาวิชาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล</p>
              <p className="font-semibold mt-2">มหาวิทยาลัยกรุงเทพ</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">
                School of Engineering<br/>
                Artificial Intelligence Engineering and Data Science<br/>
                Bangkok University
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Members & Advisor */}
        <div className="flex-[1.5] flex flex-col gap-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {team.map((member, i) => (
              <ScrollReveal key={i} direction="up" distance={20} delay={0.1 * i} className="group cursor-default">
                <div className="flex flex-col border-l-2 border-gray-100 pl-6 py-2 group-hover:border-[#00F2FE] transition-colors duration-500">
                  <div className="text-[#216e63] font-bold text-lg mb-1 group-hover:text-[#00F2FE] transition-colors duration-300 font-prompt">
                    {member.nameTH}
                    <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {member.nickname}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono tracking-widest uppercase">
                    {member.nameEN}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" distance={20} delay={0.4} className="group cursor-default mt-4 border-t border-gray-100 pt-8">
            <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#f2a65a] uppercase mb-4">
              Project Advisor
            </div>
            <div className="flex flex-col border-l-2 border-[#f2a65a]/30 pl-6 py-2 group-hover:border-[#f2a65a] transition-colors duration-500">
              <div className="text-[#17211f] font-bold text-lg mb-1 font-prompt">
                ดร.ศุภรัตน์ แย้มครวญ
              </div>
              <div className="text-xs text-gray-400 font-mono tracking-widest uppercase">
                Dr. Suparat Yeamkuan
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* AWARDS & ACHIEVEMENTS */}
      <div className="max-w-6xl mx-auto mt-24">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#17211f] to-[#0f1514] p-8 md:p-12 border border-[#216e63]/30 shadow-2xl">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#f2a65a] rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#216e63] rounded-full blur-[100px] opacity-20 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#f2a65a] font-mono font-bold text-[10px] tracking-widest uppercase">
                  <Trophy className="w-3.5 h-3.5" />
                  Asian Regional Achievement - Top 100
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white font-prompt leading-tight">
                  Google Cloud Gen AI Academy
                  <span className="block text-lg text-[#00F2FE] mt-1 font-mono">APAC Edition (Cohort 2)</span>
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light mt-1">
                  ผลงาน <span className="text-white font-medium">YaCheck</span> ในนามทีม <span className="text-[#f2a65a] font-bold">"Pioneer New Gen"</span> ประสบความสำเร็จในการผ่านเข้ารอบและคว้า <span className="text-white font-medium">อันดับที่ 90 จาก 100 ทีมสุดท้ายระดับภูมิภาคเอเชียแปซิฟิก</span> ในโครงการ Google Cloud Gen AI Academy (Unified Data Analytics & Intelligence)
                </p>
              </div>

              {/* Certificate Image Placeholder */}
              <div className="flex-[1.2] w-full flex justify-end">
                <a 
                  href="https://docs.google.com/document/d/e/2PACX-1vRlhStD7PZaXV5-XUiBVvZvVeqOM_ry93YFu1j7tm6r1RX4e6Mq3mAoypdxg6NL0LQlWem_kz_b0hAs/pub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Fallback for some mobile webviews
                    e.stopPropagation();
                  }}
                  className="block w-full max-w-[500px] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 group hover:border-[#f2a65a]/50 transition-colors shadow-inner overflow-hidden relative cursor-pointer z-50 pointer-events-auto"
                >
                  <div className="w-full flex items-center justify-center">
                    <img 
                      src="/images/award-genai.png" 
                      alt="Google Cloud Gen AI Academy APAC Edition" 
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                      <span className="text-xs text-white font-mono font-medium flex items-center gap-2">
                        View Announcement ↗
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
