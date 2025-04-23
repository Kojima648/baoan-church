<template>
  <view class="article-item" @click="handleClick">
    <image class="cover" :src="cover" mode="aspectFill" />
    <view class="content">
      <view class="title">{{ title }}</view>
      <view class="info">
        <text class="views">阅读 {{ views }}</text>
        <text class="date">{{ dateStr }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    title: String,
    views: Number,
    dateStr: String,
    cover: String,
    onClick: Function
  },
  methods: {
    handleClick() {
      this.onClick && this.onClick();
    }
  }
};
</script>

<style scoped lang="scss">
.article-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.cover {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    line-height: 1.5;
    max-height: 3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .info {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: #999;
    margin-top: 20rpx;
  }
}
</style>
