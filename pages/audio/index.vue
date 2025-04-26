<template>
  <view class="page">
    <view class="header">🎵 教会歌单</view>

    <!-- 歌单卡片列表 -->
    <view class="album-grid">
      <view
        v-for="album in albums"
        :key="album.id"
        class="album-card"
        @click="goToAlbum(album)"
      >
        <image :src="album.cover" class="album-img" />
        <view class="album-title">{{ album.title }}</view>
        <view class="album-desc">播放 {{ album.play_count }} 次</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const albums = ref([])

function goToAlbum(album) {
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
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.header {
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.album-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.album-card {
  background: #ffffff;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.album-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}
.album-title {
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
}
.album-desc {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}
</style>
