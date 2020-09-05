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
				<van-field v-model="searchForm.title" type="text" name="求租标题关键字" label="关键字" placeholder="求租标题关键字" :rules="[]" />
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
				<!-- 地址选项 -->
				<van-field v-model="searchForm.address" type="text" name="房源地址" label="房源地址" placeholder="请输入房源地址关键词" :rules="[]" />
		
				<!-- 表单按钮 -->
				<div style="margin: 16px;">
					<van-button @click="submitForm" round block type="info" native-type="submit" style="margin-bottom: 0.3125rem;">搜索</van-button>
					<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
				</div>
			</van-form>
		</van-popup>
		<!-- 主体内容区 -->
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
			<van-list v-model="loading">
			<!-- v-model="loading"		
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad" -->
			
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
						<span>{{item.house_adderss}}</span><br/>
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
				showPopupForm: false, //显示搜索表单
				showPicker: false, //显示时间选择器
				min_date: new Date(2018, 0, 1), //时间选择器的最小可选时间
				max_date: new Date(), //时间选择器的最大可选时间
				currentSelectDateItem:'',
				searchForm: { //弹出的搜索表单项
					title: '',
					min_price: '',
					max_price: '',
					min_size: '',
					max_size: '',
					address: ''				
				},
				list:  [],  //当前展示的数据列表
				loading: false,  //列表上拉加载状态，为true表示正在发送请求加载数据，为false表示加载数据结束
				finished: false,  //是否所有数据加载完成
				refreshing: false  //是否处于刷新过程中
			};
		},
		created(){
			this.list = [{
					demandid: '1',
					demand_title: '求租标题，如精装修',
					house_adderss: '中南路，武昌火车站',
					demand_publisher: '陈先生',
					publisher_phone: '13297215689',
					publish_time: '2020-08-22',
					demand_detail: `需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
									独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便欢迎有房源的朋友与我联系`,
					price_monthly: 2000,										
					area: 80,
					layout: '两室一厅'					
				},
				{
						demandid: '2',
						demand_title: '求租标题，如精装修',
						house_adderss: '中南路，武昌火车站',
						demand_publisher: '陈先生',
						publisher_phone: '13297215689',
						publish_time: '2020-08-22',
						demand_detail: `需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
										独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
										独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便，带
										独立卫生间，独立厨房，朝阳。需要在华师附小旁找一个二室一厅的房源，要求距离华师附小不超过10km，交通方便欢迎有房源的朋友与我联系`,
						price_monthly: 2000,										
						area: 80,
						layout: '两室一厅'					
					},{
					demandid: '3',
					demand_title: '求租标题，如精装修',
					house_adderss: '中南路，武昌火车站，中南路，武昌火车站',
					demand_publisher: '陈先生',
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
			submitForm(){ //提交搜索表单，进行搜索
				this.$dialog.alert({
				     message: JSON.stringify(this.searchForm)
				   });
			},
			resetForm(){ //重置搜索表单
				this.searchForm={}
			},
			toAddHouseDeamnding(){  //去添加房屋求租页
				console.log(process.env.VUE_APP_Server)
				this.$router.push('/adddemanding')
			},
			toDemandDetail(demanding){  //去房源求租详情页			
				//this.$router.push({name:'demanding_detail',params:{demanding:demanding}})
				this.$router.push({name:'demanding_detail',params:{demanding:demanding}})
			},
			onRefresh(){
				
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
