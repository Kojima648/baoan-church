<template>
  <u-popup
    :show="visible"
    mode="bottom"
    :round="20"
    @close="close"
    :safeAreaInsetBottom="true"
    :closeable="false"
  >
    <view class="playlist-container">
      <view class="playlist-header">
        <text class="title">当前播放列表</text>
        <u-icon name="close" @click="close" size="40" color="#999" />
      </view>

      <scroll-view
        scroll-y
        :scroll-into-view="scrollIntoViewId"
        scroll-with-animation
        class="playlist-scroll"
      >
        <view
          v-for="(song, index) in playlist"
          :key="song.id"
          :id="`song-${song.id}`"
          :class="['playlist-item', { active: index === currentIndex }]"
          @click.stop="select(index)"
        >
          <view class="playlist-item-inner">
            <view class="left-icon">
              <image
                v-if="index === currentIndex"
                src="/static/icon/music/播放2.svg"
                class="play-svg-icon"
                mode="aspectFit"
              />
              <text v-else class="index">
                {{ String(index + 1).padStart(2, '0') }}
              </text>
            </view>
            <view class="playlist-item-content">
              <text class="song-name">{{ truncate(song.name) }}</text>
              <text class="singer-name">{{ truncate(song.singerName) }}</text>
            </view>
          </view>
        </view>

        <!-- 占位防遮挡 -->
        <view style="height: 60rpx;"></view>
      </scroll-view>
    </view>
  </u-popup>
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
  if (index !== currentIndex.value) {
    audioStore.playByIndex(index)
  }
  emit('close')
}

function countChinese(str: string): number {
  return (str.match(/[\u4e00-\u9fa5]/g) || []).length
}

function truncate(text: string, limit = 18): string {
  if (!text) return ''
  const chineseCount = countChinese(text)
  return chineseCount >= limit ? text.slice(0, limit) + '...' : text
}


watch(() => props.visible, async (val) => {
  console.log('[Popup] visible:', val)
  if (val) {
    await nextTick()
    scrollIntoViewId.value = ''
    await nextTick()
    const current = playlist.value[currentIndex.value]
    if (current) {
      scrollIntoViewId.value = `song-${current.id}`
      console.log('[Popup] scrollIntoViewId set:', scrollIntoViewId.value)
    }
  }
})
</script>

<style scoped>
.playlist-container {
  background-color: #fff;
  max-height: 80vh;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
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
  height: 60vh; /* ✅ 明确高度，不使用 flex: 1 */
  overflow-y: auto;
  padding: 24rpx 36rpx 100rpx;
}

.playlist-item {
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fff;
  transition: background-color 0.3s;
}

.playlist-item.active {
  background-color: #f0f6ff;
}

.playlist-item-inner {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

.left-icon {
  width: 80rpx;
  flex-shrink: 0;
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
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.song-name,
.singer-name {
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.singer-name {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
}

.playlist-item.active .song-name {
  color: #2a70ff;
  font-weight: bold;
}
</style>
