<template>
  <scroll-view class="page" :style="{ background: getBackgroundStyle(festivalData['礼仪']) }" scroll-y>
    <view class="top-info-box">
      <!-- 日期 + 星期 -->
      <view class="date-week-row">
        <view class="date-text">{{ festivalData['主历'] }}日（星期{{ festivalData['星期'] }}）</view>
      </view>

      <!-- 礼仪色 -->
      <view class="color-tag">
        <view class="color-box" :style="getColorStyle(festivalData['礼仪'])"></view>
        <text class="color-text">{{ festivalData['礼仪'] }}</text>
      </view>

      <!-- 节日一行轮播（单条切换） -->
      <view class="festival-carousel">
        <view
          class="festival-item"
          v-if="currentItem"
          @click="goToLink(currentItem.link)"
        >
          <text :class="{ 'link-text': currentItem.link }">{{ currentItem.name }}</text>
        </view>
      </view>

    </view>

    <!-- 其他内容 -->
    <view class="content"></view>
  </scroll-view>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'FestivalList',
  setup() {
    const festivalData = ref({
      主历: '28',
      礼仪: '白',
      星期: '一',
      节日: `<ul>
<li><a href="/festival/saint/?scode=1042801">圣葛利农(St. Louis Mary Grignion of Monffort)</a></li>
<li><a href="/festival/saint/?scode=1042802">圣伯多禄•尚纳神父(殉道 St. Peter Mary Chanel)</a></li>
<li>复活期第二周(星期一)</li>
</ul>`
    });

    const festivalItems = ref([]);
    const currentIndex = ref(0);
    let timer = null;

    const currentItem = computed(() => {
      return festivalItems.value.length > 0 ? festivalItems.value[currentIndex.value] : null;
    });

    onMounted(() => {
      parseFestivalHtml();
      startCarousel();
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    function parseFestivalHtml() {
      const html = festivalData.value.节日;
      const regex = /<li>(.*?)<\/li>/g;
      const matches = [...html.matchAll(regex)];

      festivalItems.value = matches.map(match => {
        const innerHtml = match[1];
        const linkMatch = innerHtml.match(/<a\s+href="(.*?)">(.*?)<\/a>/);

        if (linkMatch) {
          return {
            name: linkMatch[2],
            link: linkMatch[1]
          };
        } else {
          return {
            name: innerHtml.replace(/\n/g, '').trim(),
            link: null
          };
        }
      });
    }

    function startCarousel() {
      timer = setInterval(() => {
        if (festivalItems.value.length === 0) return;
        currentIndex.value = (currentIndex.value + 1) % festivalItems.value.length;
      }, 3200); // 每3秒切换一次
    }

    function goToLink(link) {
      if (link) {
        const fullLink = link.startsWith('http') ? link : `https://www.klee.ink${link}`;
        uni.navigateTo({
          url: fullLink
        });
      }
    }

    function getColorStyle(colorName) {
      switch (colorName) {
        case '白':
          return { background: 'linear-gradient(135deg, #ffffff, #f0f0f0)', border: '1rpx solid #ccc' };
        case '红':
          return { background: 'linear-gradient(135deg, #ff4d4f, #d9363e)', border: '1rpx solid #c00' };
        case '绿':
          return { background: 'linear-gradient(135deg, #52c41a, #389e0d)', border: '1rpx solid #2a7d0c' };
        case '紫':
          return { background: 'linear-gradient(135deg, #722ed1, #531dab)', border: '1rpx solid #3d0e85' };
        case '黑':
          return { background: 'linear-gradient(135deg, #000000, #333333)', border: '1rpx solid #111' };
        case '玫红':
          return { background: 'linear-gradient(135deg, #ff69b4, #ff85c1)', border: '1rpx solid #d63384' };
        default:
          return { background: 'linear-gradient(135deg, #cccccc, #eeeeee)', border: '1rpx solid #bbb' };
      }
    }

    function getBackgroundStyle(colorName) {
      switch (colorName) {
        case '白':
          return 'linear-gradient(to bottom, #ffffff, #f7f7f7)';
        case '红':
          return 'linear-gradient(to bottom, #ffe6e6, #fff1f1)';
        case '绿':
          return 'linear-gradient(to bottom, #e6ffe6, #f0fff0)';
        case '紫':
          return 'linear-gradient(to bottom, #f3e6ff, #f9f0ff)';
        case '黑':
          return 'linear-gradient(to bottom, #333333, #000000)';
        case '玫红':
          return 'linear-gradient(to bottom, #ffe0ef, #fff5f9)';
        default:
          return 'linear-gradient(to bottom, #f5f5f5, #fafafa)';
      }
    }

    return {
      festivalData,
      festivalItems,
      currentItem,
      currentIndex,
      goToLink,
      getColorStyle,
      getBackgroundStyle
    };
  }
};
</script>

<style scoped>
.page {
  min-height: 100%;
}

.top-info-box {
  background-color: #ffffff;
  margin: 24rpx;
  padding: 32rpx;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.date-week-row {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.date-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.color-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;
}

.color-box {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.color-text {
  font-size: 30rpx;
  color: #555555;
}

/* 节日轮播（单条切换） */
.festival-carousel {
  height: 40rpx;
  overflow: hidden;
  background: linear-gradient(to right, #f0f0f0, #fafafa);
  border-radius: 12rpx;
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.festival-item {
  height: 40rpx;
  line-height: 40rpx;
  font-size: 28rpx;
  color: #333333;
  text-align: center;
}

.link-text {
  color: #3c9cff;
  text-decoration: underline;
}
</style>
