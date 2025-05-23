import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uviewPlus from '@/uni_modules/uview-plus'
import { createPinia } from 'pinia' // ✅ 引入 Pinia

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()       // ✅ 创建 Pinia 实例
  app.use(pinia)                    // ✅ 注册 Pinia 到应用
  app.use(uviewPlus)
  return {
    app
  }
}
// #endif
