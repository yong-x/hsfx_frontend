<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="发布托管需求"></detail-add-navbar>
		<!-- 要提交的表单 -->
		<van-form :validate-first="true" :show-error-message="false" ref="addTrustDemandForm">			
			<!-- 标题 -->
			<van-field v-model="trustdemand_title" name="托管需求标题" label="托管需求标题" placeholder="请输入托管需求标题" :rules="[{ required: true, message: '请输入托管需求标题' }]" />						
			<!-- 地址 -->
			<van-field v-model="province_city_region" name="省市区" label="省市区" placeholder="省市区" readonly @click="showCityPick=!showCityPick"
			 :rules="[{ required: true, message: '请确认地区' }]" />
			<van-field v-model="detail_address" name="详细地址" label="详细地址" placeholder="小区或街道 楼栋" :rules="[{ required: true, message: '请填写详细地址' }]" />			
			<!-- 年龄 -->
			<van-field v-model="childage" type="number" name="托管儿童年龄" label="儿童年龄(岁)" placeholder="请输入儿童年龄" :rules="[{ required: true, message: '请输入托管儿童年龄' }]" />						
			<!-- 月托管费 -->
			<van-field v-model="price_monthly" type="number" name="期望月托管费" label="期望月托管费" placeholder="请输入期望每月托管费" :rules="[{ required: true, message: '请输入期望每月托管费' }]" />	
			<!-- 日均托管时长 -->					
			<van-field v-model="trustdemand_time" type="number" name="日均托管时长" label="日均托管时长(小时)" placeholder="请输入日均托管时长" :rules="[{ required: true, message: '请输入日均托管时长' }]" />									
			<!-- 早中晚餐选项-->
			<van-field label="早中晚餐">
			  <template #input>
			    <van-checkbox-group v-model="foodCondition" direction="horizontal">
			      <van-checkbox name="早餐" shape="square">早餐</van-checkbox>
			      <van-checkbox name="中餐" shape="square">中餐</van-checkbox>
			      <van-checkbox name="晚餐" shape="square">晚餐</van-checkbox>
			    </van-checkbox-group>
			  </template>
			</van-field>			
			<!-- 课程辅导选项 -->
			<van-field label="课程辅导">
			  <template #input>
			    <van-checkbox-group v-model="eduCondition" direction="horizontal">
			      <van-checkbox name="语文" shape="square">语文</van-checkbox>
			      <van-checkbox name="数学" shape="square">数学</van-checkbox>
			      <van-checkbox name="英语" shape="square">英语</van-checkbox>
			      <van-checkbox name="编程" shape="square">编程</van-checkbox>
			    </van-checkbox-group>
			  </template>
			</van-field>
			<!-- 详细描述 -->
			<van-field v-model="trustdemand_detail" rows="3" autosize label="详细描述" type="textarea" maxlength="200" placeholder="请输入托管需求的详细描述"
			 show-word-limit :rules="[{ required: true, message: '请输入托管需求的详细描述' }]" />
		
			
			<div style="margin: 16px;">
				<van-button @click="submitForm" round block type="info" native-type="button">
					提交
				</van-button>
			</div>
		</van-form>
		<!-- 底部弹出层地区选择器 -->
		<van-popup v-model="showCityPick" position="bottom" :style="{ height: '30%' }">
			<van-area @confirm="ConfirmCity" title="选择地区" :area-list="areaList" />
		</van-popup>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				user: {},  //当前登录用户	
				
				trustdemand_title:'',
				childage:'',
				price_monthly:'',
				trustdemand_time:'',
				foodCondition: [],
				eduCondition: [],
				trustdemand_detail:'',
									
				province_city_region: '', //所选择的省市区
				detail_address: '', //所选择的详细地址
				showCityPick: false, //是否显示地区选择器弹出层				
				areaList: { //地区选择器可供选择的地区
					province_list: {
						420000: '湖北省'
					},
					city_list: {
						420100: '武汉市'
					},
					county_list: {
						420102: '江岸区',
						420103: '江汉区',
						420104: '硚口区',
						420105: '汉阳区',
						420106: '武昌区',
						420107: '青山区',
						420111: '洪山区',
						420112: '东西湖区',
						420113: '汉南区',
						420114: '蔡甸区',
						420115: '江夏区',
						420116: '黄陂区',
						420117: '新洲区'
					}
				}			
			}			
		},
		created() {
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
		},
		methods:{
			ConfirmCity(cityinfo) { //地区选择器确认选择时
				console.log(cityinfo)
				this.province_city_region = cityinfo[0].name + cityinfo[1].name + cityinfo[2].name
				this.showCityPick = false
			},
			submitForm(){  //提交添加表单
				let _this = this
				this.$refs.addTrustDemandForm.validate()
				.then(()=>{	//表单项绑定的验证规则全部通过后执行 then 代码块					
					_this.$http.post('/trust_demand/add', {						
						publisher_uid: _this.user.uid,
						trustdemand_title: _this.trustdemand_title,
						childage: _this.childage,
						price_monthly: _this.price_monthly,
						trustdemand_time: _this.trustdemand_time,
						trustdemand_address: _this.trustdemand_address,
						edu_service: _this.edu_service,						
						food_service: _this.food_service,
						trustdemand_detail: _this.trustdemand_detail
																		
					}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的添加失败信息
								_this.$toast(res.meta.msg)
							}else{  //添加成功，跳转托管需求列表页
								_this.$toast('发布托管需求信息成功')
								_this.$router.replace('/trusting_demanding')
							}
						})					
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			}
		},
		computed: {
			trustdemand_address() { //省市区 与 详细地址之间以 空格 间隔
				return this.province_city_region.replace(/\s+/g,"") + ' ' + this.detail_address.replace(/\s+/g,"")
			},
			edu_service(){
				let eduStr=''
				this.eduCondition.forEach((item,index)=>{
					eduStr+=item.trim('')+','
				})
				return eduStr.trim(',')
			},
			food_service(){
				let foodStr=''
				this.foodCondition.forEach((item,index)=>{
					foodStr+=item.trim(' ')+','
				})
				return foodStr.trim(',')
			}
		}
		
		
		
	}
</script>

<style lang="less" scoped>
	// 标签下边距
	.van-checkbox--horizontal{
		margin-bottom: 0.32rem;
	}
</style>
