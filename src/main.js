import Vue from 'vue'
import App from './App.vue'
//导入路由
import router from '@/router'
//导入elementUI并注册
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  //挂载
  router,
  render: h => h(App),
}).$mount('#app')
