<template>
	<div class="my-content"> 
		<!-- 头部导航区 -->
		<van-nav-bar id="topNav" title="提供托管">
			<template #right>
				<van-icon @click="toAddTrusting" class="iconfont" class-prefix="icon" name="hao" style="margin-right: 0.625rem;" />
				<van-icon @click="showPopupForm=!showPopupForm" class="iconfont" class-prefix="icon" name="icon-search" />
			</template>
		</van-nav-bar>
		
		<!-- 弹出层搜索表单 -->
		<van-popup v-model="showPopupForm"  position="top" :style="{ height: 'fit-content'}">
			<van-form>
				<!-- 托管标题选项 -->
				<van-field v-model="searchForm.title" type="text" name="托管标题关键字" label="托管关键字" placeholder="托管标题关键字" :rules="[]" />
				<!-- 早中晚参选项name="checkboxGroup" -->
				<van-field name="checkboxGroup" label="复选框组">
				  <template #input>
				    <van-checkbox-group v-model="searchForm.foodCondition" direction="horizontal">
				      <van-checkbox name="早餐" shape="square">早餐</van-checkbox>
				      <van-checkbox name="午餐" shape="square">午餐</van-checkbox>
				      <van-checkbox name="晚餐" shape="square">晚餐</van-checkbox>
				    </van-checkbox-group>
				  </template>
				</van-field>
				
				<!-- 托管费用选项 -->
				<van-row >
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.min_price" type="number" name="最低月费" label="最低月费" placeholder="最低月费"
						 :rules="[]" />
					</van-col>
					<van-col span="12">
						<van-field label-width="4.5em" v-model="searchForm.max_price" type="number" name="最高月费" label="最高月费" placeholder="最高月费"
						 :rules="[]" />
					</van-col>
				</van-row>				
				<!-- 地址选项 -->
				<van-field v-model="searchForm.address" type="text" name="托管班地址" label="托管班地址" placeholder="托管班地址" :rules="[]" />
				
				<!-- 表单按钮 -->
				<div style="margin: 16px;">
					<van-button @click="submitForm" round block type="info" native-type="submit" style="margin-bottom: 0.3125rem;">搜索</van-button>
					<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
				</div>
			</van-form>
		</van-popup>
		<!-- 主体内容区 -->
		<van-pull-refresh v-model="refreshing"> 
		<!-- v-model="refreshing" 
		@refresh="onRefresh" 
		success-text="刷新成功" -->
		
			<van-list >
			<!-- v-model="loading"		
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad" -->
			
				<van-card v-for="item in list" :price="item.price_monthly"  :title="item.trusting_title" :thumb="item.imglist[0]" :key="item.trustingid" @click="toTrustingDetail(item)">
					<template #tags>
						<div style="margin:0.3125rem;">
							<van-tag v-if="item.edu_service.length>0" type="primary">课程辅导</van-tag>
							<van-tag plain type="primary" v-for="tag in item.food_service">{{tag}}</van-tag>
						</div>
					</template>
					<template #num>
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
				
				searchForm: { //弹出的搜索表单项
					title: '',
					foodCondition:[],
					min_price: '',
					max_price: '',					
					address: ''				
				},
				list:  [],  //当前展示的数据列表
				loading: false,  //列表上拉加载状态，为true表示正在发送请求加载数据，为false表示加载数据结束
				finished: false,  //是否所有数据加载完成
				refreshing: false  //是否处于刷新过程中
			};
		},
		created() {
			this.list = [
				{
					trustingid:'1',
					trusting_title:'精品托管全托班',
					trusting_publisher: '陈老师',
					trusting_address: '武汉市洪山区华师附小附近',
					publish_time: '2018-09-22',
					price_monthly: 6000,
					min_age: 2,
					max_age: 10,
					publisher_phone: '13297215689',
					edu_service: ['语文','数学','外语'],					
					food_service:['早餐','午餐','晚餐'],
					trusing_detail:'需要儿童托管	需要儿童托管	需要儿童托管	需要儿童托管',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')]
				},
				{
					trustingid:'2',
					trusting_title:'精品托管全托班',
					trusting_publisher: '陈老师',
					trusting_address: '武汉市洪山区华师附小附近',
					publish_time: '2018-09-22',
					price_monthly: 6000,
					min_age: 2,
					max_age: 10,
					publisher_phone: '13297215689',
					edu_service: [],					
					food_service:['早餐','午餐','晚餐'],
					trusing_detail:'需要儿童托管	需要儿童托管	需要儿童托管	需要儿童托管',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')]
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
			toAddTrusting(){  //去添加托管页
				this.$router.push('/addtrusting')
			},
			toTrustingDetail(trusting){  //去托管详情页							
				this.$router.push({name:'trusting_detail',params:{trusting:trusting}})
			},
			onRefresh(){
				
			}
		}
	}
</script>

<style>
</style>
