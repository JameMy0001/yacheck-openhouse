import { useState } from 'react'
import { MapPin, Sparkles, Check, Heart, Smartphone, Wrench } from 'lucide-react'

export function CTASection() {
  const [downloadStarted, setDownloadStarted] = useState(false)

  const APK_URL = 'https://drive.google.com/file/d/1z0clSsGNCBE8f9T7MEvF8SvpycJzRvOM/view?usp=sharing'

  const handleAndroidDownload = () => {
    setDownloadStarted(true)
    window.open(APK_URL, '_blank')
    setTimeout(() => setDownloadStarted(false), 4000)
  }

  return (
    <section
      id="cta"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 text-center select-none"
    >
      <div className="pointer-events-auto max-w-4xl w-full flex flex-col items-center p-8 sm:p-14 rounded-3xl border border-[#dde5e2] bg-white/90 shadow-xl transition-all">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#216e63]/30 bg-[#e5f4f0] text-[#216e63] text-xs font-mono font-bold tracking-wider uppercase mb-6 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#216e63]" />
          <span>OpenHouse 2026 • บูธ YaCheck</span>
        </div>

        <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-black tracking-tight text-[#17211f] leading-none mb-3">
          Get Started<span className="text-[#216e63]">.</span>
        </h2>
        <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-[#216e63] leading-snug mb-5">
          ให้ทุกมื้อยาของครอบครัว ปลอดภัยตั้งแต่วันนี้
        </p>

        <p className="text-sm sm:text-base md:text-lg text-[#4a5855] max-w-2xl mb-8 font-normal leading-relaxed">
          ดาวน์โหลดแอป <strong className="text-[#216e63] font-bold">YaCheck</strong> เวอร์ชันทดสอบสำหรับ Android ไปลองใช้งาน หรือแวะมาพบกับพวกเราเพื่อทดลองระบบจริงได้ที่บูธโซน Health Tech Innovation
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-2xl my-4">
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-3 border-2 border-[#dde5e2] shadow-md overflow-hidden">
              <img
                src="/qr-android.png"
                alt="QR Code ดาวน์โหลด YaCheck APK"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#216e63] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f2a65a]" />
              สแกน QR เพื่อดาวน์โหลด APK
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-72">
            <button
              type="button"
              onClick={handleAndroidDownload}
              className="w-full px-6 py-4 rounded-2xl bg-[#216e63] hover:bg-[#174e47] text-white font-bold text-base shadow-md shadow-[#216e63]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              {downloadStarted ? (
                <>
                  <Check className="w-5 h-5 text-[#d1fadf]" />
                  <span>กำลังเปิดหน้าดาวน์โหลด...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 text-white" />
                  <span>ดาวน์โหลดสำหรับ Android (APK)</span>
                </>
              )}
            </button>

            <div className="w-full px-5 py-3.5 rounded-2xl border border-[#dde5e2] bg-[#f6f8f7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[#64716e]">
                <Wrench className="w-4 h-4 text-[#f2a65a] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-[#33413e]">iOS (TestFlight)</div>
                  <div className="text-[10px] font-mono text-[#64716e]">อยู่ระหว่างพัฒนา — เร็วๆ นี้</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-[#f2a65a]/30 text-[#d97706] flex-shrink-0">
                WIP
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-[#64716e] mt-2">
          ไฟล์ติดตั้ง APK · ขนาด 132 MB · เปิดการอนุญาต "ติดตั้งแอปจากแหล่งที่ไม่รู้จัก" บนมือถือ
        </p>

        <div className="mt-8 pt-6 border-t border-[#dde5e2] w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#4a5855] font-mono gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#067647] animate-ping" />
            <span className="font-bold text-[#067647]">YaCheck Booth • Health Tech Innovation</span>
          </div>
          <div className="font-medium">Faculty of Computer Science & Medicine</div>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-[#4a5855] font-mono flex items-center justify-center gap-2 pointer-events-auto">
        <span>© 2026 YaCheck Health Systems. พัฒนาด้วย</span>
        <Heart className="w-3 h-3 text-[#b42318] inline fill-[#b42318]" />
        <span>เพื่อสุขภาพของทุกคนในบ้าน</span>
      </footer>
    </section>
  )
}
