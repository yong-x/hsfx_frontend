import Vue from 'vue'
import App from './App.vue'
import router from './router'

/*基于移动端viewport的自适应插件，设置html根元素font-size基准值为当前viewport宽度的十分之一*/
import 'amfe-flexible'
//阿里字体图标库
import './assets/ali-iconfont/iconfont.css'
//自定义全局样式文件
import './assets/css/global.css'

//导入自定义全局组件
import detail_add_navbar from './components/common/detail_add_navbar.vue' //添加和详情页公共导航头部
//注册自定义全局组件
Vue.component('detail-add-navbar',detail_add_navbar)

/*
	全局注册的组件(一定是在全局定义的)，注册方式为: Vue.component(组件标签名,组件对象) ，可以作为任意组件的子组件使用。
	局部注册的组件(一定是在某个组件内部定义的)，注册方式为: 父组件({components:{子组件对象}})   只能在 包含该组件定义的父组件中使用。
*/

//md5加密,进行密码加密
import md5 from 'md5-node'
Vue.prototype.$mymd5 = function(pwd,salt){
	return md5(salt+md5(salt+md5(pwd)))
}

//全局按需导入vant组件
import { 
		Tabbar, 
		TabbarItem,
		List, 
		Cell,
		PullRefresh,
		Card,
		Tag,
		NavBar,
		Icon,
		Form,
		Popup,
		Button,
		Field,
		Col,
		Row,
		DatetimePicker,
		Dialog,
		Toast,
		Uploader,
		Swipe, 
		SwipeItem,
		Lazyload,
		Area,
		Checkbox,
		CheckboxGroup  } from 'vant';
//全局注册vant组件
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Cell);
Vue.use(Card);
Vue.use(Tag);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Form);
Vue.use(Popup);
Vue.use(Button);
Vue.use(Field);
Vue.use(Col);
Vue.use(Row);
Vue.use(DatetimePicker);
Vue.use(Dialog); //自动将Dialog方法挂载到Vue.prototype.$dialog上，在组件中可以通过this.$dialog.alert()进行调用
Vue.use(Toast); //自动将Dialog方法挂载到Vue.prototype.$toast上,在组件中可以通过this.$toast()进行调用
Vue.use(Uploader)
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Area  );
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

//axios插件进行http请求
import axios from 'axios'
axios.defaults.baseURL = process.env.VUE_APP_Server //配置所有axios的全局请求根路径
axios.interceptors.response.use(  //响应拦截器，结构响应数据，对服务器响应异常统一处理
		function (response) {
				// 对响应数据进行解剖后返回给then(res),则res中接收的就不再是response而是response.data
				return response.data;
			}, function (error) {
				// 对响应错误,提示消息
				let tips = error.message==='Network Error'?'网络异常':(error.message.includes('timeout')?'连接服务器超时':'服务器异常')	
				console.error('axios响应拦截器拦截捕获服务器异常===>')
				console.log(JSON.stringify(error));	
				Toast(tips)
				return;
				//如果不在响应拦截器对服务器错误进行处理，则直接返回下面语句，然后再catch(error)中就可以完整接收到error对象，并进行catch代码块的处理。
				//return Promise.reject(error);	
});

Vue.prototype.$http= axios



Vue.config.productionTip = false


// 路由导航守卫，在进入某些页面之前需要检查是否登录
router.beforeEach((to, from, next) => {
	console.log('to.path===>',to.path)
  //需要登录的路由数组
  let requiredLoginPath = ['/addhouse']
  //当前访问的路由不需要登录，则直接放行
  if(requiredLoginPath.indexOf(to.path)  === -1){
	  return next()	  
  }
  //检查sessionStorage中用户信息，即是否登录
  let userJson = window.sessionStorage.getItem('user')  
  console.log("我要进入到", to.name);
  console.log('路由导航守卫检查用户' , userJson)
  if(!userJson){
  	Toast('请先登录')				
  	router.replace('/login')					 
  }	else {
    return next();
  }
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
