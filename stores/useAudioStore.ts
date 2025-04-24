// stores/useAudioStore.ts
import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    current: null as null | Song,
    isPlaying: false
  }),
  actions: {
    play(song: Song) {
      this.current = song
      this.isPlaying = true
      uni.createInnerAudioContext().src = song.url // demo，不是真正控制器
    },
    pause() {
      this.isPlaying = false
    }
  }
})

export interface Song {
  id: number
  title: string
  artist: string
  url: string
  cover: string
}