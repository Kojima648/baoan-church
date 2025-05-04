<template>
  <view class="book-index-page">
    <scroll-view scroll-y class="scroll-area" :scroll-top="scrollTop">
      <!-- 封面与简介 -->
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

      <!-- 搜索栏 -->
      <view class="search-bar">
        <input v-model="keyword" placeholder="搜索章节标题..." class="search-input" />
      </view>

      <!-- 分类章节列表 -->
      <view
        v-for="(group, category) in groupedSections"
        :key="category"
        class="category-group"
      >
        <view class="category-title sticky-title">{{ category }}</view>
        <view class="section-list">
          <view
            class="section-item pressable"
            v-for="(section, index) in group.filter(s => s.title.includes(keyword))"
            :key="index"
            @click="onSelectSection(section)"
          >
            <view class="section-title" v-html="highlightMatch(section.title)"></view>
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
const keyword = ref('')
const scrollTop = ref(0)
const showBackTop = ref(false)

function groupByCategory(sections: any[]) {
  const result: Record<string, any[]> = {}
  sections.forEach(section => {
    const cat = section.category || '未分类'
    if (!result[cat]) result[cat] = []
    result[cat].push(section)
  })
  return result
}

// 高亮关键词
function highlightMatch(text: string): string {
  if (!keyword.value) return text
  const escaped = keyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(escaped, 'gi'),
    match => `<span style="color: red;">${match}</span>`
  )
}

function onSelectSection(section: any) {
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
  const url = Config.resolveStaticUrl(`/config/index/catholic-books/index/${bookId.value}_index.json`)
  uni.request({
    url,
    success: (res) => {
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
  padding: 0;
  height: 100vh;
  background-color: #f6f7f9;
}

.scroll-area {
  height: 100%;
}

.book-header {
  display: flex;
  padding: 32rpx 24rpx;
  background: #fff;
  gap: 24rpx;
  border-bottom: 1rpx solid #e4e4e4;
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

.search-bar {
  padding: 20rpx 24rpx;
  background-color: #ffffff;
}

.search-input {
  width: 100%;
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 32rpx;
  background-color: #f3f3f3;
  font-size: 28rpx;
  box-sizing: border-box;
}

/* 分类分组 */
.category-group {
  margin-bottom: 48rpx;
}

.category-title {
  font-size: 36rpx;
  font-weight: bold;
  padding: 18rpx 32rpx;
  color: #2a70ff;
  background-color: #eef2f7;
  width: 100%;
  box-sizing: border-box;
}

.sticky-title {
  position: sticky;
  top: 0;
  z-index: 5;
}

/* 列表容器 */
.section-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 0 24rpx;
}

.section-item {
  background: #fff;
  padding: 28rpx 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
  transition: background 0.2s ease;
}

.section-item:active {
  background: #f3f3f3;
}

.section-title {
  font-size: 34rpx;
  color: #222;
  word-break: break-word;
}

.pressable:active {
  transform: scale(0.995);
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
