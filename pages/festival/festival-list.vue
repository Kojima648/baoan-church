<template>
  <scroll-view class="festival-list-page" scroll-y>
    <view v-for="(item, index) in festivalData" :key="index" class="festival-item">
      <view class="left-section">
        <view class="date-box">
          <view class="liturgical-color-bar" :style="getLiturgicalColorStyle(item['礼仪'])"></view>
          <view class="date-text">
            <text class="day">{{ item['主历'] }}</text>
            <text class="weekday">周{{ item['星期'] }}</text>
          </view>
        </view>
      </view>

      <view class="right-section">
        <view class="festival-lines">
          <view
            v-for="(line, i) in parseFestivalLines(item['节日'])"
            :key="i"
            class="festival-line"
            @click="onFestivalItemClick(line)"
          >
            <text :class="{ 'link-text': !!line.link }">{{ line.text }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-viewport-spacer"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config'

const festivalData = ref([])

onMounted(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const filePath = Config.festival.getFestivalListUrl(`${year}-${month}`)

  uni.request({
    url: filePath,
    success: (res) => {
      festivalData.value = res.data?.data || []
    },
    fail: () => {
      console.error('[加载失败]', filePath)
    }
  })
})

function getLiturgicalColorStyle(color: string) {
  const colorMap = {
    '白': '#ddd',
    '红': '#ff4d4f',
    '绿': '#52c41a',
    '紫': '#722ed1',
    '黑': '#333333',
    '玫': '#ff69b4'
  }
  return {
    backgroundColor: colorMap[color] || '#cccccc'
  }
}

function parseFestivalLines(html: string): { text: string; link?: string }[] {
  if (!html) return []
  const matches = [...html.matchAll(/<li>\s*(?:<a href="([^"]+)">)?([^<]+)(?:<\/a>)?\s*<\/li>/g)]
  return matches.map((m) => ({
    link: m[1],
    text: m[2].trim()
  }))
}

function onFestivalItemClick(line: { text: string; link?: string }) {
  if (!line.link) return
  const url = line.link.startsWith('http')
    ? line.link
    : `/pages/festival/detail?link=${encodeURIComponent(line.link)}`
  uni.navigateTo({ url })
}
</script>

<style scoped>
.festival-list-page {
  background-color: #ffffff;
  padding: 20rpx 0 40rpx;
}

.festival-item {
  display: flex;
  padding: 36rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80rpx;
  margin-right: 60rpx;
  position: relative;
}

.date-box {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8rpx 0;
  padding-left: 24rpx; /* 调整文字离礼仪色条距离 */
  min-height: 80rpx;
}

.liturgical-color-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 6rpx;
  height: 100%;
  border-radius: 3rpx;
}

.date-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 保证上下左对齐 */
  justify-content: center;
  width: 60rpx; /* 固定宽度使齐整 */
}

.day {
  font-size: 32rpx;
  font-weight: bold;
  color: #111;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  line-height: 1.1;
  margin-bottom: 32rpx;
}


.weekday {
  font-size: 28rpx;
  color: #888;
  font-family: sans-serif;
  line-height: 1.1;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.festival-lines {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.festival-line {
  font-size: 30rpx;
  color: #333;
  line-height: 44rpx;
  word-break: break-word;
}

.link-text {
  color: #333;
}

.bottom-viewport-spacer {
  height: 10rpx;
}
</style>

