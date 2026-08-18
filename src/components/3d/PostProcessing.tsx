import { useMemo } from 'react'
import * as THREE from 'three'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'

export interface PostProcessingProps {
  /** Bloom intensity scalar (default: 1.5) */
  bloomIntensity?: number
  /** Selective luminance threshold for bloom (default: 0.65) */
  bloomThreshold?: number
  /** Danger crisis mix factor [0..1] driving chromatic aberration expansion */
  dangerMix?: number
  /** Enable/disable postprocessing pipeline */
  enabled?: boolean
}

export function PostProcessing({
  bloomIntensity = 1.5,
  bloomThreshold = 0.65,
  dangerMix = 0.0,
  enabled = true,
}: PostProcessingProps) {
  // Compute dynamic chromatic aberration vector reacting to danger/error state unconditionally
  const aberrationOffset = useMemo(() => {
    const base = 0.0018
    const boost = dangerMix * 0.0035
    return new THREE.Vector2(base + boost, base + boost)
  }, [dangerMix])

  // Modulate bloom intensity during crisis alerts unconditionally
  const activeBloom = useMemo(() => {
    return bloomIntensity + dangerMix * 0.7
  }, [bloomIntensity, dangerMix])

  if (!enabled) return null

  return (
    <EffectComposer
      multisampling={4}
      enableNormalPass={false}
      stencilBuffer={false}
    >
      {/* 1. Selective HDR Bloom with progressive mipmap blur */}
      <Bloom
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.3}
        intensity={activeBloom}
        radius={0.75}
        mipmapBlur
      />

      {/* 2. Radial Chromatic Aberration (reactive to medication errors) */}
      <ChromaticAberration
        offset={aberrationOffset}
        {...({ radialModulation: true, modulationOffset: 0.35 } as Record<string, unknown>)}
      />

      {/* 3. Cinematic Framing Vignette */}
      <Vignette
        offset={0.25}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
      />

      {/* 4. ACES Filmic Tone Mapping */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
