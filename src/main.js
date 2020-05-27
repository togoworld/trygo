//1.导入Vue和根组件App.vue
import Vue from 'vue'
import App from './App.vue'
//2.导入路由
import router from '@/router'
//3.导入element.js
import '@/plugins/Element.js'
//4.导入全局样式
import '@/style/base.css'
//5.导入axios文件request
import '@/utils/request.js'


Vue.config.productionTip = false

new Vue({
  //挂载
  router,
  render: h => h(App),
}).$mount('#app')
