<template>
	<div class="my-content">
		<!-- 头部导航区 -->
		<van-nav-bar id="topNav" title="房屋求租">
			<template #right>
				<van-icon @click="toAddHouseDeamnding" class="iconfont" class-prefix="icon" name="hao" style="margin-right: 0.625rem;" />
				<van-icon @click="showPopupForm=!showPopupForm" class="iconfont" class-prefix="icon" name="icon-search" />
			</template>
		</van-nav-bar>
		<!-- 弹出层搜索表单 -->
		<van-popup v-model="showPopupForm" position="top" :style="{ height: 'fit-content'}">
			<van-form>
				<!-- 求租标题选项 -->
				<van-field v-model="searchForm.title" type="text" name="求租标题关键字" label="求租标题关键字" placeholder="求租标题关键字" :rules="[]" />
				<!-- 地址选项 -->
				<van-field v-model="searchForm.address" type="text" name="房源地址" label="房源地址" placeholder="请输入房源地址关键词" :rules="[]" />
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
				
		
				<!-- 表单按钮 -->
				<div style="margin: 16px;">
					<van-button @click="submitForm" round block type="info" native-type="submit" style="margin-bottom: 0.3125rem;">搜索</van-button>
					<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
				</div>
			</van-form>
		</van-popup>
		<!-- 主体内容区 -->
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
			<van-list  
			v-model="loading"		
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad">
			
				<van-card v-for="item in list" :price="item.price_monthly"  :title="item.demand_title" :desc="item.demand_detail"  :key="item.demandid" @click="toDemandDetail(item)">
					<template #tags>
						<div class="house-layout-area">
							<van-tag  type="success">{{item.layout}}</van-tag>
							<van-tag  type="success">
								<template #default>
									{{item.area}}m&sup2;  
								</template>
							</van-tag>
						</div>										
					</template>
					<template #num>
						<span>{{item.house_address}}</span><br/>
						<span>{{item.publish_time}}</span>
					</template>
				</van-card>
			
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				showPopupForm: false, //显示搜索表单弹出层				
				searchForm: { //弹出的搜索表单项
					title: '',
					min_price: '',
					max_price: '',
					min_size: '',
					max_size: '',
					address: '',
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
		created(){
			
			/*
			this.list = [{
					demandid: '1',
					demand_title: '求租标题，如精装修',
					house_address: '中南路，武昌火车站',
					publisher_username: '陈先生',
					publisher_phone: '13297215689',
					publish_time: '2020-08-22',
					demand_detail: `需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便欢迎有房源的朋友与我联系`,
					price_monthly: 2000,										
					area: 80,
					layout: '两室一厅'					
				}
				]
				*/
			this.retrieveByForm(true)
		},
		methods: {			
			retrieveByForm(isRefresh){  //根据表单搜索条件向服务器发送请求，查询数据对list赋值
				let _this = this
				this.$http.post('/demand/retrieve', this.searchForm
				).then(res => {
					console.log(res)
					if(res.meta.code===200){  //成功收到服务器响应数据						
						if(res.data.demandList.length===0){ //没有检索到数据
							_this.isLastPage = true  //当前页是最后一页
						}						
						if(isRefresh){
							_this.list = res.data.demandList
						}else{
							_this.list = _this.list.concat(res.data.demandList)
						}						
					}
				})
			},
			
			
			onLoad(){  //上拉加载时，请求下一页数据添加到List尾部
				this.searchForm.pageNumber++				
				this.retrieveByForm(false)				
				if(this.isLastPage){ //上面请求的页是最后一页
					this.loading = false //本次加载结束，
					this.finished = true	//按当前搜索表单所有数据加载完毕				
				}else{
					this.loading = false //本次加载结束，可以执行下次加载
					this.finished = false //所有数据加载完毕										
				}
			},
			resetOnLoad(){  //恢复下拉加载
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
				
			},									
			submitForm(){ //提交搜索表单，进行搜索
				this.searchForm.pageNumber = 1 //搜索时请求第一页
				this.retrieveByForm(true)
				
				this.resetOnLoad()
				
				this.showPopupForm=false  //隐藏搜索表单
				this.$toast('检索完成')
			},
			
			
			
			
			resetForm(){ //重置搜索表单
				this.searchForm={}
				
				let pageNumber = this.searchForm.pageNumber
				let pageSize = this.searchForm.pageSize
				this.searchForm={}
				this.searchForm.pageNumber=pageNumber
				this.searchForm.pageSize=pageSize
				
				this.searchForm.pageNumber = 1 //重新请求第一页
				this.retrieveByForm(true)								
				this.resetOnLoad()
								
			},
			toAddHouseDeamnding(){  //去添加房屋求租页
				console.log(process.env.VUE_APP_Server)
				this.$router.push('/adddemanding')
			},
			toDemandDetail(demanding){  //去房源求租详情页							
				this.$router.push({name:'demanding_detail',params:{demanding:demanding}})
			}
			
		}
	}
	
</script>

<style lang="less" scoped>
	// 把价格数字放到最底部
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
