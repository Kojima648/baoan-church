// utils/audio.ts
let audio = uni.createInnerAudioContext()
audio.autoplay = false
audio.obeyMuteSwitch = false

export const AudioManager = {
  play(url: string) {
    audio.src = url
    audio.play()
  },
  pause() {
    audio.pause()
  },
  stop() {
    audio.stop()
  }
}