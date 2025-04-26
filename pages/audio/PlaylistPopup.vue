<template>
  <view class="playlist-mask" v-if="visible" @click="close" @touchmove.stop.prevent>
    <view 
      class="playlist-popup" 
      @click.stop
    >
      <view class="playlist-header">
        <text class="title">当前播放列表</text>
        <u-icon name="close" @click="close" size="40" color="#999" />
      </view>
      <scroll-view 
        class="playlist-scroll" 
        scroll-y 
        :scroll-into-view="scrollIntoViewId"
      >
        <view
          class="playlist-item"
          v-for="(song, index) in playlist"
          :key="song.id"
          :id="`song-${song.id}`"
          :class="{ active: index === currentIndex }"
          @click="select(index)"
        >
          <view class="playlist-item-inner">
            <view class="left-icon">
              <image
                v-if="index === currentIndex"
                src="/static/icon/music/播放2.svg"
                class="play-svg-icon"
                mode="aspectFit"
              />
              <text v-else class="index">{{ String(index + 1).padStart(2, '0') }}</text>
            </view>
            <view class="playlist-item-content">
              <text class="song-name">{{ song.name }}</text>
              <text class="singer-name">{{ song.singerName }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useAudioStore } from '@/stores/useAudioStore'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

const audioStore = useAudioStore()
const playlist = computed(() => audioStore.playlist)
const currentIndex = computed(() => audioStore.currentIndex)

const scrollIntoViewId = ref('')

function close() {
  emit('close')
}

function select(index: number) {
  if (index === currentIndex.value) {
    emit('close')
    return
  }
  audioStore.playByIndex(index)
  emit('close')
}

watch(() => props.visible, async (newVal) => {
  if (newVal) {
    await nextTick()
    scrollIntoViewId.value = ''

    await nextTick()

    const current = playlist.value[currentIndex.value]
    if (current) {
      scrollIntoViewId.value = `song-${current.id}`
    }
  } else {
    scrollIntoViewId.value = ''
  }
})
</script>

<style scoped>
.playlist-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.playlist-popup {
  width: 100%;
  min-height: 40vh;
  max-height: 70vh;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  box-shadow: 0 -6rpx 20rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 36rpx;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.playlist-scroll {
  height: 70vh;
  padding: 24rpx 36rpx;
  overflow-y: auto;
  padding-bottom: 80rpx;
}

.playlist-item {
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
  background-color: #ffffff;
  transition: background-color 0.3s;
}

.playlist-item.active {
  background-color: #f0f6ff;
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item-inner {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

.left-icon {
  width: 80rpx;
  flex-shrink: 0;
  text-align: right;
  margin-right: 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.index {
  font-size: 26rpx;
  color: #999;
}

.play-svg-icon {
  width: 36rpx;
  height: 36rpx;
}

.playlist-item-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.song-name {
  font-size: 30rpx;
  color: #000;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-item.active .song-name {
  color: #2a70ff;
  font-weight: bold;
}

.singer-name {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
