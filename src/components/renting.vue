<template>
	<div class="my-content">
		<!-- 头部导航区 -->
		<van-nav-bar id="topNav" title="房屋出租">
			<template #right>
				<van-icon @click="toAddHouse" class="iconfont" class-prefix="icon" name="hao" style="margin-right: 0.625rem;" />
				<van-icon @click="showPopupForm=!showPopupForm" class="iconfont" class-prefix="icon" name="icon-search" />
			</template>
		</van-nav-bar>
		<!-- 弹出层搜索表单 -->
		<van-popup v-model="showPopupForm"  position="top" :style="{ height: 'fit-content'}">
			<van-form>
				<!-- 地址选项 -->
				<van-field v-model="searchForm.address" type="text" name="房屋地址" label="房源地址" placeholder="请输入房源地址" :rules="[]" />				
				<!-- 标签选项 -->
				<van-field v-model="searchForm.tag" type="text" name="房屋标签" label="标签键字" placeholder="房屋标签关键字" :rules="[]" /><!-- 关键词选项 -->
				<!-- 租金选项 -->
				<van-row >
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.min_price" type="number" name="最低月租" label="最低月租" placeholder="最低月租"
						 :rules="[]" />
					</van-col>
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.max_price" type="number" name="最高月租" label="最高月租" placeholder="最高月租"
						 :rules="[]" />
					</van-col>
				</van-row>
				<!-- 面积选项 -->
				<van-row>
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.min_size" type="number" name="最小面积" label="最小面积" placeholder="最小平方米"
						 :rules="[]" />
					</van-col>
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.max_size" type="number" name="最大面积" label="最大面积" placeholder="最大平方米"
						 :rules="[]" />
					</van-col>
				</van-row>
				<!-- 时间选项 -->
				<van-row>
					<van-col span="12">
						<van-field label-width="4.5em" readonly clickable name="start_time" :value="searchForm.start_time" label="开始时间" placeholder="开始时间"
						 @click="selectDate" />
					</van-col>
					<van-col span="12">
						<van-field label-width="4.5em" readonly clickable name="end_time" :value="searchForm.end_time" label="截止时间" placeholder="截止时间"
						  @click="selectDate" />
					</van-col>
				</van-row>				
				<van-popup v-model="showPicker" position="bottom">
					<van-datetime-picker type="date" :min-date="min_date" :max-date="max_date" @confirm="onConfirm" @cancel="showPicker = false" />
				</van-popup>

				<!-- 表单按钮 -->
				<div style="margin: 16px;">
					<van-button @click="submitForm" round block type="info" native-type="submit" style="margin-bottom: 0.3125rem;">搜索</van-button>
					<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
				</div>
			</van-form>
		</van-popup>
		<!-- 主体内容区 -->
		<van-pull-refresh 
		v-model="refreshing" 
		@refresh="onRefresh" 
		success-text="刷新成功">
			<van-list 
			v-model="loading"
			:immediate-check="false"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad">
				<van-card v-for="item in list" :desc="item.house_detail" :price="item.price_monthly"  :title="item.house_adderss" :thumb="getRealImgSrc(item.imglist[0])" :key="item.houseid" @click="toHouseDetail(item)">
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
				</van-card>
	
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showPopupForm: false, //显示搜索表单
				showPicker: false, //显示时间选择器
				min_date: new Date(2018, 0, 1), //时间选择器的最小可选时间
				max_date: new Date(), //时间选择器的最大可选时间
				currentSelectDateItem:'',				
				searchForm: { //弹出的搜索表单项
					tag: '',
					address:'',
					min_price: '',
					max_price: '',
					min_size: '',
					max_size: '',
					start_time: '',
					end_time: '',
					pageSize: 10,   //页面大小，每次请求多少条
					pageNumber: 1  //当前请求的页号
				},				
				list:  [],  //当前展示的数据列表
				isLastPage: false, //当前页是否是最后一页
				loading: false,  //列表上拉加载状态，为true表示正在发送请求加载数据，为false表示加载数据结束
				finished: false,  //是否所有数据加载完成
				refreshing: false  //是否处于刷新过程中
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
			
			this.retrieveByForm(true)
			
		},
		methods: {			
			padDate: function(value) {    //在月份、日期、小时等小于10时前面补0
				return value < 10 ? '0' + value : value;
			},
			formatDate: function(value) { //将中国标准时间转化为格式化时间字符串
				var date = new Date(value);
				var year = date.getFullYear();
				var month = this.padDate(date.getMonth() + 1);
				var day = this.padDate(date.getDate());
				var hours = this.padDate(date.getHours());
				var minutes = this.padDate(date.getMinutes());
				var seconds = this.padDate(date.getSeconds());
				//返回数据
				//return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
				return year + '-' + month + '-' + day;
			},
			selectDate(e){  //点击选择时间时显示时间选择器，并设置当前选择时间的元素，等待选择时间后对该元素赋值
				this.showPicker = true
				this.currentSelectDateItem=e.target.name
			},
			onConfirm(time) { //确认时间后,根据所点击元素，将所选时间值赋值给所点击元素				
				if(this.currentSelectDateItem==='start_time'){
					this.searchForm.start_time = this.formatDate(time)
				}else if(this.currentSelectDateItem==='end_time'){
					this.searchForm.end_time = this.formatDate(time)
				}
				this.showPicker = false;
			},
			retrieveByForm(isRefresh){  //根据表单搜索条件向服务器发送请求，查询数据对list赋值
				let _this = this
				this.$http.post('/house/retrieve', 
								this.searchForm								
				).then(res => {
					console.log(res)
					if(res.meta.code===200){  //成功收到服务器响应数据						
						if(res.data.houseList.length===0){ //没有检索到数据
							_this.isLastPage = true  //当前页是最后一页
						}						
						if(isRefresh){
							_this.list = res.data.houseList
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
				this.searchForm.pageNumber++				
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
			onRefresh(){ //下拉刷新时，按表单条件检索第一页数据赋值给list
				this.searchForm.pageNumber = 1 //重新请求第一页				
				this.retrieveByForm(true)
				this.refreshing = false				
				
				this.resetOnLoad()				
				this.$toast('刷新成功')
				/*
				this.list =[{
					houseid: 1,
					publisher_uid: 1,
					publisher_username: '张三',
					publisher_phone:'15812345678',
					publish_time: '2018-10-10',
					price_monthly: 1234.12,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 80,
					layout: '2室1厅'					
				}				
			]				
				*/
			},
			submitForm(){ //提交表单，进行搜索
				this.searchForm.pageNumber = 1 //搜索时请求第一页				
				this.retrieveByForm(true)
				
				this.resetOnLoad()
				
				this.showPopupForm=false  //隐藏搜索表单
				if(this.list.length===0){
					this.$toast('没有检索到数据')
				}else{
					this.$toast('检索完成')
				}
			},
			resetForm(){ //重置表单
				let pageNumber = this.searchForm.pageNumber
				let pageSize = this.searchForm.pageSize
				this.searchForm={}
				this.searchForm.pageNumber=pageNumber
				this.searchForm.pageSize=pageSize
				
				this.searchForm.pageNumber = 1 //重新请求第一页
				this.retrieveByForm(true)				
				
				this.resetOnLoad()
			},
			toAddHouse(){
				console.log(process.env.VUE_APP_Server)
				//this.$toast('添加房子')
				this.$router.push('/addhouse')
			},
			toHouseDetail(house){
				this.$toast('房源详情页')				
				this.$router.push({name:'house_detail',params:{house:house}})
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
