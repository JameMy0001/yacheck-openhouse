import { Suspense, useState, useCallback, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Scene } from './components/3d/Scene'
import { Navigation } from './components/ui/Navigation'
import { DynamicBackground } from './components/ui/DynamicBackground'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { HeroSection } from './components/ui/HeroSection'
import { ProblemSection } from './components/ui/ProblemSection'
import { FeaturesSection } from './components/ui/FeaturesSection'
import { AgentSection } from './components/ui/AgentSection'
import { DatabaseSection } from './components/ui/DatabaseSection'
import { SpecsSection } from './components/ui/SpecsSection'
import { CTASection } from './components/ui/CTASection'
import { TeamSection } from './components/ui/TeamSection'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useScrollytelling } from './hooks/useScrollytelling'
import { useAutoLoop } from './hooks/useAutoLoop'
import { ReadyContext } from './context/ReadyContext'

function AutoLoopApp() {
  const {
    scrollProgress,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    capsuleScale,
    networkScale,
  } = useAutoLoop()

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#f6f8f7] to-[#e5f4f0] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-10 flex items-center justify-center gap-3 z-50">
        <div className="w-10 h-10 rounded-xl bg-[#216e63] flex items-center justify-center">
          <span className="text-white font-bold text-xl">Y</span>
        </div>
        <span className="text-2xl font-black tracking-tight text-[#17211f]">
          YaCheck<span className="text-[#216e63]">.</span>
        </span>
      </div>
      <div className="w-full h-full pointer-events-none">
        <Scene
          scrollProgress={scrollProgress}
          dangerMix={dangerMix}
          explodeProgress={explode}
          cameraZ={cameraZ}
          cameraY={cameraY}
          capsuleScale={capsuleScale}
          networkScale={networkScale}
          autoSpin={false}
        />
      </div>
      <div className="absolute bottom-10 text-[#216e63] font-mono text-sm tracking-widest font-bold">
        AI MEDICATION SAFETY
      </div>
    </div>
  )
}

function MainApp() {
  const [isReady, setIsReady] = useState(false)
  const handleLoadingComplete = useCallback(() => setIsReady(true), [])

  const {
    scrollProgress,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    capsuleScale,
    networkScale,
    currentSection,
    scrollToSection,
  } = useScrollytelling('#scroll-container')

  return (
    <ErrorBoundary>
      <Analytics />
      <ReadyContext.Provider value={isReady}>
        <LoadingScreen onComplete={handleLoadingComplete} />
        <div
          id="scroll-container"
          className="relative w-full min-h-screen bg-[#f6f8f7] text-[#17211f] selection:bg-[#216e63]/20 selection:text-[#17211f] overflow-x-hidden"
        >
          <DynamicBackground />
          <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
            <Suspense fallback={null}>
              <Scene
                scrollProgress={scrollProgress}
                dangerMix={dangerMix}
                explodeProgress={explode}
                cameraZ={cameraZ}
                cameraY={cameraY}
                capsuleScale={capsuleScale}
                networkScale={networkScale}
                isExploded={explode > 0.5}
                autoSpin={false}
              />
            </Suspense>
          </div>
          <Navigation
            currentSection={currentSection}
            onNavigate={scrollToSection}
          />
          <main className="relative z-10 w-full pointer-events-none">
            <HeroSection onExploreClick={() => scrollToSection('problem')} />
            <ProblemSection />
            <FeaturesSection />
            <AgentSection />
            <DatabaseSection />
            <SpecsSection />
            <CTASection />
            <div className="pointer-events-auto">
              <TeamSection />
            </div>
          </main>
        </div>
      </ReadyContext.Provider>
    </ErrorBoundary>
  )
}

export default function App() {
  const [isLoopMode, setIsLoopMode] = useState(false)
  const [modeChecked, setModeChecked] = useState(false)

  useEffect(() => {
    if (window.location.search.includes('loop=true')) {
      setIsLoopMode(true)
    }
    setModeChecked(true)
  }, [])

  if (!modeChecked) return null

  return isLoopMode ? <AutoLoopApp /> : <MainApp />
}
