<template>
  <u-popup
    :show="visible"
    mode="center"
    :closeable="false"
    :mask-close-able="true"
    @click-overlay="onClose"
    :safe-area-inset-bottom="true"
    :custom-style="{ background: 'transparent' }"
  >
    <view class="popup-card" @click.stop>
      <view class="popup-title">{{ title }}</view>
      <view class="popup-content">{{ content }}</view>
      <view class="popup-button-box">
        <view class="popup-button" @click="onClose">{{ buttonText }}</view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: '知道了'
  }
})

const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}
</script>

<style scoped>
.popup-card {
  width: 600rpx;
  padding: 48rpx 40rpx 36rpx;
  background-color: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.25s ease-out;
  text-align: center;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 24rpx;
}

.popup-content {
  font-size: 26rpx;
  color: #444;
  line-height: 1.8;
  white-space: pre-line;
  text-align: left;
}

.popup-button-box {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;
}

.popup-button {
  font-size: 26rpx;
  color: #666;
  background-color: #f0f0f0;
  padding: 16rpx 40rpx;
  border-radius: 999rpx;
  font-weight: normal;
}

.popup-button:active {
  background-color: #e0e0e0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
