<template>
  <scroll-view scroll-y class="detail-page">
    <view v-if="festival" class="article-wrapper">
      <view class="article-box">
        <view class="article-header">
          <view class="article-title">{{ festival.title }}</view>
          <view v-if="festival.description" class="article-subtitle">{{ festival.description }}</view>
          <view v-if="festival.memorial_day" class="article-date">📅 {{ festival.memorial_day }}</view>
        </view>
        <view class="divider" />
        <view class="article-body">
          <!-- 格式化后内容 -->
          <u-parse :content="formattedContent" />
        </view>
      </view>
    </view>
    <view v-else class="empty-box">
      <text>⛔ 未找到节日</text>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { Config } from '@/utils/config'

const festival = ref<any>(null)

// 格式化 content: 替换 img 路径 + 给 <p> 与 <img> 增加自定义类
const formattedContent = computed(() => {
  if (!festival.value) return ''
  const baseUrl = Config.festival.festivalImageBaseUrl.replace(/\/+$/, '') + '/'
  let html = festival.value.content
  // 替换图片路径
  html = html.replace(/src="\/(.*?)"/g, (_match, p1) => {
    const segments = p1.split('/')
    const encoded = segments.map(seg => encodeURIComponent(seg)).join('/')
    return `src="${baseUrl}${encoded}"`
  })
  // 给段落加 class
  html = html.replace(/<p(?! class=)/g, '<p class="article-paragraph"')
  // 给 img 加自定义 class，使样式可选
  html = html.replace(/<img /g, '<img class="article-img" ')
  return html
})

onLoad(async (options) => {
  const scode = decodeURIComponent(options?.scode || '')
  const description = decodeURIComponent(options?.description || '')
  const memorial_day = decodeURIComponent(options?.memorial_day || '')

  if (!scode) return

  try {
    const res = await uni.request({ url: Config.festival.fullFestivalDetailUrl, method: 'GET' })
    const detailList = res.data
    const matched = detailList.find((item: any) => item.folder_name === scode)

    if (matched) {
      matched.description = description.trim() || null
      matched.memorial_day = memorial_day.trim() || null

      festival.value = matched
    }
  } catch (err) {
    console.error('加载节日详情失败:', err)
  }
})
</script>

<style scoped>
.detail-page {
  padding: 0;
  background-color: transparent;
  font-family: Arial, sans-serif;
}

.article-wrapper {
  max-width: 700rpx;
  margin: 0 auto;
  padding: 24rpx;
  box-sizing: border-box;
}

.article-header {
  margin: 20rpx 0;
}

.article-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 8rpx;
}

.article-subtitle {
  font-size: 26rpx;
  font-style: italic;
  color: #555;
  text-align: center;
  margin-bottom: 10rpx;
}

.article-date {
  font-size: 24rpx;
  color: #888;
  text-align: right;
  padding-right: 8rpx;
  margin-bottom: 8rpx;
}

.divider {
  border-bottom: 1rpx solid #ddd;
  margin: 20rpx 0;
}

.article-body {
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
  text-align: justify;
}

/* 居中图片，使用自定义 class */
::v-deep .article-img {
  display: block !important;
  margin: 20rpx auto !important;
  max-width: 100% !important;
}

/* 段落样式，使用自定义类 */
::v-deep .article-paragraph {
  margin-bottom: 20rpx;
  text-align: justify;
  font-size: 28rpx;
  line-height: 1.8;
}

.empty-box {
  padding: 80rpx 40rpx 40rpx;
  text-align: center;
  color: #bbb;
  font-size: 28rpx;
}
</style>