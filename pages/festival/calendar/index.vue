<template>
  <scroll-view class="calendar-page" scroll-y>
    <!-- 搜索栏 + 布局按钮 -->
    <view class="header">
      <view class="search-wrapper">
        <image src="/static/calendar/Search.svg" class="search-icon" />
        <view class="search-input-box">
          <input
            v-model="searchKeyword"
            class="search-input"
            placeholder="搜索节日名称或介绍..."
            placeholder-class="search-placeholder"
          />
          <view v-if="searchKeyword" class="clear-button" @click="clearSearch">✕</view>
        </view>
      </view>
      <view class="toggle-button" @click="toggleLayout">
        <image
          :src="layoutMode === 'grid'
            ? '/static/calendar/List.svg'
            : '/static/calendar/Grid.svg'"
          class="layout-icon"
          mode="widthFix"
        />
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="searchKeyword" class="section-box">
      <view class="section-subtitle">搜索结果</view>
      <view v-if="filteredFestivals.length === 0" class="empty-box">
        <text class="empty-text">🔍 未找到相关节日</text>
      </view>
      <view v-else :class="['festival-grid', layoutMode]">
        <view
          class="festival-item pressable"
          v-for="(item, i) in filteredFestivals"
          :key="i"
          @click="onTap(item)"
        >
          <rich-text class="title" :nodes="highlightText(item.name)" />
          <rich-text class="sub" :nodes="highlightText(item.description || '暂无介绍')" />
        </view>
      </view>
    </view>

    <!-- 正常分类显示 -->
    <view
      v-else
      class="section-box"
      v-for="(section, i) in data"
      :key="i"
    >
      <view class="section-subtitle">{{ section.title }}</view>
      <view :class="['festival-grid', layoutMode]">
        <view
          class="festival-item pressable"
          v-for="(item, j) in section.festivals"
          :key="j"
          @click="onTap(item)"
        >
          <view class="title">{{ item.name }}</view>
          <view class="sub">{{ item.description || '暂无介绍' }}</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Config } from '@/utils/config'

const data = ref<any[]>([])
const layoutMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')

onMounted(async () => {
  try {
    const res = await uni.request({
      url: Config.festival.fullFestivalConfigUrl,
      method: 'GET'
    })
    data.value = res.data
  } catch (err) {
    console.error('节日总览加载失败', err)
  }
})

function onTap(item: any) {
  console.log('点击节日 folder_name:', item.folder_name)

  uni.navigateTo({
    url:
      '/pages/festival/calendar/detail?' +
      'scode=' + encodeURIComponent(item.folder_name) +
      '&description=' + encodeURIComponent(item.description || '') +
      '&memorial_day=' + encodeURIComponent(item.memorial_day || '')
  })
}


function toggleLayout() {
  layoutMode.value = layoutMode.value === 'grid' ? 'list' : 'grid'
}

function clearSearch() {
  searchKeyword.value = ''
}

const filteredFestivals = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return []
  return data.value.flatMap((section: any) =>
    section.festivals.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
    )
  )
})

function highlightText(text: string): any[] {
  const keyword = searchKeyword.value.trim()
  if (!keyword) return [{ type: 'text', text }]
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map(part => {
    if (part.toLowerCase() === keyword.toLowerCase()) {
      return {
        name: 'span',
        attrs: { style: 'color: #d20000; font-weight: bold;' },
        children: [{ type: 'text', text: part }]
      }
    } else {
      return { type: 'text', text: part }
    }
  })
}
</script>

<style scoped>
.calendar-page {
  padding: 32rpx 24rpx;
  background-color: #f5f6f7;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.search-wrapper {
  flex: 1;
  position: relative;
  margin-right: 20rpx;
}

.search-icon {
  position: absolute;
  left: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 28rpx;
  height: 28rpx;
}

.search-input-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 0 20rpx 0 64rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.search-input {
  flex: 1;
  height: 64rpx;
  font-size: 26rpx;
  color: #333;
}

.clear-button {
  font-size: 28rpx;
  color: #ccc;
  padding: 10rpx;
  z-index: 10;
}

.search-placeholder {
  color: #bbb;
}

.toggle-button {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-icon {
  width: 36rpx;
  height: 36rpx;
}

.section-box {
  margin-bottom: 48rpx;
}

.section-subtitle {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #2c2c2c;
}

.festival-grid {
  display: grid;
  gap: 24rpx;
  width: 100%;
  box-sizing: border-box;
}
.festival-grid.grid {
  grid-template-columns: repeat(2, 1fr);
}
.festival-grid.list {
  grid-template-columns: 1fr;
}

.festival-item {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  word-break: break-word;
  box-sizing: border-box;
  width: 100%;
}

.title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.sub {
  font-size: 24rpx;
  color: #888;
}

.pressable {
  transition: transform 0.08s ease;
}
.pressable:active {
  transform: scale(0.97);
}

.empty-box {
  padding: 80rpx 20rpx;
  text-align: center;
  color: #999;
}

.empty-text {
  font-size: 26rpx;
}
</style>
