import { Suspense } from 'react'
import { Scene } from './components/3d/Scene.tsx'
import { Navigation } from './components/ui/Navigation.tsx'
import { DynamicBackground } from './components/ui/DynamicBackground.tsx'
import { LoadingScreen } from './components/ui/LoadingScreen.tsx'
import { HeroSection } from './components/ui/HeroSection.tsx'
import { ProblemSection } from './components/ui/ProblemSection.tsx'
import { FeaturesSection } from './components/ui/FeaturesSection.tsx'
import { SpecsSection } from './components/ui/SpecsSection.tsx'
import { CTASection } from './components/ui/CTASection.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { useScrollytelling } from './hooks/useScrollytelling.ts'

export default function App() {
  const {
    scrollProgress,
    dangerMix,
    explode,
    cameraZ,
    cameraY,
    currentSection,
    scrollToSection,
  } = useScrollytelling('#scroll-container')

  return (
    <ErrorBoundary>
      {/* Splash loading animation — renders on top of everything, unmounts after ~3s */}
      <LoadingScreen />

      <div
        id="scroll-container"
        className="relative w-full min-h-screen bg-[#f6f8f7] text-[#17211f] selection:bg-[#216e63]/20 selection:text-[#17211f] overflow-x-hidden"
      >
        {/* Dynamic Background — GSAP-driven, no React scroll re-renders */}
        <DynamicBackground />

        {/* Floating Glassmorphism Navbar */}
        <Navigation
          currentSection={currentSection}
          onNavigate={scrollToSection}
        />

        {/* Fixed 3D WebGL Canvas Layer */}
        <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
          <Suspense fallback={null}>
            <Scene
              scrollProgress={scrollProgress}
              dangerMix={dangerMix}
              explodeProgress={explode}
              cameraZ={cameraZ}
              cameraY={cameraY}
              isExploded={explode > 0.5}
            />
          </Suspense>
        </div>

        {/* 5-Scene Scrollytelling HTML Overlay */}
        <main className="relative z-10 w-full pointer-events-none">
          <HeroSection onExploreClick={() => scrollToSection('problem')} />
          <ProblemSection />
          <FeaturesSection />
          <SpecsSection />
          <CTASection />
        </main>
      </div>
    </ErrorBoundary>
  )
}
