<template>
	<div class="my-content">		
		<!-- 头部导航区 -->
		<van-nav-bar id="topNav" title="我发布的房源" @click-left="$router.go(-1)">
			<template #left>
				<van-icon size="20" class="iconfont" class-prefix="icon" name="fanhui"/>
			</template>
			<template #right>
				<span @click="showPicker = true" >{{curdate}}</span>				 
			</template>
		</van-nav-bar>
		<!-- 日期选择器 -->
		<van-popup v-model="showPicker" position="bottom">
			<van-datetime-picker
			v-model="currentDate"
			type="year-month"
			title="选择年月"
			@confirm="onConfirm"
			@cancel="showPicker = false"
			:min-date="min_date"
			:max-date="max_date"
			:formatter="formatter"
			/>
		</van-popup>
		<!-- 主体内容区 -->
		
			<van-list 
			v-model="loading"
			:immediate-check="false"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad">
				<van-card v-for="(item ,index) in list" :desc="item.house_detail" :price="item.price_monthly"  :title="item.house_adderss" :thumb="getRealImgSrc(item.imglist[0])" :key="item.houseid" @click="toHouseDetail(item)">
					<template #tags>
						<div class="house-layout-area">
							<van-tag  type="success">{{item.layout}}</van-tag>
							<van-tag  type="success">
								<template #default>
									{{item.area}}m&sup2;  
								</template>
							</van-tag>
						</div>
						
						<van-tag plain type="primary" v-for="tag in item.taglist">{{tag}}</van-tag>					
					</template>
					<template #num>					
						<span>{{item.house_address.split(' ')[1]}}</span><br/>
						<span>{{item.publish_time}}</span>
					</template>
					<template #footer>
					    <van-button @click.stop="editHouse(item)" type="info" size="mini">编辑</van-button>
					    <van-button @click.stop="deleteHouse(item.houseid,index)" type="danger" size="mini">删除</van-button>
									<!-- stop阻止事件冒泡，表示只响应当前回调方法 -->
					</template>
				</van-card>
	
			</van-list>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				user: {},//当前登录用户
				showPicker: false, //显示时间选择器
				min_date: new Date(2018, 0, 1), //时间选择器的最小可选时间
				max_date: new Date(), //时间选择器的最大可选时间
				currentDate: new Date(), //时间选择器当前所选择的时间
										
				curdate: this.formatDate(),	//头部导航栏右边显示的时间条件			
				pageSize: 10,   //页面大小，每次请求多少条
				pageNumber: 1,  //当前请求的页号
					
				list:  [],  //当前展示的数据列表
				isLastPage: false, //当前页是否是最后一页
				loading: false,  //列表上拉加载状态，为true表示正在发送请求加载数据，为false表示加载数据结束
				finished: false,  //是否所有数据加载完成				
			};
		},
		created() {
			/*
			this.list = [{
					houseid: 1,
					publisher_uid: 1,
					publisher_username: '张三',
					publisher_phone:'15812345678',
					publish_time: '2018-10-10',
					price_monthly: 1234.12,
					house_address: '中南路，武昌火车站',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 80,
					layout: '2室1厅'					
				}				
			]
			*/		
			//检查sessionStorage中用户信息，即是否登录
			let userJson = window.sessionStorage.getItem('user')
			console.log(userJson)
			if (!userJson) {
				this.$toast('请先登录')
				this.$router.push('/login')
				return
			}
			//取出登录用户信息，方便下面取用
			this.user = JSON.parse(userJson)
			
			//判断localStorage中是否存在路径参数,参数保持，离开本页面时保存参数到localStorage，进入时从localStorage取出参数
			let urlParamsJSON = window.localStorage.getItem('urlParams')
			let urlParams = JSON.parse(urlParamsJSON)
			//alert(JSON.stringify(urlParams.curdate))
			if(urlParams && urlParams.curdate){				
				this.curdate = urlParams.curdate
				window.localStorage.removeItem('urlParams')
			}				
			//检索数据初始化列表
			this.retrieveByForm(true)			
		},		
		methods: {			
			formatter(type, val) {  //弹出的时间选择器格式化器
			     if (type === 'year') {
			       return `${val}年`;
			     } else if (type === 'month') {
			       return `${val}月`;
			     }
			     return val;
			},
			padDate: function(value) {    //在月份、日期、小时 小于10时前面补0
				return value < 10 ? '0' + value : value;
			},
			formatDate: function(value) { //将中国标准时间转化为格式化时间字符串
				var date={}
				if(value){
					date = new Date(value);
				}else{
					date = new Date();
				}				
				var year = date.getFullYear();
				var month = this.padDate(date.getMonth() + 1);
				var day = this.padDate(date.getDate());
				var hours = this.padDate(date.getHours());
				var minutes = this.padDate(date.getMinutes());
				var seconds = this.padDate(date.getSeconds());
				//返回数据
				//return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
				//return year + '-' + month + '-' + day;
				return year + '-' + month
			},			
			
			onConfirm(time) { //确认时间后,根据所点击元素，将所选时间值赋值给所点击元素，立即向服务器发送搜索请求								
				this.curdate = this.formatDate(time)															
				this.showPicker = false				
				this.pageNumber = 1 //搜索时请求第一页
				this.retrieveByForm(true)				
				this.resetOnLoad()												
			},
			retrieveByForm(isRefresh){  //根据表单搜索条件向服务器发送请求，查询数据对list赋值
				let _this = this
				this.$http.post(
				'/house/retrieve', 
				{
					publisher_uid:this.user.uid,
					start_time: this.start_time,
					end_time: 	this.end_time,
					pageSize: 	this.pageSize,
					pageNumber:	this.pageNumber
				}								
				).then(res => {
					console.log(res)
					if(res.meta.code===200){  //成功收到服务器响应数据						
						if(res.data.houseList.length===0){ //没有检索到数据
							_this.isLastPage = true  //当前页是最后一页
						}						
						if(isRefresh){
							_this.list = res.data.houseList							
							if(_this.list.length===0){
								_this.$toast('没有检索到数据')
							}else{
								_this.$toast('检索完成')
							}							
						}else{
							_this.list = _this.list.concat(res.data.houseList)
						}													
					}
				})
			},
			getRealImgSrc(relativeImgSrc){				
				return process.env.VUE_APP_Server+relativeImgSrc
			},
			onLoad(){  //上拉加载时，请求下一页数据添加到List尾部				
				this.pageNumber++				
				this.retrieveByForm(false)	
				this.loading = false //本次加载结束，可以执行下次加载
				
				if(this.isLastPage){ //上面请求的页是最后一页					
					this.finished = true	//按当前搜索表单所有数据加载完毕				
				}else{
					this.finished = false //所有数据加载完毕										
				}
			},
			resetOnLoad(){  //恢复上拉加载
				this.loading = false //
				this.finished = false //
				this.isLastPage = false //
			},			
			toAddHouse(){
				console.log(process.env.VUE_APP_Server)
				//this.$toast('添加房子')
				this.$router.push('/addhouse')
			},
			toHouseDetail(house){
				//this.$toast('房源详情页')				
				this.$router.push({name:'house_detail',params:{house:house}})
			},
			deleteHouse(houseid,index){  //删除发布的房源
				let _this = this
				this.$dialog.confirm({				  
				  message: '确认要删除该条数据吗？',
				})
				.then(() => {
				    // on confirm
					_this.$toast('你点击了确定'+houseid)
					
					_this.$http.post(
						`/house/delete`,
						{houseid: houseid,
						uid: _this.user.uid}					
					)
					.then(res => {
						console.log(res)
						if(res.meta.code===200){  //成功收到服务器响应数据						
							_this.list.splice(index,1)
							_this.$toast('删除成功')												
						}
					})
				})
				.catch(() => {
				    // on cancel
					_this.$toast('你取消了删除操作')
				});
			},
		
			editHouse(house){  //编辑发布的房源
				this.$router.push({name:'addhouse',params:{house:house}})
			}
		},
		beforeRouteLeave (to, from, next) { //离开本路由（页面）前将参数保持到localStorage中，进行参数保持
		// 导航离开该组件的对应路由时调用
		// 可以访问组件实例 `this`
		let urlParamsObj = {curdate:this.curdate}
		window.localStorage.setItem('urlParams',JSON.stringify(urlParamsObj))
		console.log(window.localStorage.getItem('urlParams'))
		next()
		},
		computed:{
			start_time(){	//根据当前选择月份计算月份第一天			
				let year = this.curdate.substr(0,4)
				let month = this.curdate.substr(5,2)
				let lastDate = new Date(year,month,0).getDate()				
				return this.curdate+'-01'				
				
			},
			end_time(){	//根据当前选择月份计算月份最后一天
				let year = this.curdate.substr(0,4)
				let month = this.curdate.substr(5,2)
				let lastDate = new Date(year,month,0).getDate()								
				return year+'-'+month +'-'+ lastDate
			}
		}
	};
</script>

<style lang="less" scoped>
	.house-layout-area{
		margin-top: 0.1875rem;
		margin-bottom: 0.1875rem;
	}	
	// 把价格数字放到最底部,时间，地址靠右
	.van-card__bottom {
		position: relative;
		.van-card__price{
			position: absolute;
			bottom: 0;
		}
		.van-card__num{
			text-align: right;
		}
	}	
</style>
