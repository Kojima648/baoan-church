<template>
  <view class="book-index-page">
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
      <view class="category-title">{{ category }}</view>
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
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Config } from '@/utils/config'
import { onLoad } from '@dcloudio/uni-app'

const bookId = ref('')
const bookData = ref<any>({
  title: '',
  summary: '',
  cover: '',
  sections: []
})

const groupedSections = ref<Record<string, any[]>>({})

// ✅ 分组函数
function groupByCategory(sections: any[]) {
  const result: Record<string, any[]> = {}
  sections.forEach(section => {
    if (!result[section.category]) result[section.category] = []
    result[section.category].push(section)
  })
  return result
}

// ✅ 跳转章节
function onSelectSection(section: any) {
  console.log('[跳转章节]', section.path)
  uni.navigateTo({
    url: `/pages/book/book-detail?bookId=${bookId.value}&path=${encodeURIComponent(section.path)}`
  })
}

// ✅ 页面加载逻辑
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

      // ✅ 打印封面路径解析
      console.log('[封面路径解析]', bookData.value.cover, '➡️', Config.resolveStaticUrl(bookData.value.cover))
    },
    fail: (err) => {
      console.error('加载书籍章节失败', err)
    }
  })
})
</script>

<style scoped>
.book-index-page {
  padding: 24rpx;
}
.book-header {
  display: flex;
  margin-bottom: 32rpx;
  gap: 24rpx;
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
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}
.book-summary {
  font-size: 24rpx;
  color: #666;
}
.category-group {
  margin-bottom: 32rpx;
}
.category-title {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #2a70ff;
}
.section-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.section-item {
  background: #f7f7f7;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.section-title {
  font-size: 24rpx;
  color: #333;
}
.pressable:active {
  transform: scale(0.98);
  transition: transform 0.08s ease;
}
</style>
