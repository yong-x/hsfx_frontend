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
	 {
	   path: '/addhouse',
	   name: 'addhouse',
	   component: addhouse
	 },
	 {
	   path: '/house_detail',
	   name: 'house_detail',
	   component: house_detail
	 }
    ]
  } 
]

const router = new VueRouter({
  routes
})

export default router
