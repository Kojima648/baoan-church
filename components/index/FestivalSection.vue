--- FestivalSection.vue
<template>
  <view class="section-box festival-section pressable" @click="goFestivalList">
    <view
      class="liturgical-color-bar"
      :style="getLiturgicalColorStyle(todayFestival.liturgicalColor)"
    ></view>

    <view class="festival-item-row">
      <view class="festival-item-left">
        <view class="festival-title">瞻礼单</view>
        <view class="festival-label">{{ currentFestivalTitle }}</view>
      </view>
      <view class="festival-item-right">
        <text>{{ todayFestival.dateStr }}</text>
        <text class="arrow-icon"> ＞</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Config } from '@/utils/config.js'

// 当前节日信息
const todayFestival = ref({
  titleList: [],
  dateStr: '',
  liturgicalColor: ''
})
const currentFestivalTitle = ref('今日暂无瞻礼')

let scrollTimer: any = null
let scrollIndex = 0

// 生命周期：加载数据
onMounted(() => {
  loadTodayFestival()
})
onUnmounted(() => {
  if (scrollTimer) clearInterval(scrollTimer)
})

// 提取节日标题
function extractFestivalTitles(html: string): string[] {
  if (!html) return []
  try {
    html = html.replace(/\n/g, '')
    const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/g)
    if (!liMatches) return []
    return liMatches.map((li) => {
      const aMatch = li.match(/<a[^>]*>(.*?)<\/a>/)
      return aMatch?.[1]?.trim() || li.replace(/<[^>]+>/g, '').trim()
    })
  } catch (e) {
    return []
  }
}

// 加载今日节日数据
function loadTodayFestival() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const yearMonth = `${year}-${month}`
  const url = Config.festival.getFestivalListUrl(yearMonth)

  uni.request({
    url,
    success: (res) => {
      const list = res.data?.data || []
      const festival = list[Number(day) - 1]
      if (festival) {
        const titles = extractFestivalTitles(festival.节日)
        todayFestival.value.titleList = titles.length ? titles : ['今日暂无瞻礼']
        todayFestival.value.dateStr = `${month}月${day}日`
        todayFestival.value.liturgicalColor = festival.礼仪 || '白'
        startScrollFestivalTitles()
      } else {
        todayFestival.value = {
          titleList: ['今日暂无瞻礼'],
          dateStr: `${month}月${day}日`,
          liturgicalColor: '白'
        }
      }
    },
    fail: () => {
      todayFestival.value = {
        titleList: ['今日瞻礼加载失败'],
        dateStr: `${month}月${day}日`,
        liturgicalColor: '白'
      }
    }
  })
}

// 滚动节日标题
function startScrollFestivalTitles() {
  if (scrollTimer) clearInterval(scrollTimer)
  scrollIndex = 0
  currentFestivalTitle.value = todayFestival.value.titleList[0] || '今日暂无瞻礼'
  scrollTimer = setInterval(() => {
    const titles = todayFestival.value.titleList
    if (titles.length === 0) return
    scrollIndex = (scrollIndex + 1) % titles.length
    currentFestivalTitle.value = titles[scrollIndex]
  }, 3000)
}

// 获取礼仪颜色样式
function getLiturgicalColorStyle(color: string) {
  switch (color) {
    case '白': return { background: '#ffffff', border: '1rpx solid #ccc' }
    case '红': return { background: '#ff4d4f' }
    case '绿': return { background: '#52c41a' }
    case '紫': return { background: '#722ed1' }
    case '玫': return { background: '#ff69b4' }
    default: return { background: '#cccccc' }
  }
}

// 点击跳转
function goFestivalList() {
  console.log('[点击] 瞻礼单区块')
  uni.navigateTo({
    url: '/pages/festival/festival-list?goto=today'
  })
}

</script>

<style scoped>
.section-box {
  margin: 0 24rpx 24rpx;
}
.festival-section {
  display: flex;
  align-items: stretch;
}

.liturgical-color-bar {
  width: 8rpx;
  border-radius: 6rpx;
  margin-right: 8rpx;
  background: #ccc;
}

.festival-item-row {
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
  padding: 24rpx;
}
.festival-item-left {
  flex: 1;
  min-width: 0;
}
.festival-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}
.festival-label {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.festival-item-right {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #333;
  margin-left: 12rpx;
}
.arrow-icon {
  margin-left: 8rpx;
}
.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.995);
}
</style>
