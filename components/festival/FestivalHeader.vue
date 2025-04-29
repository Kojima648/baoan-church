<template>
  <view class="meta-bar">
    <view class="meta-left">主历</view>
    <view class="meta-center" @click="onPickDate">
      <text class="meta-date">{{ displayDate }}</text>
      <text class="calendar-icon">📅</text>
    </view>
    <view class="meta-right">{{ specialMonth }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const displayDate = ref('2025年05月')
const specialMonth = ref('圣母月')

function onPickDate() {
  uni.showToast({ title: '点击选择日期', icon: 'none' })
}
</script>

<style scoped>
.meta-bar {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  background-color: #f6f6f6;
  border-bottom: 2rpx solid #eee;
}

.meta-left,
.meta-right {
  font-size: 28rpx;
  color: #444;
}

.meta-center {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-date {
  font-size: 30rpx;
  color: #223399;
  text-decoration: underline;
}

.calendar-icon {
  font-size: 26rpx;
}
</style>
