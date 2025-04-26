// stores/useAudioStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  // 播放列表
  const playlist = ref<any[]>([])
  // 当前播放索引
  const currentIndex = ref<number>(0)

  // 当前正在播放的歌曲对象
  const currentSong = computed(() => {
    return playlist.value[currentIndex.value] || null
  })

  // 设置播放列表并重置索引到第一首
  function setPlaylist(list: any[]) {
    playlist.value = list
    currentIndex.value = 0
  }

  // 播放指定索引的歌曲
  function playByIndex(index: number) {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
    }
  }

  // 播放下一首（顺序播放）
  function playNext() {
    if (playlist.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  }

  // 播放上一首
  function playPrev() {
    if (playlist.value.length === 0) return
    currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  }

  // 随机播放一首
  function playRandom() {
    if (playlist.value.length === 0) return
    let randomIndex = Math.floor(Math.random() * playlist.value.length)
    // 如果随机到当前正在播放的歌曲，重新随机，避免重复
    while (randomIndex === currentIndex.value && playlist.value.length > 1) {
      randomIndex = Math.floor(Math.random() * playlist.value.length)
    }
    currentIndex.value = randomIndex
  }

  return {
    playlist,
    currentIndex,
    currentSong,
    setPlaylist,
    playByIndex,
    playNext,
    playPrev,
    playRandom
  }
})
