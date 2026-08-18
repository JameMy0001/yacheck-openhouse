import { Suspense, useState, useCallback } from 'react'
import { Scene } from './components/3d/Scene.tsx'
import { Navigation } from './components/ui/Navigation.tsx'
import { DynamicBackground } from './components/ui/DynamicBackground.tsx'
import { LoadingScreen } from './components/ui/LoadingScreen.tsx'
import { HeroSection } from './components/ui/HeroSection.tsx'
import { ProblemSection } from './components/ui/ProblemSection.tsx'
import { FeaturesSection } from './components/ui/FeaturesSection.tsx'
import { AgentSection } from './components/ui/AgentSection.tsx'
import { DatabaseSection } from './components/ui/DatabaseSection.tsx'
import { SpecsSection } from './components/ui/SpecsSection.tsx'
import { CTASection } from './components/ui/CTASection.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { useScrollytelling } from './hooks/useScrollytelling.ts'
import { ReadyContext } from './context/ReadyContext.tsx'

export default function App() {
  // isReady becomes true when LoadingScreen animation fully exits.
  // ScrollReveal listens via ReadyContext and only then creates ScrollTriggers.
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
      <ReadyContext.Provider value={isReady}>

        {/* Splash Loading Animation — blocks until all 3D & visual assets ready */}
        <LoadingScreen onComplete={handleLoadingComplete} />

        <div
          id="scroll-container"
          className="relative w-full min-h-screen bg-[#f6f8f7] text-[#17211f] selection:bg-[#216e63]/20 selection:text-[#17211f] overflow-x-hidden"
        >
          {/* Background — CSS orbs + dot grid (GSAP-driven, zero re-renders) */}
          <DynamicBackground />

          {/* Fixed 3D WebGL Canvas Layer — 3D Studio Capsule for ALL devices */}
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
              />
            </Suspense>
          </div>

          {/* Navigation */}
          <Navigation
            currentSection={currentSection}
            onNavigate={scrollToSection}
          />

          {/* 7-Scene Scrollytelling Content */}
          <main className="relative z-10 w-full pointer-events-none">
            <HeroSection onExploreClick={() => scrollToSection('problem')} />
            <ProblemSection />
            <FeaturesSection />
            <AgentSection />
            <DatabaseSection />
            <SpecsSection />
            <CTASection />
          </main>
        </div>

      </ReadyContext.Provider>
    </ErrorBoundary>
  )
}
