<template>
  <scroll-view class="page" scroll-y>
    <view class="container">
      <view class="header">🎵 教会歌单</view>

      <view class="album-grid">
        <view
          v-for="album in albums"
          :key="album.id"
          class="album-card"
          @click="goToAlbum(album)"
        >
          <image :src="album.cover" class="album-img" mode="aspectFill" />
          <view class="album-title">{{ album.title }}</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const albums = ref<any[]>([])

function goToAlbum(album: any) {
  const encoded = encodeURIComponent(JSON.stringify(album))
  uni.navigateTo({
    url: `/pages/audio/album?album=${encoded}`
  })
}

onMounted(() => {
  uni.request({
    url: 'https://mini-program-1252089784.cos.ap-guangzhou.myqcloud.com/config/music/type-0/sheet_list.json',
    success: (res) => {
      albums.value = res.data || []
    },
    fail: (err) => {
      console.error('歌单加载失败', err)
    }
  })
})
</script>

<style scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.container {
  padding: 30rpx;
  box-sizing: border-box;
}

.header {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
  color: #333;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.album-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
}

.album-card:active {
  transform: scale(0.96);
}

.album-img {
  width: 100%;
  aspect-ratio: 1 / 1; /* 保持图片正方形比例 */
  object-fit: cover;
}

.album-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #222;
  text-align: center;
  margin: 20rpx 0;
  padding: 0 10rpx;
  word-break: break-word;
}
</style>
