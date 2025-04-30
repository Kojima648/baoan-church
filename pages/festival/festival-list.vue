<template>
  <view class="container">
    <!-- 头部组件传入 meta 数据，监听选择变化 -->
    <FestivalHeader :meta="metaData" @date-change="onMonthChange" />

    <scroll-view
      class="festival-scroll"
      scroll-y
      :style="{ height: 'calc(100vh - 80rpx - 4vh)' }"
      :scroll-top="scrollTop"
      scroll-with-animation
      ref="scrollView"
    >
      <view
        v-for="(item, index) in festivalData"
        :key="index"
        :id="`festival-${index}`"
        class="festival-item"
        :class="{ 'festival-today': isToday(item) }"
      >
        <view v-if="isToday(item)" class="today-tag">今日</view>

        <view class="left-section">
          <view class="date-box">
            <view
              class="liturgical-color-bar"
              :style="getLiturgicalColorStyle(item['礼仪'])"
            ></view>
            <view class="date-text">
              <text class="day" :class="{ today: isToday(item) }">
                {{ item['主历'] }}
              </text>
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
              <text :class="{ 'link-text': !!line.link }">
                {{ line.text }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Config } from '@/utils/config'
import FestivalHeader from '@/components/festival/FestivalHeader.vue'

const festivalData = ref([])
const scrollTop = ref(0)
const metaData = ref({})

const today = new Date()
const todayDay = String(today.getDate()).padStart(2, '0')
const todayWeek = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()]

function isToday(item: any): boolean {
  return item['主历'] === todayDay && item['星期'] === todayWeek
}

function getLiturgicalColorStyle(color: string) {
  const colorMap: Record<string, string> = {
    '白': '#eeeeee',
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
  const matches = [...html.matchAll(/<li>\s*(?:<a href=\"([^\"]+)\">)?([^<]+)(?:<\/a>)?\s*<\/li>/g)]
  return matches.map((m) => ({
    link: m[1],
    text: m[2].trim()
  }))
}

function onFestivalItemClick(line: { text: string; link?: string }) {
  if (!line.link) return
  const match = line.link.match(/\?scode=([a-zA-Z0-9]+)/)
  if (match) {
    console.log(`scode=${match[1]}`)
  } else {
    console.log('未找到 scode 参数')
  }
}

function loadFestivalList(yearMonth: string) {
  const filePath = Config.festival.getFestivalListUrl(yearMonth)
  console.log('[请求节日数据]', filePath)

  uni.request({
    url: filePath,
    success: (res) => {
      const list = res.data?.data || []
      festivalData.value = list
      metaData.value = res.data?.meta || {}
      console.log('[节日数据加载成功]', list.length, '条')

      const index = list.findIndex((item: any) => isToday(item))
      if (index !== -1) {
        nextTick(() => {
          const query = uni.createSelectorQuery()
          query.select('.festival-scroll').boundingClientRect()
          query.select(`#festival-${index}`).boundingClientRect()
          query.exec(([scrollViewRect, itemRect]) => {
            if (scrollViewRect && itemRect) {
              const relativeTop = itemRect.top - scrollViewRect.top
              console.log('[计算滚动]', { relativeTop })
              scrollTop.value = relativeTop
            } else {
              console.warn('[未找到 festival]', index)
            }
          })
        })
      }
    },
    fail: () => {
      console.error('[加载失败]', filePath)
    }
  })
}

function onMonthChange(yearMonth: string) {
  loadFestivalList(yearMonth)
}

onMounted(() => {
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const yearMonth = `${year}-${month}`
  loadFestivalList(yearMonth)
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.festival-scroll {
  width: 100%;
}

.festival-item {
  position: relative;
  display: flex;
  padding: 36rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.festival-today {
  background-color: #f3faff;
  border-left: 6rpx solid #3c9cff;
  border-radius: 8rpx;
}

.today-tag {
  position: absolute;
  top: 12rpx;
  right: 24rpx;
  font-size: 20rpx;
  color: #ffffff;
  background-color: #3c9cff;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
  z-index: 1;
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
  padding-left: 24rpx;
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
  align-items: flex-start;
  justify-content: center;
  width: 60rpx;
}

.day {
  font-size: 32rpx;
  font-weight: bold;
  color: #111;
  line-height: 1.1;
  margin-bottom: 32rpx;
}

.day.today {
  background-color: #3c9cff;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 2rpx 10rpx;
}

.weekday {
  font-size: 28rpx;
  color: #888;
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
</style>
