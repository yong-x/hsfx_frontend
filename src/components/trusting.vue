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
				<!-- 早中晚餐选项 -->
				<van-field name="checkboxGroup" label="早中晚餐">
				  <template #input>
				    <van-checkbox-group v-model="searchForm.foodCondition" direction="horizontal">
				      <van-checkbox name="早餐" shape="square">早餐</van-checkbox>
				      <van-checkbox name="中餐" shape="square">中餐</van-checkbox>
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
			
				<van-card v-for="item in list" :desc="item.trust_detail" :price="item.price_monthly"  :title="item.trust_title" :thumb="getRealImgSrc(item.imglist[0])" :key="item.trustid" @click="toTrustingDetail(item)">
					<template #tags>
						<div style="margin:0.3125rem;">
							<van-tag v-if="item.edu_service.length>0&&item.edu_service[0]!==''" type="primary">课程辅导</van-tag>
							<van-tag plain type="primary" v-for="tag in item.food_service">{{tag}}</van-tag>
						</div>
					</template>
					<template #num>
						<span>{{item.trust_address.split(' ')[1]}}</span><br/>
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
		created() {
			/*							
			this.list = [				
				{
					trustid:'1',
					trust_title:'精品托管全托班',
					publisher_username: '陈老师',
					trust_address: '武汉市洪山区华师附小附近',
					publish_time: '2018-09-22',
					price_monthly: 6000,
					min_age: 2,
					max_age: 10,
					publisher_phone: '13297215689',
					edu_service: ['语文','数学','外语'],					
					food_service:['早餐','午餐','晚餐'],
					trust_detail:'需要儿童托管	需要儿童托管	需要儿童托管	需要儿童托管',
					imglist: [require('../assets/01.jpg'),require('../assets/02.jpg'),require('../assets/03.jpg'),require('../assets/04.jpg')]
				}
				]
			*/
				
			this.retrieveByForm(true)
		},
		methods: {
			
			retrieveByForm(isRefresh){  //根据表单搜索条件向服务器发送请求，查询数据对list赋值
				let _this = this
				this.$http.post('/trust/retrieve', 
								this.searchForm								
				).then(res => {
					console.log(res)
					if(res.meta.code===200){  //成功收到服务器响应数据						
						if(res.data.trustList.length===0){ //没有检索到数据
							_this.isLastPage = true  //当前页是最后一页
						}						
						if(isRefresh){
							_this.list = res.data.trustList
						}else{
							_this.list = _this.list.concat(res.data.trustList)
						}						
					}
				})
			},
			getRealImgSrc(relativeImgSrc){
				return process.env.VUE_APP_Server+relativeImgSrc
			},
			resetOnLoad(){  //恢复上拉加载
				this.loading = false //
				this.finished = false //
				this.isLastPage = false //
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
			onRefresh(){
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
				if(this.list.length===0){
					this.$toast('没有检索到数据')
				}else{
					this.$toast('检索完成')
				}
			},
			resetForm(){ //重置搜索表单
				let pageNumber = this.searchForm.pageNumber
				let pageSize = this.searchForm.pageSize
				this.searchForm={}
				this.searchForm.pageNumber=pageNumber
				this.searchForm.pageSize=pageSize
				
				this.searchForm.pageNumber = 1 //重新请求第一页
				this.retrieveByForm(true)				
				
				this.resetOnLoad()
			},
			toAddTrusting(){  //去添加托管页
				this.$router.push('/addtrusting')
			},
			toTrustingDetail(trusting){  //去托管详情页							
				this.$router.push({name:'trusting_detail',params:{trusting:trusting}})
			}
			
		}
	}
</script>

<style lang="less" scoped>
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
