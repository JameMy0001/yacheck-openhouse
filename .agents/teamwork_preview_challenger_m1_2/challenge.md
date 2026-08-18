# Empirical Adversarial Challenge Report — M1.2 GSAP Scrollytelling & UI Integration

**Verdict**: **REQUEST_CHANGES**  
**Overall Risk Assessment**: **MEDIUM-HIGH** (Critical CSS root layout constraint blocking native scrolling; 3D scenes, shaders, and UI overlay are otherwise fully functioning and robust)

---

## Challenge Summary

The M1.2 implementation provides a visually stunning React Three Fiber procedural 3D scene (dual-shell refraction capsule, GLSL simplex noise shader material, 1800-node particle field, post-processing bloom/chromatic aberration) and 5 distinct full-height UI overlay sections with clean glassmorphic styling and pointer-events isolation.

However, during empirical stress testing with headless Google Chrome and Chrome DevTools Protocol (CDP), an **adversarial layout failure mode** was uncovered:
In `src/index.css`, `html, body` and `#root` are styled with `height: 100%`. This locks `document.documentElement` (`HTML`) to a fixed viewport height (`1080px`), while child sections overflow. Because the document scrolling element is constrained to 100vh (`scrollHeight: 1080px`), standard mouse wheel, touch gestures, and keyboard navigation fail to scroll the window (`window.scrollY` remains 0). Consequently, GSAP ScrollTrigger remains at progress 0 unless this CSS rule is adjusted to `min-height: 100%` / `height: auto`.

Once this single CSS adjustment is made, empirical tests confirm that GSAP scrubbing smoothly drives all 3D scene properties across all 5 sections at 60+ FPS.

---

## Challenges & Stress Test Findings

### [High] Challenge 1: `html, body, #root { height: 100% }` Prevents Document Window Scroll Progression

- **Assumption Challenged**: That setting `height: 100%` on `html, body` and `#root` supports full-document GSAP ScrollTrigger window scrubbing across 5 full-height sections.
- **Empirical Attack Scenario**:
  1. Launched production build via `vite preview` on `http://127.0.0.1:4173/`.
  2. Attached Headless Google Chrome at 1920x1080 viewport.
  3. Synthesized mouse wheel / scroll gestures (`Input.synthesizeScrollGesture`).
  4. Observed DOM metrics:
     - `docElHeight`: `1080px`
     - `docElScrollHeight`: `1080px` (locked to 100vh)
     - `bodyScrollHeight`: `5400px`
     - `window.scrollY`: `0` (did not advance)
     - `ScrollTrigger.progress`: `0` (did not advance)
- **Blast Radius**: End users cannot scroll down the promotional page using mouse wheel or touch; the 3D scene stays in Section 1 (Hero).
- **Remediation**:
  In `src/index.css`, update:
  ```css
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%; /* Change from height: 100% to min-height: 100% */
    overflow-x: hidden;
    background-color: #050505;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  #root {
    width: 100%;
    min-height: 100%; /* Change from height: 100% to min-height: 100% */
  }
  ```
  Empirical verification showed that with this change, `docElScrollHeight` expands to `5400px`, `window.scrollY` advances smoothly from 0 to 4320px, and all sections scroll perfectly into view.

---

## Stress Test Results Matrix

| Scenario / Test Case | Target / Expected Behavior | Actual Empirical Result | Status |
|---|---|---|---|
| **Compilation (`npm run build`)** | Clean build with zero TypeScript errors | Vite 8 + TS clean compile (584 modules, 0 errors) | **PASS** |
| **E2E Suite (`npm run test:e2e`)** | 16/16 tests pass across Tiers 1-4 | 16/16 tests pass (100% coverage) | **PASS** |
| **5 UI Sections Rendering** | 5 distinct `<section>` elements (Hero, Problem, Features, Specs, CTA) with >= 500px clientHeight | All 5 sections found in DOM, each exactly 1080px height | **PASS** |
| **Pointer-Events Hierarchy** | Overlay `<main>` has `pointer-events: none`; glass cards & buttons have `pointer-events: auto` | `main`: `none`, `#cta button`: `auto`, `#problem card`: `auto`. Button click triggered successfully | **PASS** |
| **3D Scene Property Modulation** | At least 3 scene properties driven across scroll | 5 properties verified: (1) Capsule explode distance, (2) Danger color lerp, (3) GLSL shader uniforms, (4) Particle field color morph, (5) Post-processing Bloom & Chromatic Aberration | **PASS** |
| **Viewport Resize Resilience** | Survives 4K, Mobile, Tablet, Extreme Wide (2560x400), Extreme Tall (400x2560), Tiny Box (100x100), Zero/Near-Zero Height (800x1) | All 8 resize configurations handled without WebGL errors or divide-by-zero crashes | **PASS** |
| **Continuous Resize Spam** | 30 random window resizes in 450ms during animation | Zero WebGL context loss, zero console errors | **PASS** |
| **Render Performance (FPS)** | Stable 60 FPS animation loop | Measured **61 FPS** average (61 frames in 1002ms) | **PASS** |
| **Native Window Scroll Progression** | Document scrolling element (`HTML`) expands to 5400px to allow mousewheel/touch scroll | `scrollHeight` locked at 1080px due to `height: 100%` in `index.css` | **FAIL (Fix: `min-height: 100%`)** |

---

## Unchallenged Areas

- **Real Mobile Physical Touch Accelerometer / Gyroscope**: Tested in mobile viewport simulation; hardware gyro is outside headless scope.
- **Audio synthesis / sound effects**: No audio dependencies required by current milestone prompt.
