<template>
  <view class="banner-box pressable" @click="onTap">
    <image
      class="banner-img"
      :src="imageUrl"
      mode="aspectFill"
    />
    <view class="banner-text">
      <view class="verse">{{ verse }}</view>
      <view class="ref">{{ refText }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config'

const verse = ref('加载中...')
const refText = ref('')
const imageUrl = ref('') // 随机图路径

function onTap() {
  console.log('[点击] 圣言横幅')
}

onMounted(() => {
  const n = Math.floor(Math.random() * 20) + 1
  imageUrl.value = `${Config.dailyScripture.imageBaseUrl}${n}.webp`

  uni.request({
    url: Config.dailyScripture.configUrl,
    method: 'GET',
    success: (res) => {
      const scriptures = res.data?.scriptures || []
      if (scriptures.length > 0) {
        const random = scriptures[Math.floor(Math.random() * scriptures.length)]
        verse.value = random.text || '——'
        refText.value = random.reference || ''
      }
    },
    fail: (err) => {
      console.error('[加载圣言失败]', err)
      verse.value = '上主是我的牧者，我实在一无所缺。'
      refText.value = '圣咏23:1'
    }
  })
})
</script>

<style scoped>
.banner-box {
  position: relative;
  margin: 24rpx;
  border-radius: 20rpx;
  overflow: hidden;
  height: 360rpx; 
}
.banner-img {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.banner-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 64, 0.6), transparent);
  color: white;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}
.verse {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}
.ref {
  font-size: 28rpx;
  opacity: 0.9;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}
.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.995);
}
</style>
