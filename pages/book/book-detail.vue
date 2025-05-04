<template>
  <view class="book-detail-page">
    <!-- 章节标题 -->
    <view class="section-title" v-if="sectionTitle">
      {{ sectionTitle }}
    </view>

    <!-- Markdown 内容 -->
    <view class="markdown-wrapper" v-if="markdownContent">
      <zero-markdown-view :markdown="markdownContent" />
    </view>

    <!-- 加载动画 -->
    <view v-else class="loading-wrapper">
      <image src="/static/common/loading.svg" class="loading-icon rotating" mode="aspectFit" />
      <text class="loading-text">章节内容加载中...</text>
    </view>

    <!-- 返回顶部图标 -->
    <image
      v-if="showBackTop"
      src="/static/common/goTop.svg"
      class="back-to-top-icon"
      mode="aspectFit"
      @click="scrollToTop"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { Config } from '@/utils/config'

const bookId = ref('')
const markdownPath = ref('')
const markdownContent = ref('')
const sectionTitle = ref('')
const showBackTop = ref(false)

onLoad((options) => {
  bookId.value = options.bookId
  markdownPath.value = decodeURIComponent(options.path)
  sectionTitle.value = options.title || ''

  const fullUrl = Config.resolveStaticUrl(markdownPath.value)

  // 立即加载内容
  uni.request({
    url: fullUrl,
    success: (res) => {
      markdownContent.value = res.data.trim()
    },
    fail: (err) => {
      console.error('[失败] 加载 Markdown 内容失败', err)
    }
  })
})

onPageScroll((e) => {
  showBackTop.value = e.scrollTop > 400
})

function scrollToTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}
</script>

<style scoped>
.book-detail-page {
  padding: 24rpx;
  position: relative;
  overflow-x: hidden;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  text-align: center;
}

.markdown-wrapper {
  padding-bottom: 60rpx;
}

.loading-wrapper {
  margin-top: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 24rpx;
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.back-to-top-icon {
  position: fixed;
  bottom: 120rpx;
  right: 40rpx;
  width: 80rpx;
  height: 80rpx;
  z-index: 999;
}
</style>
