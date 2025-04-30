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
          <image src="/static/icon/festival/date.svg" class="calendar-icon" mode="aspectFit" />
        </view>
      </picker>
    </view>
    <view class="meta-right">{{ specialMonth }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{ meta: any }>()
const emit = defineEmits<{
  (e: 'date-change', yearMonth: string): void
}>()

const displayDate = ref('')
const specialMonth = ref('')
const currentPickerValue = ref('')
const startDate = '2025-01'
const endDate = '2050-12'

function onDateChange(e: any) {
  const value = e.detail.value // '2025-09'
  currentPickerValue.value = value
  const [year, month] = value.split('-')
  displayDate.value = `${year}年${month}月`
  emit('date-change', value)
}

watch(
  () => props.meta,
  (meta) => {
    const year = meta?.year || 2025
    const month = String(meta?.month || 1).padStart(2, '0')
    currentPickerValue.value = `${year}-${month}`
    displayDate.value = `${year}年${month}月`
    specialMonth.value = meta?.special_festival_note || ''
  },
  { immediate: true }
)
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
