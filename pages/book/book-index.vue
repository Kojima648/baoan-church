<template>
  <view class="book-index-page">
    <scroll-view scroll-y class="scroll-area" :scroll-top="scrollTop">
      <view class="book-header">
        <image
          v-if="bookData.cover"
          class="book-cover"
          :src="Config.resolveStaticUrl(bookData.cover)"
          mode="aspectFill"
        />
        <view class="book-info">
          <view class="book-title">{{ bookData.title }}</view>
          <view class="book-summary">{{ bookData.summary }}</view>
        </view>
      </view>

      <view
        v-for="(group, category) in groupedSections"
        :key="category"
        class="category-group"
      >
        <view class="category-title sticky-title">{{ category }}</view>
        <view class="section-list">
          <view
            class="section-item pressable"
            v-for="(section, index) in group"
            :key="index"
            @click="onSelectSection(section)"
          >
            <text class="section-title">{{ section.title }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 返回顶部按钮 -->
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
import { Config } from '@/utils/config'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'

const bookId = ref('')
const bookData = ref<any>({
  title: '',
  summary: '',
  cover: '',
  sections: []
})

const groupedSections = ref<Record<string, any[]>>({})
const showBackTop = ref(false)
const scrollTop = ref(0)

function groupByCategory(sections: any[]) {
  const result: Record<string, any[]> = {}
  sections.forEach(section => {
    if (!result[section.category]) result[section.category] = []
    result[section.category].push(section)
  })
  return result
}

function onSelectSection(section: any) {
  console.log('[跳转章节]', section.path)
  uni.navigateTo({
    url: `/pages/book/book-detail?bookId=${bookId.value}&path=${encodeURIComponent(section.path)}`
  })
}

function scrollToTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}

onPageScroll((e) => {
  showBackTop.value = e.scrollTop > 400
})

onLoad((options) => {
  bookId.value = options.id
  console.log('[页面加载] bookId:', bookId.value)

  const indexPath = `/config/index/catholic-books/index/${bookId.value}_index.json`
  const fullUrl = Config.resolveStaticUrl(indexPath)
  console.log('[加载书籍目录]', indexPath, '➡️', fullUrl)

  uni.request({
    url: fullUrl,
    success: (res) => {
      console.log('[成功] 加载书籍数据:', res.data)
      bookData.value = res.data
      groupedSections.value = groupByCategory(res.data.sections || [])
    },
    fail: (err) => {
      console.error('加载书籍章节失败', err)
    }
  })
})
</script>

<style scoped>
.book-index-page {
  padding: 0 24rpx;
  height: 100vh;
  box-sizing: border-box;
}

.scroll-area {
  height: 100%;
}

.book-header {
  display: flex;
  margin-bottom: 32rpx;
  gap: 24rpx;
  padding: 24rpx 0;
}

.book-cover {
  width: 160rpx;
  height: 224rpx;
  border-radius: 12rpx;
  object-fit: cover;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.book-summary {
  font-size: 26rpx;
  color: #666;
}

.category-group {
  margin-bottom: 32rpx;
}

.category-title {
  font-size: 34rpx; /* ✅ 提升字体大小 */
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #2a70ff;
  line-height: 1.6;
}

.sticky-title {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f8f8;
  padding: 12rpx 0;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.section-item {
  background: #ffffff;
  padding: 28rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  transition: transform 0.1s ease;
}

.section-title {
  font-size: 32rpx;
  color: #333;
}

.pressable:active {
  transform: scale(0.98);
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
