import Vue from 'vue'
//导入axios
import axios from 'axios'
//导入nprogress的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//挂载到原型对象上
Vue.prototype.$http = axios
// 获取系统的配置信息
const serverConfig = window.serverConfig
//配置请求的根路径
axios.defaults.baseURL = serverConfig.BASE_API
//axios请求拦截器，给请求头添加一个Authorization，便于授权验证
axios.interceptors.request.use(config => {
  //展现进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
//axios响应拦截器
axios.interceptors.response.use(config => {
  //隐藏进度条
  NProgress.done();
  return config;
})
