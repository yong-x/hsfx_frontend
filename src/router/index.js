 import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home.vue'
import renting from '../components/renting.vue'
import demanding from '../components/demanding.vue'
import trusting from '../components/trusting.vue'
import trusting_demanding from '../components/trusting_demanding.vue'
import mine from '../components/mine.vue'
import addhouse from '../components/renting/addhouse.vue'
import house_detail from '../components/renting/house_detail.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
import adddemanding from '../components/demanding/adddemanding.vue'
import demanding_detail from '../components/demanding/demanding_detail.vue'
import addtrusting from '../components/trusting/addtrusting.vue'
import trusting_detail from '../components/trusting/trusting_detail.vue'
import addtrustdemand from '../components/trusting_demanding/addtrustdemand.vue'
import trustdemand_detail from '../components/trusting_demanding/trustdemand_detail.vue'
import userinfo from '../components/user/userinfo.vue'
import update_pwd from '../components/user/update_pwd.vue'
import myhouselist from '../components/renting/myhouselist.vue'
import mydemandlist from '../components/demanding/mydemandlist.vue'
import mytrustlist from '../components/trusting/mytrustlist.vue'
import mytrustdemandlist from '../components/trusting_demanding/mytrustdemandlist.vue'

/*
this.$router是Vue-Router的实例，需要导航到不同路由则用this.$router.push方法
this.$route为当前路由的跳转对象，包含当前路由的name、path、query、params等属性。
*/


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
	redirect: '/home'   
  },
  {
    path: '/register',
    name: 'register',
    component: register	
  },
  {
    path: '/login',
    name: 'login',
    component: login	
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/renting',
    children: [
      {
        path: '/renting',
        name: 'renting',
        component: renting	
      },
     {
       path: '/demanding',
       name: 'demanding',
       component: demanding
     },
     {
       path: '/trusting',
       name: 'trusting',
       component: trusting
     },
     {
       path: '/trusting_demanding',
       name: 'trusting_demanding',
       component: trusting_demanding
     },
     {
       path: '/mine',
       name: 'mine',
       component: mine
     },
	 { //房屋出租相关
	   path: '/addhouse', //添加和更新时共用同一个组件
	   name: 'addhouse',
	   component: addhouse
	 },
	 {
	   path: '/house_detail',
	   name: 'house_detail',
	   component: house_detail
	 },
	 {
	   path: '/myhouselist',
	   name: 'myhouselist',
	   component: myhouselist
	 },	 
	 { //房屋求租相关
	   path: '/adddemanding',
	   name: 'adddemanding',
	   component: adddemanding
	 },
	 {
	   path: '/demanding_detail',
	   name: 'demanding_detail',
	   component: demanding_detail
	 },
	 {
	   path: '/mydemandlist',
	   name: 'mydemandlist',
	   component: mydemandlist
	 },
	 { //提供托管相关
	   path: '/addtrusting',
	   name: 'addtrusting',
	   component: addtrusting
	 },
	 {
	   path: '/trusting_detail',
	   name: 'trusting_detail',
	   component: trusting_detail
	 },
	 {
	   path: '/mytrustlist',
	   name: 'mytrustlist',
	   component: mytrustlist
	 },
	 { //托管需求相关
	   path: '/addtrustdemand',
	   name: 'addtrustdemand',
	   component: addtrustdemand
	 },
	 {
	   path: '/trustdemand_detail',
	   name: 'trustdemand_detail',
	   component: trustdemand_detail
	 },
	 {
	   path: '/mytrustdemandlist',
	   name: 'mytrustdemandlist',
	   component: mytrustdemandlist
	 },
	 { //用户信息和密码相关
	   path: '/userinfo',
	   name: 'userinfo',
	   component: userinfo
	 },
	 { 
	   path: '/update_pwd',
	   name: 'update_pwd',
	   component: update_pwd
	 }
    ]
  } 
]

const router = new VueRouter({
  routes
})

export default router
