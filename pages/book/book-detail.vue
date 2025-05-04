<template>
  <view class="book-detail-page">
    <zero-markdown-view :markdown="markdownContent" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const markdownContent = ref(`
# 📖 章节标题测试

这是一个用于测试 \`zero-markdown-view\` 渲染效果的页面。

## ✅ 列表测试

- 项目一
- 项目二

## 🧪 代码测试

\`\`\`js
console.log("Hello from book-detail.vue");
\`\`\`

> 以上内容来自静态测试。
`);
</script>

<style scoped>
.book-detail-page {
  padding: 24rpx;
}
</style>
