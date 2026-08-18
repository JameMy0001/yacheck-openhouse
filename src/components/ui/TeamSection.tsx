import { ScrollReveal } from './ScrollReveal'

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
    </section>
  )
}
