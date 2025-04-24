// components/FloatingPlayer.vue
<template>
  <view v-if="audio.current" class="floating-player">
    <image :src="audio.current.cover" class="cover" />
    <view class="info">
      <text class="title">{{ audio.current.title }}</text>
      <text class="artist">{{ audio.current.artist }}</text>
    </view>
    <u-icon :name="audio.isPlaying ? 'pause-circle' : 'play-circle'" size="48" @click="toggle" />
  </view>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/useAudioStore'
import { AudioManager } from '@/utils/audio'
import { storeToRefs } from 'pinia'

const audio = useAudioStore()
const { current, isPlaying } = storeToRefs(audio)

function toggle() {
  if (!current.value) return
  if (isPlaying.value) {
    AudioManager.pause()
    audio.pause()
  } else {
    AudioManager.play(current.value.url)
    audio.isPlaying = true
  }
}
</script>

<style scoped>
.floating-player {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-top: 1px solid #eee;
  padding: 20rpx;
  z-index: 999;
}
.cover {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}
.info {
  flex: 1;
}
.title {
  font-weight: bold;
}
.artist {
  font-size: 24rpx;
  color: #888;
}
</style>