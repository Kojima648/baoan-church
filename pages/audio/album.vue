<template>
  <scroll-view class="page" scroll-y>
    <view class="container">
      <view class="header">
        <text class="header-title">{{ album?.name }}</text>
      </view>

      <view class="album-desc-wrapper">
        <view class="album-desc" :class="{ collapsed: !descExpanded && isDescLong }">
          {{ album?.description }}
        </view>
        <view
          v-if="isDescLong && !descExpanded"
          class="desc-gradient"
        ></view>
      </view>

      <view
        v-if="isDescLong"
        class="toggle-btn"
        @click="toggleDesc"
      >
        {{ descExpanded ? '收起简介' : '展开全部' }}
      </view>

      <view v-if="album && album.data" class="song-list">
        <view
          v-for="(song, index) in album.data"
          :key="song.id"
          class="song-card"
          @click="playSong(index)"
        >
          <image :src="song.imageUrl" class="card-img" mode="aspectFill" />
          <view class="card-info">
            <text class="title">{{ song.name }}</text>
            <text class="artist">{{ song.singerName }}</text>
          </view>
        </view>
      </view>
    </view>

    <floating-player />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FloatingPlayer from '@/components/FloatingPlayer.vue'

const album = ref<any>(null)
const descExpanded = ref(false)
const isDescLong = ref(false)

function playSong(index: number) {
  if (!album.value || !album.value.data) return
  const playlist = album.value.data
  const encodedPlaylist = encodeURIComponent(JSON.stringify(playlist))
  const encodedSource = encodeURIComponent(album.value.name || '宝安天主堂')

  uni.navigateTo({
    url: `/pages/audio/play?playlist=${encodedPlaylist}&index=${index}&source=${encodedSource}`
  })
}

function toggleDesc() {
  descExpanded.value = !descExpanded.value
  if (descExpanded.value) {
    nextTick(() => {
      uni.pageScrollTo({
        selector: '.album-desc-wrapper',
        duration: 300
      })
    })
  }
}

onLoad((options) => {
  if (options.album) {
    try {
      const simpleAlbum = JSON.parse(decodeURIComponent(options.album))
      uni.setNavigationBarTitle({ title: simpleAlbum.title })
      uni.request({
        url: `https://mini-program-1252089784.cos.ap-guangzhou.myqcloud.com/config/music/type-0/sheet_detail/sheet_${simpleAlbum.id}.json`,
        success: (res) => {
          album.value = res.data || {}
          if (album.value.description && album.value.description.length > 90) {
            isDescLong.value = true
          }
        },
        fail: (err) => {
          console.error('专辑详情加载失败', err)
        }
      })
    } catch (e) {
      console.error('album 参数解析失败', e)
    }
  }
})
</script>

<style scoped>
.page {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.container {
  padding: 32rpx;
}

.header {
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.album-desc-wrapper {
  position: relative;
  margin-bottom: 16rpx;
}

.album-desc {
  font-size: 28rpx;
  color: #444;
  line-height: 1.8;
  text-align: left;
  word-break: break-word;
  overflow: hidden;
  transition: all 0.3s;
  padding: 0 8rpx;
  max-width: 100%;
  box-sizing: border-box;
}

.album-desc.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.desc-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: linear-gradient(rgba(248, 248, 248, 0), #f8f8f8);
  pointer-events: none;
}

.toggle-btn {
  text-align: center;
  font-size: 26rpx;
  color: #3c9cff;
  margin-bottom: 32rpx;
}

.song-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.song-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.card-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}

.artist {
  font-size: 24rpx;
  color: #888;
}
</style>
