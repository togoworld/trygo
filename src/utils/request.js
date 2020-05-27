/**
 * 1.单独抽取axios；可以对他进行导入和挂载到vue原型中；全局使用
 * 2.可以在请求发送前设置请求拦击器，携带token
 * 3.在响应到达浏览器前，做相应code判断。及时对token过期作处理
 */

 //1.导入
import Vue from 'vue' 
import axios from 'axios' 

//2.给axios设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;

//3.设置运行携带token,vue默认不携带
axios.defaults.withCredentials = true

Vue.prototype.$axios=axios

