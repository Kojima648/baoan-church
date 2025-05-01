<template>
  <view class="section-box">
    <view class="section-title">每日灵修</view>
    <view class="devotion-grid">
      <view
        class="devotion-item pressable"
        v-for="(item, index) in items"
        :key="index"
        @click="onTap(item)"
      >
        <view class="icon">{{ item.icon }}</view>
        <view class="title">{{ item.title }}</view>
        <view class="sub">{{ item.sub }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
	default: () => [
	  { title: '公教日课', sub: '复活节第三日', icon: '🕯️', url: '/pages/devotion/daily-office/index' },
	  { title: '思高圣经', sub: '创 1', icon: '📖', url: '/pages/bible/sigao/index' },
	  { title: '每日读经', sub: '中文读经', icon: '🙏', url: '/pages/devotion/reading/index' },
	  { title: '教会节日', sub: '圣人圣女', icon: '🍷', url: '/pages/festival/calendar/index' }
	]
  }
})

function onTap(item: any) {
  console.log('[点击] 每日灵修项：', item.title)
  if (item.url) {
    uni.navigateTo({ url: item.url })
  } else {
    uni.showToast({ title: '该功能暂未开放', icon: 'none' })
  }
}

</script>

<style scoped>
.section-box {
  margin: 0 24rpx 24rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin: 0 0 16rpx;
  color: #333;
}
.devotion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 4rpx;
}
.devotion-item {
  position: relative;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.icon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 32rpx;
}
.title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}
.sub {
  font-size: 22rpx;
  color: #999;
}
.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.99);
}
</style>