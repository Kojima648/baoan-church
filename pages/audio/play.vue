<template>
  <view class="player-page">
    <view class="top-bar">
      <text class="source-label">来自{{ source }}</text>
    </view>

    <view class="tape-box">
      <image :src="currentSong?.imageUrl" class="tape-image" mode="aspectFill" />
    </view>

    <view class="info">
      <text class="title">{{ currentSong?.name || '未知歌曲' }}</text>
      <text class="artist">{{ currentSong?.singerName || '未知歌手' }}</text>
    </view>

    <view class="progress">
      <slider
        class="slider"
        :value="currentTime"
        :max="duration > 0 ? duration : 1"
        block-size="14"
        activeColor="#333"
        backgroundColor="#ccc"
        @changing="onSliderChanging"
        @change="onSliderChanged"
      />
      <view class="time">
        <text>{{ formatTime(currentTime) }}</text>
        <text class="duration">{{ formatTime(duration) }}</text>
      </view>
    </view>

    <view class="controls">
      <image
        :src="`/static/icon/music/${playModeIcon}`"
        class="icon-btn small"
        @click="togglePlayMode"
      />
      <image
        src="/static/icon/music/上一首歌.svg"
        class="icon-btn"
        @click="playPrev"
      />
      <image
        :src="isPlaying ? '/static/icon/music/暂停.svg' : '/static/icon/music/播放.svg'"
        class="icon-btn big"
        @click="togglePlay"
      />
      <image
        src="/static/icon/music/下一首.svg"
        class="icon-btn"
        @click="playNext"
      />
      <image
        src="/static/icon/music/歌单.svg"
        class="icon-btn small"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAudioStore } from '@/stores/useAudioStore'

const audioStore = useAudioStore()
const currentSong = computed(() => audioStore.currentSong)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const seeking = ref(false)
const playMode = ref<'order' | 'repeat' | 'shuffle'>('order')
const source = ref('宝安天主堂') // 专辑来源默认值

let bgAudio: WechatMiniprogram.BackgroundAudioManager | null = null

const playModeIcon = computed(() => {
  if (playMode.value === 'repeat') return '单曲循环.svg'
  if (playMode.value === 'shuffle') return '随机播放.svg'
  return '循环播放.svg'
})

function loadCurrentSong() {
  if (!currentSong.value || !bgAudio) return
  bgAudio.title = currentSong.value.name || '未知歌曲'
  bgAudio.epname = currentSong.value.albumName || ''
  bgAudio.singer = currentSong.value.singerName || '未知歌手'
  bgAudio.coverImgUrl = currentSong.value.imageUrl
  bgAudio.src = currentSong.value.mp3Url
  bgAudio.play()
  uni.setNavigationBarTitle({ title: currentSong.value.name || '正在播放' })
}

function playNext() {
  if (playMode.value === 'shuffle') audioStore.playRandom()
  else audioStore.playNext()
  loadCurrentSong()
}

function playPrev() {
  audioStore.playPrev()
  loadCurrentSong()
}

function togglePlay() {
  if (!bgAudio) return
  isPlaying.value ? bgAudio.pause() : bgAudio.play()
}

function onSliderChanging(e) {
  seeking.value = true
  currentTime.value = e.detail.value
}

function onSliderChanged(e) {
  if (!bgAudio) return
  bgAudio.seek(e.detail.value)
  seeking.value = false
}

function formatTime(sec: number) {
  sec = Math.floor(sec)
  const min = String(Math.floor(sec / 60)).padStart(2, '0')
  const secStr = String(sec % 60).padStart(2, '0')
  return `${min}:${secStr}`
}

function togglePlayMode() {
  playMode.value = playMode.value === 'order' ? 'repeat' : playMode.value === 'repeat' ? 'shuffle' : 'order'
  uni.showToast({ title: playModeText(), icon: 'none' })
}

function playModeText() {
  if (playMode.value === 'order') return '顺序播放'
  if (playMode.value === 'repeat') return '单曲循环'
  return '随机播放'
}

onLoad((options) => {
  if (options.source) {
    source.value = decodeURIComponent(options.source)
  }

  if (options.playlist && options.index !== undefined) {
    try {
      const list = JSON.parse(decodeURIComponent(options.playlist))
      const index = parseInt(options.index)
      audioStore.setPlaylist(list)
      audioStore.playByIndex(index)
    } catch (e) {
      console.error('解析播放参数失败', e)
    }
  }

  if (process.env.UNI_PLATFORM === 'mp-weixin') {
    bgAudio = uni.getBackgroundAudioManager()
    loadCurrentSong()
    bgAudio.onPlay(() => { isPlaying.value = true })
    bgAudio.onPause(() => { isPlaying.value = false })
    bgAudio.onStop(() => { isPlaying.value = false })
    bgAudio.onEnded(() => {
      if (playMode.value === 'repeat') {
        loadCurrentSong() // 单曲循环时重新加载当前歌曲
      } else {
        playNext() // 顺序或随机播放
      }
    })
    bgAudio.onTimeUpdate(() => {
      if (!seeking.value && bgAudio) {
        currentTime.value = bgAudio.currentTime
        duration.value = bgAudio.duration
      }
    })
  }
})
</script>

<style scoped>
.player-page {
  background-color: #f9f9f9;
  padding: 40rpx 30rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.top-bar {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}
.source-label {
  text-align: center;
}
.tape-box {
  margin-bottom: 30rpx;
}
.tape-image {
  width: 500rpx;
  height: 300rpx;
  border-radius: 20rpx;
  object-fit: cover;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}
.info {
  text-align: center;
  margin-bottom: 30rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.artist {
  font-size: 26rpx;
  color: #888;
}
.progress {
  width: 92%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}
.slider {
  width: 100%;
}
.time {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 30rpx;
  margin-top: 20rpx;
}
.icon-btn {
  width: 60rpx;
  height: 60rpx;
}
.icon-btn.small {
  width: 48rpx;
  height: 48rpx;
}
.icon-btn.big {
  width: 90rpx;
  height: 90rpx;
}
</style>
