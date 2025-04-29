<template>
  <view class="meta-bar">
    <view class="meta-left">主历</view>
    <view class="meta-center">
      <picker
        mode="date"
        fields="month"
        :start="startDate"
        :end="endDate"
        :value="currentPickerValue"
        @change="onDateChange"
      >
        <view class="meta-date">
          {{ displayDate }}
          <!-- ✅ 用 SVG 图标替换文字图标 -->
          <image src="/static/icon/festival/date.svg" class="calendar-icon" mode="aspectFit" />
        </view>
      </picker>
    </view>
    <view class="meta-right">{{ specialMonth }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config'

const displayDate = ref('')
const specialMonth = ref('')
const currentPickerValue = ref('')
const startDate = '2025-01'
const endDate = '2050-12'

function loadFestivalMeta(yearMonth: string) {
  const url = Config.festival.getFestivalListUrl(yearMonth)

  console.log('[请求FestivalList]', url)

  uni.request({
    url,
    success: (res) => {
      const meta = res.data?.meta
      if (meta) {
        specialMonth.value = meta.special_festival_note || ''
        console.log('[解析meta成功]', specialMonth.value)
      } else {
        specialMonth.value = ''
        console.warn('[无meta信息]', url)
      }
    },
    fail: () => {
      console.error('[请求失败]', url)
      specialMonth.value = ''
    }
  })
}

function onDateChange(e: any) {
  const value = e.detail.value // '2025-05'
  currentPickerValue.value = value

  const [year, month] = value.split('-')
  displayDate.value = `${year}年${month}月`

  loadFestivalMeta(value)
}

onMounted(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')

  currentPickerValue.value = `${year}-${month}`
  displayDate.value = `${year}年${month}月`

  loadFestivalMeta(currentPickerValue.value)
})
</script>

<style scoped>
.meta-bar {
  position: relative;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f6f6;
  border-bottom: 2rpx solid #eee;
}

.meta-left,
.meta-right {
  position: absolute;
  top: 0;
  height: 80rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #444;
}

.meta-left {
  left: 24rpx;
}

.meta-right {
  right: 24rpx;
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
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.calendar-icon {
  width: 32rpx;
  height: 32rpx;
}
</style>
