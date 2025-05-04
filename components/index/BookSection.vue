<template>
  <view class="section-box book-section">
    <view class="section-title">常用书籍</view>
    <view class="book-background">
      <view
        class="book-card pressable"
        v-for="(book, index) in books"
        :key="index"
        @click="onTap(book)"
      >
        <image
          class="book-image"
          :src="Config.resolveStaticUrl(book.cover)"
          mode="aspectFill"
        />

        <view class="book-title">{{ book.title }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config'

const books = ref<Array<{
  book_id: string
  title: string
  cover: string
}>>([])

// ✅ 统一封面路径解析
function getCoverFullUrl(coverPath: string) {
  return Config.resolveStaticUrl(coverPath)
}


function onTap(book: any) {
  console.log('[点击] 书籍项：', book.title)
  uni.navigateTo({
    url: `/pages/book/book-index?id=${book.book_id}`
  })
}

onMounted(() => {
  uni.request({
    url: Config.catholicBooks.listUrl,
    success: (res) => {
      books.value = res.data
    },
    fail: (err) => {
      console.error('加载常用书籍失败:', err)
    }
  })
})
</script>

<style scoped>
.section-box {
  margin: 0 24rpx 24rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #333;
}
.book-background {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx 12rpx;
  padding: 16rpx 12rpx 40rpx;
  background-color: #f6f6f6;
  border-radius: 20rpx;
}
.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.book-image {
  width: 150rpx;
  height: 210rpx;
  border-radius: 8rpx;
  object-fit: cover;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.2);
}
.book-title {
  font-size: 22rpx;
  margin-top: 8rpx;
  text-align: center;
  color: #222;
}
.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.99);
}
</style>
