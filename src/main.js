//1.导入Vue和根组件App.vue
import Vue from 'vue'
import App from './App.vue'
//2.导入路由
import router from '@/router'
//3.导入element.js
import '@/plugins/Element.js'


Vue.config.productionTip = false

new Vue({
  //挂载
  router,
  render: h => h(App),
}).$mount('#app')
