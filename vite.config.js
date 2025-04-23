// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // ✅ 正确引入 uView Plus 的主题变量
        additionalData: `@import "@/uni_modules/uview-plus/theme.scss";`
      }
    }
  }
})
