<template>
  <scroll-view scroll-y class="page">
    <!-- 圣言横幅 -->
    <view class="banner-box">
      <image
        class="banner-img"
        src="https://picsum.photos/600/300"
        mode="aspectFill"
      />
      <view class="banner-text">
        <view class="verse">我见了主。</view>
        <view class="ref">若 20:18</view>
      </view>
    </view>

    <!-- 瞻礼单 -->
    <view class="section-box festival-section">
      <!-- 左侧礼仪色条 -->
      <view
        class="liturgical-color-bar"
        :style="getLiturgicalColorStyle(todayFestival.liturgicalColor)"
      ></view>

      <!-- 中间标题和节日 -->
      <view class="festival-item-row">
        <view class="festival-item-left">
          <view class="festival-title">瞻礼单</view>
          <view class="festival-label">{{ currentFestivalTitle }}</view>
        </view>
        <view class="festival-item-right">
          <text>{{ todayFestival.dateStr }}</text>
          <text class="arrow-icon"> ＞</text> <!-- 这里加箭头 -->
        </view>

      </view>
    </view>

    <!-- 每日灵修 -->
    <view class="section-box">
      <view class="section-title">每日灵修</view>
      <view class="devotion-grid">
        <view
          class="devotion-item"
          v-for="(item, index) in devotionItems"
          :key="index"
        >
          <view class="icon">{{ item.icon }}</view>
          <view class="title">{{ item.title }}</view>
          <view class="sub">{{ item.sub }}</view>
        </view>
      </view>
    </view>

    <!-- 常用书籍 -->
    <view class="section-box book-section">
      <view class="section-title">常用书籍</view>
      <view class="book-background">
        <view
          class="book-card"
          v-for="(book, index) in books"
          :key="index"
        >
          <image class="book-image" :src="book.img" mode="aspectFill" />
          <view class="book-title">{{ book.title }}</view>
        </view>
      </view>
    </view>

    <view style="height: 5rpx;"></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Config } from '@/utils/config.js'

// 今日节日信息
const todayFestival = ref({
  titleList: [],
  dateStr: '',
  liturgicalColor: ''
})

// 当前显示的节日标题
const currentFestivalTitle = ref('今日暂无瞻礼')

let scrollTimer: any = null
let scrollIndex = 0

// 每日灵修数据
const devotionItems = [
  { title: '公教日课', sub: '复活节庆期第三日', icon: '🕯️' },
  { title: '思高圣经', sub: '创 1', icon: '📖' },
  { title: '每日读经', sub: '中文读经', icon: '🙏' },
  { title: 'Readings', sub: '英文读经', icon: '🍷' }
]

// 常用书籍数据
const books = [
  { title: '《天韵》', img: 'https://picsum.photos/id/1005/200/280' },
  { title: '公私诵', img: 'https://picsum.photos/id/1011/200/280' },
  { title: '常用经文', img: 'https://picsum.photos/id/1015/200/280' },
  { title: '教友生活', img: 'https://picsum.photos/id/1021/200/280' },
  { title: '圣月默想', img: 'https://picsum.photos/id/1031/200/280' },
  { title: '礼仪手册', img: 'https://picsum.photos/id/1043/200/280' }
]

// 页面加载
onMounted(() => {
  loadTodayFestival()
})

// 页面卸载
onUnmounted(() => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
  }
})

// 跳转到瞻礼单列表页
function goFestivalList() {
  uni.navigateTo({
    url: '/pages/festival/festival-list'
  })
}

// 加载今日瞻礼单
function loadTodayFestival() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const yearMonth = `${year}-${month}`
  const todayDay = day

  const url = Config.festival.getFestivalListUrl(yearMonth)

  uni.request({
    url,
    success: (res) => {
      const list = res.data?.data || []
      const todayIndex = Number(todayDay) - 1
      const festival = list[todayIndex]

      if (festival) {
        const rawFestival = festival.节日 || ''
        const titles = extractFestivalTitles(rawFestival)

        todayFestival.value.titleList = titles.length > 0 ? titles : ['今日暂无瞻礼']
        todayFestival.value.dateStr = `${month}月${day}日`
        todayFestival.value.liturgicalColor = festival.礼仪 || '白'
        startScrollFestivalTitles()
      } else {
        todayFestival.value.titleList = ['今日暂无瞻礼']
        todayFestival.value.dateStr = `${month}月${day}日`
        todayFestival.value.liturgicalColor = '白'
      }
    },
    fail: (err) => {
      todayFestival.value.titleList = ['今日瞻礼加载失败']
      todayFestival.value.dateStr = `${month}月${day}日`
      todayFestival.value.liturgicalColor = '白'
    }
  })
}

// 提取所有节日条目
function extractFestivalTitles(html: string) {
  if (!html) return []

  try {
    html = html.replace(/\n/g, '')
    const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/g)

    if (!liMatches) return []

    return liMatches.map((li) => {
      const aMatch = li.match(/<a[^>]*>(.*?)<\/a>/)
      if (aMatch && aMatch[1]) {
        return aMatch[1].trim()
      } else {
        return li.replace(/<[^>]+>/g, '').trim()
      }
    })
  } catch (e) {
    return []
  }
}

// 开始滚动节日标题
function startScrollFestivalTitles() {
  if (scrollTimer) {
    clearInterval(scrollTimer)
  }

  scrollIndex = 0
  currentFestivalTitle.value = todayFestival.value.titleList[0] || '今日暂无瞻礼'

  scrollTimer = setInterval(() => {
    const titles = todayFestival.value.titleList
    if (titles.length === 0) return

    scrollIndex = (scrollIndex + 1) % titles.length
    currentFestivalTitle.value = titles[scrollIndex]
  }, 3000)
}

// 获取礼仪色条样式
function getLiturgicalColorStyle(color: string) {
  switch (color) {
    case '白':
      return { background: '#ffffff', border: '1rpx solid #ccc' }
    case '红':
      return { background: '#ff4d4f' }
    case '绿':
      return { background: '#52c41a' }
    case '紫':
      return { background: '#722ed1' }
    case '玫':
      return { background: '#ff69b4' }
    default:
      return { background: '#cccccc' }
  }
}
</script>

<style scoped>
.page {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.banner-box {
  position: relative;
  margin: 24rpx;
  border-radius: 20rpx;
  overflow: hidden;
  height: 360rpx;
}
.banner-img {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.banner-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 64, 0.6), transparent);
  color: white;
  padding: 16rpx 24rpx;
}
.verse {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}
.ref {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 瞻礼单区域布局 */
.festival-section {
  display: flex;
  align-items: stretch;
  margin: 0 24rpx 24rpx;
}

/* 左侧礼仪色条 */
.liturgical-color-bar {
  width: 8rpx;
  border-radius: 6rpx;
  margin-right: 8rpx;
  background: #ccc;
}

/* 中间内容 */
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

/* 日期固定右边 */
.festival-item-right {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #333;
  margin-left: 12rpx;
}

/* 每日灵修 */
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin: 0 24rpx 16rpx;
  color: #333;
}
.section-box {
  margin: 0 24rpx 24rpx;
}

.devotion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 4rpx;
}
.devotion-item {
  position: relative;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.icon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 32rpx;
}
.title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}
.sub {
  font-size: 22rpx;
  color: #999;
}

/* 常用书籍 */
.book-background {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx 12rpx;
  padding: 16rpx 12rpx 40rpx;
  background-color: #f0f2f5;
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
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.08);
}
.book-title {
  font-size: 22rpx;
  margin-top: 8rpx;
  text-align: center;
  color: #222;
}
</style>
