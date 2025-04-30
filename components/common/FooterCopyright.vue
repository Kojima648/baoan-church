<template>
  <view class="footer" v-if="lines.length">
    <!-- 单行模式 -->
    <text v-if="mode === 'single'">{{ lines.join(' · ') }}</text>

    <!-- 多行模式 -->
    <view v-else>
      <view v-for="(line, index) in lines" :key="index">
        {{ line }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Config } from '@/utils/config'

const lines = ref<string[]>([])
const mode = ref<'single' | 'multi'>('single')

onMounted(() => {
  uni.request({
    url: Config.footer.url,
    success: (res) => {
      const data = res.data || {}
      lines.value = Array.isArray(data.lines) ? data.lines : []
      mode.value = data.mode === 'multi' ? 'multi' : 'single'
    },
    fail: () => {
      const currentYear = new Date().getFullYear()
      lines.value = [`© ${currentYear} 宝安天主堂 · 新媒体运营小组`]
      mode.value = 'single'
    }
  })
})
</script>

<style scoped>
.footer {
  text-align: center;
  font-size: 24rpx;
  color: #888;
  padding: 15rpx 0;
  line-height: 1.6;
}
</style>
