import { useState, useEffect, useRef } from 'react'
import { Mic, Send, Sparkles, User, ShieldCheck, ChevronLeft, MoreHorizontal, Activity } from 'lucide-react'

export function AgentPhoneMockup() {
  const [chatState, setChatState] = useState<'idle' | 'typing' | 'replied'>('idle')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  const handleAsk = () => {
    if (chatState !== 'idle') return
    
    setChatState('typing')
    setTimeout(() => {
      setChatState('replied')
    }, 2000)
  }

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatState])

  return (
    <div className="relative w-full max-w-[375px] mx-auto perspective-1000">
      {/* 
        Phone Frame (Using the exact prompt shadows for realistic bevels)
        Dimensions: 375x780, border-radius: 52px
      */}
      <div 
        className="relative mx-auto bg-white overflow-hidden"
        style={{
          width: '375px',
          height: '780px',
          borderRadius: '52px',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 10px #1a1a1e, 0 0 0 11px rgba(255,255,255,0.06), 0 30px 60px rgba(0,0,0,0.4)',
          transform: 'rotateX(5deg) rotateY(-10deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 flex items-center justify-between px-3">
          {/* Fake camera lens */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222] opacity-80 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"></div>
          {/* Fake sensor */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#111] opacity-50"></div>
        </div>

        {/* --- YaCheck Real App UI --- */}
        <div className="absolute inset-0 bg-[#f6f8f7] flex flex-col font-prompt">
          
          {/* Header */}
          <div className="pt-14 pb-4 px-6 bg-white border-b border-[#dde5e2] flex items-center justify-between z-40 shadow-sm">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f6f8f7] text-[#216e63]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#17211f] text-base leading-none">YaCheck AI</span>
              <span className="text-[10px] text-[#067647] font-mono flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3" />
                Medical Grade
              </span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-[#4a5855]">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 scroll-smooth">
            
            {/* AI Greeting */}
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[#216e63] flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-[#dde5e2] p-3.5 rounded-2xl rounded-bl-sm text-sm text-[#4a5855] leading-relaxed shadow-sm">
                สวัสดีค่ะคุณเจมส์ 👋<br/>
                วันนี้มีอาการปวดหัว ไม่สบายตรงไหน หรืออยากให้ช่วยเช็กยาตัวไหนคะ?
              </div>
            </div>

            {/* User Message (Appears when clicked) */}
            {chatState !== 'idle' && (
              <div className="flex items-end gap-2 max-w-[85%] self-end flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-[#f2a65a] flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#216e63] text-white p-3.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-md">
                  วันนี้ปวดหัวจังกินยาอะไรดี
                </div>
              </div>
            )}

            {/* AI Typing Indicator */}
            {chatState === 'typing' && (
              <div className="flex items-end gap-2 max-w-[85%] animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-[#216e63] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[#dde5e2] p-4 rounded-2xl rounded-bl-sm flex gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#216e63]/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#216e63]/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#216e63] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {/* AI Reply */}
            {chatState === 'replied' && (
              <div className="flex items-end gap-2 max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="w-8 h-8 rounded-full bg-[#216e63] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-[#dde5e2] p-3.5 rounded-2xl rounded-bl-sm text-sm text-[#4a5855] leading-relaxed shadow-sm">
                    เบื้องต้นแนะนำให้ทานยา <strong className="text-[#216e63]">พาราเซตามอล (Paracetamol) 500mg</strong> จำนวน 1 เม็ด ทุกๆ 4-6 ชั่วโมงค่ะ 💊
                  </div>
                  
                  {/* Warning Card inside chat */}
                  <div className="bg-[#fff1f2] border border-[#ffe4e6] p-3 rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 mb-1 text-[#b42318] text-xs font-bold">
                      <Activity className="w-3.5 h-3.5" />
                      ระบบคัดกรองความปลอดภัย
                    </div>
                    <div className="text-[11px] text-[#9f1239] leading-relaxed">
                      ตรวจสอบจากประวัติสุขภาพของคุณในระบบ ไม่พบโรคประจำตัวเกี่ยวกับตับ สามารถทานได้ปลอดภัยค่ะ แต่ถ้าทานแล้วอาการไม่ดีขึ้นภายใน 24 ชม. แนะนำให้พบแพทย์นะคะ
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-[#dde5e2] pb-8 z-40">
            {chatState === 'idle' ? (
              <button 
                onClick={handleAsk}
                className="w-full flex items-center justify-between bg-[#f6f8f7] border border-[#dde5e2] p-2 pl-4 rounded-full group hover:border-[#216e63]/40 transition-colors"
              >
                <span className="text-[#64716e] text-sm">วันนี้ปวดหัวจังกินยาอะไรดี...</span>
                <div className="w-9 h-9 rounded-full bg-[#216e63] flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                  <Send className="w-4 h-4 ml-0.5" />
                </div>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-[#f6f8f7] border border-[#dde5e2] p-2 pl-4 rounded-full opacity-50 cursor-not-allowed">
                <span className="text-[#64716e] text-sm">กำลังประมวลผล...</span>
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  <Mic className="w-4 h-4" />
                </div>
              </div>
            )}
            
            {/* iOS Home Indicator */}
            <div className="w-[120px] h-[5px] bg-gray-300 rounded-full mx-auto mt-5"></div>
          </div>

        </div>
      </div>
    </div>
  )
}
