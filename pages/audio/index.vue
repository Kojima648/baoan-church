<template>
  <view class="page">
    <text style="margin-bottom:20rpx; color: green">✅ 页面已加载</text>

    <!-- 歌单列表 -->
    <view v-for="album in albums" :key="album.id" class="card" @click="openAlbum(album)">
      <image :src="album.cover" class="card-img" />
      <view class="card-info">
        <text class="title">{{ album.name }}</text>
        <text class="artist">共 {{ album.songs.length }} 首</text>
      </view>
    </view>

    <!-- 当前专辑的歌曲列表 -->
    <view v-if="selectedAlbum" style="margin-top: 30rpx;">
      <view class="section-title">🎵 {{ selectedAlbum.name }} 歌曲列表</view>
      <view v-for="song in selectedAlbum.songs" :key="song.id" class="card song-card" @click="play(song)">
        <image :src="song.cover" class="card-img" />
        <view class="card-info">
          <text class="title">{{ song.title }}</text>
          <text class="artist">{{ song.artist }}</text>
        </view>
      </view>
    </view>

    <floating-player />
  </view>
</template>

<script setup lang="ts">
import FloatingPlayer from '@/components/FloatingPlayer.vue'
import { useAudioStore } from '@/stores/useAudioStore'
import { AudioManager } from '@/utils/audio'
import { ref } from 'vue'

const audio = useAudioStore()

const albums = [
  {
    id: 1,
    name: '圣咏精选集',
    cover: 'https://picsum.photos/80/80?album1',
    songs: [
      {
        id: 1,
        title: '圣母颂',
        artist: '宝安堂唱诗班',
        url: 'https://example.com/audio/song1.mp3',
        cover: 'https://picsum.photos/80/80?1'
      },
      {
        id: 2,
        title: '平安夜',
        artist: '教堂童声合唱团',
        url: 'https://example.com/audio/song2.mp3',
        cover: 'https://picsum.photos/80/80?2'
      }
    ]
  },
  {
    id: 2,
    name: '玫瑰经诵念',
    cover: 'https://picsum.photos/80/80?album2',
    songs: [
      {
        id: 3,
        title: '玫瑰经起始祷文',
        artist: '教友会',
        url: 'https://example.com/audio/song3.mp3',
        cover: 'https://picsum.photos/80/80?3'
      }
    ]
  }
]

const selectedAlbum = ref(null)

function openAlbum(album) {
  selectedAlbum.value = album
}

function play(song) {
  audio.play(song)
  AudioManager.play(song.url)
}
</script>

<style scoped>
.page {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.card {
  display: flex;
  margin-bottom: 20rpx;
  background: #ffffff;
  padding: 20rpx;
  border-radius: 16rpx;
  align-items: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.card-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background: #ccc;
}
.card-info {
  display: flex;
  flex-direction: column;
}
.card-info .title {
  font-size: 30rpx;
  font-weight: bold;
}
.card-info .artist {
  font-size: 24rpx;
  color: #888;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin: 20rpx 0;
}
.song-card {
  background: #f9f9f9;
}
</style>