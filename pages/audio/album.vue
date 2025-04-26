<template>
  <view class="page">
    <view class="header">
      <text class="header-title">{{ album?.name }}</text>
    </view>

    <view class="album-desc">{{ album?.description }}</view>

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

    <floating-player />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FloatingPlayer from '@/components/FloatingPlayer.vue'

const album = ref<any>(null)

function playSong(index: number) {
  if (!album.value || !album.value.data) return
  const playlist = album.value.data
  const encodedPlaylist = encodeURIComponent(JSON.stringify(playlist))
  const encodedSource = encodeURIComponent(album.value.name || '宝安天主堂')
	
  uni.navigateTo({
	url: `/pages/audio/play?playlist=${encodedPlaylist}&index=${index}&source=${encodedSource}`
  })
}

onLoad((options) => {
  if (options.album) {
    try {
      const simpleAlbum = JSON.parse(decodeURIComponent(options.album))

      // 设置顶部标题
      uni.setNavigationBarTitle({ title: simpleAlbum.title })

      // 根据 id 请求详细歌单
      uni.request({
        url: `https://mini-program-1252089784.cos.ap-guangzhou.myqcloud.com/config/music/type-0/sheet_detail/sheet_${simpleAlbum.id}.json`,
        success: (res) => {
          album.value = res.data || {}
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
  padding: 30rpx;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.header-title {
  font-size: 32rpx;
  font-weight: bold;
}
.album-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 30rpx;
  line-height: 1.6;
}
.song-list {
  margin-top: 20rpx;
}
.song-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.card-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.card-info {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 30rpx;
  font-weight: 600;
}
.artist {
  font-size: 24rpx;
  color: #888;
}
</style>
