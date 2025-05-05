<template>
  <view class="tree-item-wrapper">
    <view class="tree-item">
      <!-- 节点标题区 -->
      <view class="tree-label" :class="{ clickable: isLeaf }" @click="handleClick">
        <text class="label-text">{{ displayLabel }}</text>
        <image
          v-if="!isLeaf"
          class="arrow"
          :src="expanded ? arrowDown : arrowRight"
          mode="aspectFit"
        />
      </view>

      <!-- 子节点：仅非叶子节点才递归渲染 -->
      <view v-if="expanded && !isLeaf && node.children" class="tree-children">
        <TreeItem
          v-for="(child, index) in node.children"
          :key="index"
          :node="child"
          :depth="depth + 1"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import TreeItem from './TreeItem.vue'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 }
})

const expanded = ref(props.depth === 0)

const arrowRight = '/static/common/arrow-right-filling.svg'
const arrowDown = '/static/common/arrow-down-filling.svg'

const isLeaf = computed(() => {
  return (
    Array.isArray(props.node.children) &&
    props.node.children.length > 0 &&
    props.node.children.every(child => 'path' in child)
  )
})

const displayLabel = computed(() => {
  const raw = props.node.label || ''
  if (raw.startsWith('template=') && raw.includes('chapter=')) {
    const match = raw.match(/chapter=(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      return `第 ${num + 1} 章`
    }
  }
  return raw
})

function handleClick() {
  if (isLeaf.value) {
    uni.navigateTo({
      url: `/pages/bible/book?bookName=${encodeURIComponent(props.node.label)}&chapterCount=${props.node.children.length}&pathPrefix=${encodeURIComponent(getPathPrefix())}`
    })
  } else {
    expanded.value = !expanded.value
  }
}

function getPathPrefix() {
  const firstPath = props.node.children[0]?.path || ''
  return firstPath.substring(0, firstPath.lastIndexOf('/'))
}
</script>

<style scoped>
.tree-item-wrapper {
  padding: 0 10px;
  box-sizing: border-box;
}

.tree-item {
  margin-left: 0;
  margin-top: 6px;
}

.tree-label {
  font-size: 15px;
  padding: 6px 16px;
  border-radius: 4px;
  background-color: #f6f7fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tree-label.clickable {
  background-color: #eaf4ff;
}

.label-text {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
}

.arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.tree-children {
  margin-left: 12px;
  border-left: 2px solid #eee;
  padding-left: 8px;
  margin-top: 4px;
}
</style>
