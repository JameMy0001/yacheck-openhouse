export type AnimState = {
  scrollProgress: number
  dangerMix: number
  explode: number
  cameraZ: number
  cameraY: number
  capsuleScale: number
  networkScale: number
}

export const animState: AnimState = {
  scrollProgress: 0,
  dangerMix: 0,
  explode: 0,
  cameraZ: 6.0,
  cameraY: 0.0,
  capsuleScale: 1.0,
  networkScale: 0.0,
}

export function updateAnimState(newState: Partial<AnimState>) {
  Object.assign(animState, newState)
}
