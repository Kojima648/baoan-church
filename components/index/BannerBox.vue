--- BannerBox.vue
<template>
  <view class="banner-box pressable" @click="onTap">
    <image
      class="banner-img"
      src="https://picsum.photos/600/300"
      mode="aspectFill"
    />
    <view class="banner-text">
      <view class="verse">因为鱼太多，竟不能拉上网来。</view>
      <view class="ref">若 21:6</view>
    </view>
  </view>
</template>

<script setup lang="ts">
function onTap() {
  console.log('[点击] 圣言横幅')
}
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
}
.verse {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}
.ref {
  font-size: 28rpx;
  opacity: 0.9;
}
.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.995);
}
</style>