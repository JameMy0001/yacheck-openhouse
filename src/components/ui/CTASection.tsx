import { useState } from 'react'
import { QrCode, Download, Apple, Smartphone, MapPin, Sparkles, Check, Heart } from 'lucide-react'

export function CTASection() {
  const [downloadClicked, setDownloadClicked] = useState(false)

  const handleDownload = () => {
    setDownloadClicked(true)
    setTimeout(() => setDownloadClicked(false), 3000)
  }

  return (
    <section
      id="cta"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 text-center select-none"
    >
      <div className="pointer-events-auto max-w-4xl w-full flex flex-col items-center p-8 sm:p-14 rounded-3xl border border-[#dde5e2] bg-white/90 shadow-xl transition-all">
        
        {/* Event Header Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#216e63]/30 bg-[#e5f4f0] text-[#216e63] text-xs font-mono font-bold tracking-wider uppercase mb-6 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#216e63]" />
          <span>OpenHouse 2026 Showcase • บูธ YaCheck</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#17211f] mb-4 leading-tight">
          สัมผัสประสบการณ์ <br />
          <span className="text-[#216e63]">YaCheck</span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-[#33413e] max-w-2xl mb-8 font-normal leading-relaxed">
          พบกับพวกเราและทดลองใช้ระบบ AI ตรวจสอบยาจริงได้ที่บูธ <strong className="text-[#216e63] font-bold">YaCheck</strong> โซน Health Tech Innovation หรือสแกน QR Code เพื่อติดตั้งเวอร์ชันทดสอบบนมือถือ
        </p>

        {/* QR Code & Action Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-xl my-4">
          
          {/* QR Code Card */}
          <div className="relative group p-4 rounded-2xl border border-[#dde5e2] bg-[#f6f8f7] shadow-sm flex flex-col items-center">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl bg-white p-2.5 flex items-center justify-center relative overflow-hidden shadow-inner border border-[#dde5e2]">
              <QrCode className="w-full h-full text-[#17211f]" />
            </div>

            <span className="text-xs font-mono font-bold text-[#216e63] mt-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#f2a65a]" />
              สแกนทดลองใช้งานทันที
            </span>
          </div>

          {/* Download Buttons Column */}
          <div className="flex flex-col gap-3 w-full sm:w-72">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full px-6 py-4 rounded-2xl bg-[#216e63] hover:bg-[#174e47] text-white font-bold text-base shadow-md shadow-[#216e63]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {downloadClicked ? (
                <>
                  <Check className="w-5 h-5 text-[#d1fadf]" />
                  <span>กำลังดาวน์โหลด...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-white" />
                  <span>ดาวน์โหลดแอป YaCheck</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full px-5 py-3 rounded-2xl border border-[#dde5e2] bg-white hover:bg-[#f6f8f7] hover:border-[#216e63]/30 text-[#17211f] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Apple className="w-4 h-4 text-[#17211f]" />
              <span>Download for iOS (TestFlight)</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full px-5 py-3 rounded-2xl border border-[#dde5e2] bg-white hover:bg-[#f6f8f7] hover:border-[#067647]/30 text-[#17211f] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-[#067647]" />
              <span>Download for Android (APK)</span>
            </button>
          </div>

        </div>

        {/* OpenHouse Innovation Details */}
        <div className="mt-8 pt-6 border-t border-[#dde5e2] w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#4a5855] font-mono gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#067647] animate-ping" />
            <span className="font-bold text-[#067647]">YaCheck Booth • Health Tech Innovation</span>
          </div>
          <div className="font-medium">Faculty of Computer Science & Medicine</div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-[#4a5855] font-mono flex items-center justify-center gap-2 pointer-events-auto">
        <span>© 2026 YaCheck Health Systems. Built with</span>
        <Heart className="w-3 h-3 text-[#b42318] inline fill-[#b42318]" />
        <span>for OpenHouse Innovation.</span>
      </footer>
    </section>
  )
}
