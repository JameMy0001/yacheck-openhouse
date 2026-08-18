// Pure Web Audio API Synthesizer for Zero-Asset Sci-Fi UI Sounds

class AudioSynthesizer {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private ambientOsc: OscillatorNode | null = null
  private isInitialized = false

  init() {
    if (this.isInitialized) return
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.isInitialized = true
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // A low, continuous sub-bass hum
  startAmbientDrone() {
    if (!this.ctx) return
    if (this.ambientOsc) return // already playing

    this.ambientOsc = this.ctx.createOscillator()
    this.ambientOsc.type = 'sine'
    this.ambientOsc.frequency.setValueAtTime(45, this.ctx.currentTime) // Low frequency

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3) // Fade in slowly

    this.ambientOsc.connect(this.ambientGain)
    this.ambientGain.connect(this.ctx.destination)

    this.ambientOsc.start()
  }

  // A high-tech short click for scrolling past sections
  playMilestoneBlip() {
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    
    // Quick pitch drop for a "blip" sound
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1)

    // Quick volume envelope
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  // Soft click for hover/buttons
  playHoverClick() {
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }
}

export const synth = new AudioSynthesizer()
