import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}]

const router = new VueRouter({
  routes
})

export default router
