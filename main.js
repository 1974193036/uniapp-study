import App from './App'
import { createPinia } from 'pinia'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import module from './ajax/api/index-vue2.js'
Vue.prototype.$http = module
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import module from './ajax/api/index.js'
export function createApp() {
  const app = createSSRApp(App)
	const pinia = createPinia()
	app.use(pinia)
	app.config.globalProperties.$http = module
  return {
    app
  }
}
// #endif