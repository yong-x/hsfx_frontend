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
				<!-- 关键词选项 -->
				<van-field v-model="searchForm.tagkey" type="text" name="房屋关键字" label="关键字" placeholder="请输入房屋关键字" :rules="[]" />
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
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
			<van-list 
			v-model="loading"		
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad">
				<van-card v-for="item in list" :price="item.price_monthly"  :title="item.house_adderss" :thumb="item.imglist[0]" :key="item.houseid" @click="toHouseDetail(item)">
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
					tagkey: '',
					min_price: '',
					max_price: '',
					min_size: '',
					max_size: '',
					start_time: '',
					end_time: ''
				},
				list:  [],  //当前展示的数据列表
				loading: false,  //列表上拉加载状态，为true表示正在发送请求加载数据，为false表示加载数据结束
				finished: false,  //是否所有数据加载完成
				refreshing: false  //是否处于刷新过程中
			};
		},
		created() {
			this.list = [{
					houseid: 1,
					publisher_uid: 1,
					publisher_username: '张三',
					publisher_phone:'15812345678',
					publish_time: '2018-10-10',
					price_monthly: 1234.12,
					house_adderss: '中南路，武昌火车站',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 80,
					layout: '2室1厅'
					
				},
				{
					houseid: 2,
					publisher_uid: 2,
					publisher_username: '李四',
					publisher_phone:'13811111111',
					publish_time: '2019-02-10',
					price_monthly: 5678.99,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房','朝阳','交通便利','独立厨房','学区房'],
					area: 100,
					layout: '3室1厅'
					
				},
				{
					houseid: 3,
					publisher_uid: 3,
					publisher_username: '王五',
					publisher_phone:'13622222222',
					publish_time: '2020-08-18',
					price_monthly: 6789.88,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 120,
					layout: '4室1厅'
					
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
			retrieveByForm(){  //根据表单搜索条件向服务器发送请求，查询数据对list赋值
				
			},
			onLoad(){  //下拉加载时，请求下一页数据添加到List尾部
				if(this.list.length>20){
					this.loading = false //本次加载结束，可以执行下次加载
					this.finished = true //所有数据加载完毕
					this.$toast('没有更多数据了')
					return 
				}else{
					let length = this.list.length
					let arr = this.list.map((item,index)=>{ item.houseid=length+index+1;return item})					
					this.list = this.list.concat(arr)
					this.loading = false //本次加载结束，可以执行下次加载
				}				
			},
			onRefresh(){ //下拉刷新时，按表单条件检索第一页数据赋值给list
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
					
				},
				{
					houseid: 2,
					publisher_uid: 2,
					publisher_username: '李四',
					publisher_phone:'13811111111',
					publish_time: '2019-02-10',
					price_monthly: 5678.99,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 100,
					layout: '3室1厅'
					
				},
				{
					houseid: 3,
					publisher_uid: 3,
					publisher_username: '王五',
					publisher_phone:'13622222222',
					publish_time: '2020-08-18',
					price_monthly: 6789.88,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 120,
					layout: '4室1厅'
					
				},
				{
					houseid: 4,
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
					
				},
				{
					houseid: 5,
					publisher_uid: 2,
					publisher_username: '李四',
					publisher_phone:'13811111111',
					publish_time: '2019-02-10',
					price_monthly: 5678.99,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 100,
					layout: '3室1厅'
					
				},
				{
					houseid: 6,
					publisher_uid: 3,
					publisher_username: '王五',
					publisher_phone:'13622222222',
					publish_time: '2020-08-18',
					price_monthly: 6789.88,
					house_adderss: '武汉市洪山区',
					house_detail: '优质房源，交通便利，基础设施配备齐全，周围超市学校菜场众多，欢迎有需要的朋友与我联系。',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')],
					taglist: ['朝阳','交通便利','独立厨房','学区房'],
					area: 120,
					layout: '4室1厅'
					
				}
				
			]
				this.refreshing = false
				this.loading = false //
				this.finished = false //使之可以在刷新成功之后在上拉加载下一页
				this.$toast('刷新成功')
			},
			submitForm(){ //提交表单，进行搜索
				 this.$dialog.alert({
				      message: JSON.stringify(this.searchForm)
				    });
			},
			resetForm(){ //重置表单
				this.searchForm={}
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

	
</style>
