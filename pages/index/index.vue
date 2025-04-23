<template>
  <scroll-view scroll-y class="page">
    <!-- 顶部导航 -->
    <u-navbar
      title="宝安天主堂"
      :autoBack="false"
      back-icon=""
      leftIcon=""
      safeAreaInsetTop
      placeholder
    />

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
          label="复活节庆期第三日"
          value="04月22日"
          isLink
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

    <!-- ✅ 添加底部占位区域，避免内容紧贴 tab -->
    <view style="height: 5rpx;"></view>
  </scroll-view>
</template>

<script setup>
const devotionItems = [
  { title: '公教日课', sub: '复活节庆期第三日', icon: '🕯️' },
  { title: '思高圣经', sub: '创 1', icon: '📖' },
  { title: '每日读经', sub: '中文读经', icon: '🙏' },
  { title: 'Readings', sub: '英文读经', icon: '🍷' }
]

const books = [
  { title: '《天韵》', img: 'https://picsum.photos/id/1005/200/280' },
  { title: '公私诵', img: 'https://picsum.photos/id/1011/200/280' },
  { title: '常用经文', img: 'https://picsum.photos/id/1015/200/280' },
  { title: '教友生活', img: 'https://picsum.photos/id/1021/200/280' },
  { title: '圣月默想', img: 'https://picsum.photos/id/1031/200/280' },
  { title: '礼仪手册', img: 'https://picsum.photos/id/1043/200/280' }
]
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f7f7f7;
  position: relative;
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
.book-section {
  /* 去掉不必要的 margin-bottom，避免多余留白 */
}

.highlighted-cell-group {
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.2s;
}
.highlighted-cell-group:active {
  transform: scale(0.98);
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
  transition: transform 0.2s;
}
.devotion-item:active {
  transform: scale(0.97);
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
  transition: transform 0.2s;
}
.book-card:active {
  transform: scale(0.97);
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
