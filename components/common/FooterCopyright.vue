<template>
  <view class="footer" v-if="lines.length" @click="showPopup">
    <!-- 单行模式 -->
    <text v-if="mode === 'single'">{{ lines.join(' · ') }}</text>

    <!-- 多行模式 -->
    <view v-else>
      <view v-for="(line, index) in lines" :key="index">
        {{ line }}
      </view>
    </view>

    <!-- 通用弹窗组件 -->
	<BasePopup
	  :visible="popupVisible"
	  title="关于我们"
	  :content="about"
	  buttonText="了解"
	  @close="popupVisible = false"
	/>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BasePopup from '@/components/common/BasePopup.vue'
import { Config } from '@/utils/config'

const lines = ref<string[]>([])
const mode = ref<'single' | 'multi'>('single')
const about = ref<string>('')
const popupVisible = ref(false)

function showPopup() {
  popupVisible.value = true
}

onMounted(() => {
  uni.request({
    url: Config.footer.url,
    success: (res) => {
      const data = res.data || {}
      lines.value = Array.isArray(data.lines) ? data.lines : []
      mode.value = data.mode === 'multi' ? 'multi' : 'single'
      about.value = data.about || ''
    },
    fail: () => {
      const currentYear = new Date().getFullYear()
      lines.value = [`© ${currentYear} 宝安天主堂 · 新媒体运营小组`]
      mode.value = 'single'
      about.value =
        '本小程序由宝安天主堂新媒体运营小组制作，用于提供礼仪信息、圣言灵修与教会资源。'
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
  background-color: #fcfcfc;
}
</style>
