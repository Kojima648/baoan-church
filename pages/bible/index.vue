<template>
  <view class="search-page">
    <!-- 固定搜索栏 -->
    <view class="search-bar fixed-search">
      <view class="search-box">
        <input
          class="search-input"
          v-model="keyword"
          placeholder="请输入关键词…"
          @confirm="onSearch"
        />
        <button class="search-btn" @click="onSearch">搜索</button>
      </view>
    </view>

    <!-- 滚动目录区域 -->
    <scroll-view class="scroll-area" scroll-y>
      <!-- 加间距美化 -->
      <view class="scroll-padding-top" />

      <!-- 加载中 -->
      <view v-if="loading" class="loading">加载中…</view>
      <!-- 无结果 -->
      <view v-else-if="searched && catalog.length === 0" class="empty">暂无匹配结果</view>
      <!-- 有数据时展示目录树 -->
      <view v-else-if="catalog.length">
        <TreeItem
          v-for="(node, index) in catalog"
          :key="index"
          :node="node"
          :depth="0"
        />
      </view>
      <!-- 初次加载，未发起搜索时展示完整目录 -->
      <view v-else class="loading">📖 正在加载目录...</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TreeItem from './components/TreeItem.vue'
import { Config } from '@/utils/config'

const originalCatalog = ref([])
const catalog = ref([])
const keyword = ref('')
const loading = ref(false)
const searched = ref(false)

onMounted(() => {
  loading.value = true
  uni.request({
    url: Config.bible.catalogUrl,
    success: (res) => {
      originalCatalog.value = res.data || []
      catalog.value = [...originalCatalog.value]
    },
    fail: (err) => {
      uni.showToast({ title: '目录加载失败', icon: 'error' })
      console.error('❌ catalog.json 加载失败：', err)
    },
    complete: () => {
      loading.value = false
    }
  })
})

function onSearch() {
  const kw = keyword.value.trim()
  searched.value = true
  if (!kw) {
    catalog.value = [...originalCatalog.value]
    return
  }

  catalog.value = originalCatalog.value
    .map(node => ({
      ...node,
      children: node.children?.map(child => ({
        ...child,
        children: child.children?.filter(book => book.label.includes(kw)) || []
      })).filter(child =>
        child.label.includes(kw) || (child.children && child.children.length > 0)
      ) || []
    }))
    .filter(node =>
      node.label.includes(kw) || (node.children && node.children.length > 0)
    )
}
</script>

<style scoped>
.search-page {
  height: 100vh;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.fixed-search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 10px 12px 8px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.search-box {
  display: flex;
  align-items: center;
  width: 95%;
  gap: 8px;
}

.search-input {
  flex: 1;
  height: 34px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 16px;
  font-size: 15px;
  box-sizing: border-box;
}

.search-btn {
  flex-shrink: 0;
  width: 60px;
  height: 34px;
  font-size: 14px;
  background-color: #3c9cff;
  color: #fff;
  border-radius: 16px;
  text-align: center;
  line-height: 34px;
}

.scroll-area {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 12px 20px;
  box-sizing: border-box;
}

.scroll-padding-top {
  height: 10px;
}

.loading,
.empty {
  text-align: center;
  color: #888;
  padding: 20px 0;
}
</style>
