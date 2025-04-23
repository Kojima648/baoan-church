<template>
  <view class="page">
    <!-- 类目滑动标签 -->
    <view class="tabs-scroll-container">
      <scroll-view scroll-x class="tabs" scroll-with-animation @scroll="onTabScroll">
        <view class="tab-wrapper">
          <view
            class="tab"
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ active: currentTab === index }"
            @click="changeTab(index)"
          >
            {{ item.name }}
          </view>
        </view>
      </scroll-view>
      <view v-if="showHint" class="tabs-hint">⇢</view>
    </view>

    <!-- 文章卡片列表 -->
    <view class="article-list">
      <ArticleItem
        v-for="item in filteredList"
        :key="item.id"
        :title="item.date + ' ' + item.title"
        :views="item.views"
        :dateStr="item.dateStr"
        :cover="item.cover"
        :onClick="() => goToDetail(item.id)"
      />

    </view>
  </view>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'; // ← 路径请根据你的项目结构调整

export default {
  components: {
    ArticleItem
  },
  data() {
    return {
      currentTab: 0,
      showHint: true,
      tabList: [
        { name: '每日读经' },
        { name: '公私诵' },
        { name: '宗教法规' },
        { name: '教区动态' },
        { name: '教区简介' }
      ],
      articleList: [
        {
          id: 1,
          icon: "📿",
          date: "4.23",
          title: "复活八日庆 星期三",
          views: 335,
          dateStr: "04月23日",
          cover: "https://picsum.photos/id/1011/200/200"
        },
        {
          id: 2,
          icon: "📖",
          date: "3.01",
          title: "圣灰礼仪",
          views: 822,
          dateStr: "03月01日",
          cover: "https://picsum.photos/id/1025/200/200"
        },
        {
          id: 3,
          icon: "🎚️",
          date: "4.19",
          title: "圣周六（复活圣夜）",
          views: 263,
          dateStr: "04月19日",
          cover: "https://picsum.photos/id/1040/200/200"
        },
        {
          id: 4,
          icon: "📖",
          date: "4.15",
          title: "耶稣受难日默想",
          views: 695,
          dateStr: "04月15日",
          cover: "https://picsum.photos/id/1041/200/200"
        },
        {
          id: 5,
          icon: "📿",
          date: "8.15",
          title: "圣母升天节",
          views: 971,
          dateStr: "08月15日",
          cover: "https://picsum.photos/id/1062/200/200"
        },
        {
          id: 6,
          icon: "🙏",
          date: "4.20",
          title: "复活主日讲道摘要",
          views: 412,
          dateStr: "04月20日",
          cover: "https://picsum.photos/id/1074/200/200"
        },
        {
          id: 7,
          icon: "✝️",
          date: "6.11",
          title: "圣体圣血节的反省",
          views: 788,
          dateStr: "06月11日",
          cover: "https://picsum.photos/id/1084/200/200"
        },
        {
          id: 8,
          icon: "📜",
          date: "2.25",
          title: "每日诵读",
          views: 621,
          dateStr: "02月25日",
          cover: "https://picsum.photos/id/109/200/200"
        }
      ]

    };
  },
  computed: {
    filteredList() {
      return this.articleList;
    }
  },
  methods: {
    changeTab(index) {
      this.currentTab = index;
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/articles/detail?id=${id}`
      });
    },
    onTabScroll(e) {
      const scrollLeft = e.detail.scrollLeft;
      if (scrollLeft > 20 && this.showHint) {
        this.showHint = false;
      } else if (scrollLeft <= 10 && !this.showHint) {
        this.showHint = true;
      }
    }
  }
};
</script>

<style lang="scss">
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.tabs-scroll-container {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.tabs {
  padding: 16rpx 0;
}

.tab-wrapper {
  display: flex;
  align-items: center;
  padding: 0 16rpx;
}

.tab {
  display: inline-block;
  padding: 12rpx 28rpx;
  font-size: 28rpx;
  border-radius: 36rpx;
  margin-right: 20rpx;
  background-color: #f0f0f0;
  color: #333;
  flex-shrink: 0;
}

.active {
  background-color: #1a73e8;
  color: #fff;
}

.tabs-hint {
  position: absolute;
  right: 8rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #bbb;
  background: linear-gradient(to right, transparent, #fff 60%);
  padding-left: 8rpx;
  z-index: 10;
}

.article-list {
  padding: 16rpx;
}
</style>
