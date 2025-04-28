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
    <view class="section-box">
      <u-cell-group class="highlighted-cell-group">
        <u-cell
          title="瞻礼单"
          :label="todayFestival.title"
          :value="todayFestival.dateStr"
          isLink
          @click="goFestivalList"
        />
      </u-cell-group>
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
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config.js'

// 今日节日信息
const todayFestival = ref({
  title: '今日暂无瞻礼',
  dateStr: ''
})

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

// 页面加载时
onMounted(() => {
  loadTodayFestival()
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

  console.log('[Festival] 今天日期:', `${year}-${month}-${day}`)
  console.log('[Festival] 请求URL:', url)

  uni.request({
    url,
    success: (res) => {
      const list = res.data?.data || []
      console.log('[Festival] 返回节日数据：', list)

      const todayIndex = Number(todayDay) - 1
      const festival = list[todayIndex]

      if (festival) {
        console.log('[Festival] 找到今日节日:', festival)

        const rawFestival = festival.节日 || ''
        const cleanFestival = extractFestivalTitle(rawFestival)

        todayFestival.value.title = cleanFestival || '今日暂无瞻礼'
        todayFestival.value.dateStr = `${month}月${day}日`
      } else {
        console.warn('[Festival] 没有找到今日节日')
        todayFestival.value.title = '今日暂无瞻礼'
        todayFestival.value.dateStr = `${month}月${day}日`
      }
    },
    fail: (err) => {
      console.error('[Festival] 请求失败', err)
      todayFestival.value.title = '今日瞻礼加载失败'
      todayFestival.value.dateStr = `${month}月${day}日`
    }
  })
}

// 提取节日第一个 <li> 的纯文字
function extractFestivalTitle(html) {
  if (!html) return ''

  try {
    html = html.replace(/\n/g, '') // 清理换行符
    const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/g)

    if (liMatches && liMatches.length > 0) {
      let firstLi = liMatches[0]

      // 先找 <a> 标签内部内容
      const aMatch = firstLi.match(/<a[^>]*>(.*?)<\/a>/)
      if (aMatch && aMatch[1]) {
        return aMatch[1].trim()
      } else {
        // 没有<a>，直接去除HTML标签
        return firstLi.replace(/<[^>]+>/g, '').trim()
      }
    }
    return ''
  } catch (e) {
    console.error('[Festival] 提取节日错误:', e)
    return ''
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

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin: 0 24rpx 16rpx;
  color: #333;
}
.section-box {
  margin: 0 24rpx 24rpx;
}
.highlighted-cell-group {
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
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
