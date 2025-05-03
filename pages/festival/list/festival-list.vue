<!-- 瞻礼单页面 -->
<!-- 瞻礼单页面 -->
<template>
  <view class="container">
    <FestivalHeader :meta="metaData" @date-change="onMonthChange" />

    <scroll-view
      class="festival-scroll"
      scroll-y
      :style="{ height: 'calc(100vh - 80rpx - 4vh)' }"
      :scroll-top="scrollTop"
      scroll-with-animation
    >
      <view
        v-for="(item, index) in festivalData"
        :key="index"
        :id="`festival-${index}`"
        class="festival-item"
        :class="{ 'festival-today': item._isToday }"
      >
        <view v-if="item._isToday" class="today-tag">今日</view>

        <view class="left-section">
          <view class="date-box">
            <view
              class="liturgical-color-bar"
              :style="getLiturgicalColorStyle(item['礼仪'])"
            ></view>
            <view class="date-text">
              <text class="day" :class="{ today: item._isToday }">
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
const fullFestivalConfig = ref<any[]>([])
const scrollTop = ref(0)
const metaData = ref({})
const todayIndex = ref(-1)

// ✅ 获取北京时间字符串
function getBeijingTodayStr(): string {
  const now = new Date()
  const beijingOffset = -8 * 60
  const localOffset = now.getTimezoneOffset()
  const offsetDiff = (beijingOffset - localOffset) * 60 * 1000
  const beijingTime = new Date(now.getTime() + offsetDiff)
  const y = beijingTime.getFullYear()
  const m = String(beijingTime.getMonth() + 1).padStart(2, '0')
  const d = String(beijingTime.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const todayStr = getBeijingTodayStr()
// console.log('[今日北京时间]', todayStr)

// ✅ 标记今日节日，并返回 index
function tagTodayFlag(items: any[]) {
  let index = -1
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemDateStr = `${metaData.value.year}-${String(metaData.value.month).padStart(2, '0')}-${String(item['主历']).padStart(2, '0')}`
    const isToday = itemDateStr === todayStr
    item._isToday = isToday
    if (isToday) index = i
    // console.log('[isToday 标记]', { index: i, itemDateStr, todayStr, result: isToday })
  }
  return index
}

function getLiturgicalColorStyle(color: string) {
  const colorMap: Record<string, string> = {
    '白': '#eeeeee', '红': '#ff4d4f', '绿': '#52c41a',
    '紫': '#722ed1', '黑': '#333333', '玫': '#ff69b4'
  }
  return { backgroundColor: colorMap[color] || '#cccccc' }
}

function parseFestivalLines(html: string): { text: string; link?: string }[] {
  if (!html) return []
  const matches = [...html.matchAll(/<li>\s*(?:<a href="([^"]+)">)?([^<]+)(?:<\/a>)?\s*<\/li>/g)]
  return matches.map((m) => ({ link: m[1], text: m[2].trim() }))
}

function onFestivalItemClick(line: { text: string; link?: string }) {
  if (!line.link) return
  const match = line.link.match(/\?scode=([a-zA-Z0-9_]+)/)
  if (!match) return console.warn('未找到 scode 参数')

  const scode = match[1]
  let target = null
  for (const section of fullFestivalConfig.value) {
    const found = section.festivals?.find((item: any) => item.code === scode)
    if (found) {
      target = found
      break
    }
  }

  const url = target
    ? `/pages/festival/calendar/detail?scode=${encodeURIComponent(target.folder_name)}&description=${encodeURIComponent(target.description || '')}&memorial_day=${encodeURIComponent(target.memorial_day || '')}`
    : `/pages/festival/calendar/detail?scode=${encodeURIComponent(scode)}`

  uni.navigateTo({ url })
}

function loadFestivalList(yearMonth: string) {
  const filePath = Config.festival.getFestivalListUrl(yearMonth)
  // console.log('[加载节日数据]', filePath)

  uni.request({
    url: filePath,
    success: (res) => {
      const list = res.data?.data || []
      metaData.value = res.data?.meta || {}
      // console.log('[节日数据加载成功]', list.length, '条', metaData.value)

      const todayIdx = tagTodayFlag(list)
      todayIndex.value = todayIdx
      // console.log('[今日节日 index]', todayIdx)
      festivalData.value = list

      if (todayIdx !== -1) {
        nextTick(() => {
          const query = uni.createSelectorQuery()
          query.select('.festival-scroll').boundingClientRect()
          query.select(`#festival-${todayIdx}`).boundingClientRect()
          query.exec(([scrollViewRect, itemRect]) => {
            if (scrollViewRect && itemRect) {
              scrollTop.value = itemRect.top - scrollViewRect.top
            } else {
              console.warn('[未找到今日节日元素]', todayIdx)
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
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  // console.log('[onMounted 当前年月]', yearMonth)
  loadFestivalList(yearMonth)

  uni.request({
    url: Config.festival.fullFestivalConfigUrl,
    method: 'GET',
    success: (res) => {
      fullFestivalConfig.value = res.data || []
      // console.log('[节日详情已加载]', fullFestivalConfig.value.length)
    },
    fail: () => {
      console.error('[节日详情加载失败]')
    }
  })
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
