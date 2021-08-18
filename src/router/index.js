import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')
const System = () => import( /* webpackChunkName: "system_security"*/ '../views/system/System.vue')
const Security = () => import( /* webpackChunkName: "system_security_switch"*/ '../views/system/Security.vue')
const Switch = () => import( /* webpackChunkName: "system_security_switch"*/ '../views/system/Switch.vue')
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/system/system',
    component: System
  }, {
    path: '/system/security',
    component: Security
  }, {
    path: '/system/switch',
    component: Switch
  }]
}]
const router = new VueRouter({
  mode: 'history', //去掉url中的#号
  routes
})
//判断登录状态，挂载路由导航守卫 to:将要访问的路径  from:从那个路径跳转而来  next:放行
router.beforeEach((to, from, next) => {
  //获取token
  const token = window.sessionStorage.getItem('token');
  if (to.path === '/login') {
    //存在token直接重定向到后台首页
    if (token) {
      return next('/welcome');
    }
    return next();
  }
  if (!token) {
    return next('/login');
  }
  next();
});

export default router
