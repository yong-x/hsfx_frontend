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
	 { //出租房屋相关
	   path: '/addhouse',
	   name: 'addhouse',
	   component: addhouse
	 },
	 {
	   path: '/house_detail',
	   name: 'house_detail',
	   component: house_detail
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
	 { //提供托管相关
	   path: '/addtrusting',
	   name: 'addtrusting',
	   component: addtrusting
	 },
	 {
	   path: '/trusting_detail',
	   name: 'trusting_detail',
	   component: trusting_detail
	 }
    ]
  } 
]

const router = new VueRouter({
  routes
})

export default router
