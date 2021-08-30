import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')
const System = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/System.vue')
const Security = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Security.vue')
const Switch = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Switch.vue')
const Pass = () => import( /* webpackChunkName: "system_security_switch_pass"*/ '../views/system/Pass.vue')
const GroupList = () => import( /*webpackChunkName: "group"*/ '../views/group/List.vue')
const AdminList = () => import( /*webpackChunkName: "admin"*/ '../views/admin/List.vue')
const Pay = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Pay.vue')
const Sms = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Sms.vue')
const Thirdparty = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Thirdparty.vue')
const Email = () => import( /*webpackChunkName: "pay_sms_thirdparty_email"*/ '../views/functional/Email.vue')
const AdminLog = () => import( /*webpackChunkName: "adminlog"*/ '../views/adminlog/List.vue')
const User = () => import( /*webpackChunkName: "list_buylog"*/ '../views/user/BuyLog.vue')
const UserList = () => import( /*webpackChunkName: "list_buylog"*/ '../views/user/List.vue')
const NoticeList = () => import( /*webpackChunkName: "notice"*/ '../views/notice/List.vue')
const AdvertisingList = () => import( /*webpackChunkName: "advertising"*/ '../views/advertising/List.vue')
const DeveloperList = () => import( /*webpackChunkName: "developer_auditlist"*/ '../views/developer/List.vue')
const AuditList = () => import( /*webpackChunkName: "developer_auditlist"*/ '../views/developer/AuditList.vue')
const WithdrawList = () => import( /*webpackChunkName: "withdrawlist"*/ '../views/withdraw/List.vue')
const AppList = () => import( /*webpackChunkName: "applist"*/ '../views/app/List.vue')
const AppAuditList = () => import( /*webpackChunkName: "applist_auditlist"*/ '../views/app/AuditList.vue')
const AuthorizationList = () => import( /*webpackChunkName: "authorizationlist_piratelist_config"*/
  '../views/authorization/List.vue')
const AuthConfig = () => import( /*webpackChunkName: "authorizationlist_piratelist_config"*/
  '../views/authorization/AuthConfig.vue')
const PirateList = () => import( /*webpackChunkName: "authorizationlist_piratelist"*/
  '../views/pirate/List.vue')
const upgradeList = () => import( /*webpackChunkName: "upgradelist"*/ '../views/upgrade/List.vue')
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
  }, {
    path: '/system/pass',
    component: Pass
  }, {
    path: '/group/list',
    component: GroupList
  }, {
    path: '/admin/list',
    component: AdminList
  }, {
    path: '/functional/pay',
    component: Pay
  }, {
    path: '/functional/sms',
    component: Sms
  }, {
    path: '/functional/thirdparty',
    component: Thirdparty
  }, {
    path: '/functional/email',
    component: Email
  }, {
    path: '/adminlog/list',
    component: AdminLog
  }, {
    path: '/user/buylog',
    component: User
  }, {
    path: '/user/list',
    component: UserList
  }, {
    path: '/notice/list',
    component: NoticeList
  }, {
    path: '/advertising/list',
    component: AdvertisingList
  }, {
    path: '/developer/list',
    component: DeveloperList
  }, {
    path: '/developer/auditList',
    component: AuditList
  }, {
    path: '/withdraw/list',
    component: WithdrawList
  }, {
    path: '/app/list',
    component: AppList
  }, {
    path: '/app/auditlist',
    component: AppAuditList
  }, {
    path: '/authorization/list',
    component: AuthorizationList
  }, {
    path: '/pirate/list',
    component: PirateList
  }, {
    path: '/upgrade/list',
    component: upgradeList
  }, {
    path: '/authorization/authconfig',
    component: AuthConfig
  }]
}]
const router = new VueRouter({
  mode: 'history', //去掉url中的'#'号
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
