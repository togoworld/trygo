//导入Vue
import Vue from 'vue'
//导入路由
import VueRouter from 'vue-router'
//注册路由
Vue.use(VueRouter)

//导入组件
import login from '@/views/login'
import layout from '@/views/layout'

//创建路由规则
const routes = [
    //路由重定向
    // {path:'*',redirect:'/login'},
    //login
    { path: '/login', component: login },
    //layout
    {path:'layout',component:layout}
];

//创建路由对象
const router = new VueRouter({
    routes
})

//暴露出去
export default router;