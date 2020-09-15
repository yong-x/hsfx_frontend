<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar :navBarTitle="addOrUpdate=='add'?'发布求租需求':'修改求租需求信息'"></detail-add-navbar>
		<!-- 要提交的表单 -->
		<van-form :validate-first="true" :show-error-message="false" ref="addDemandForm">			
			<van-field v-model="demand_title" name="求租标题" label="求租标题" placeholder="请输入求租标题" :rules="[{ required: true, message: '请输入求租标题' }]" />						
			<van-field v-model="province_city_region" name="省市区" label="省市区" placeholder="省市区" readonly @click="showCityPick=!showCityPick"
			 :rules="[{ required: true, message: '请确认地区' }]" />
			<van-field v-model="detail_address" name="详细地址" label="详细地址" placeholder="小区或街道 楼栋" :rules="[{ required: true, message: '请填写求租房源详细地址' }]" />			
			<van-field v-model="area" type="number" name="房屋面积" label="房屋面积" placeholder="房屋面积(平方米)" :rules="[{ required: true, message: '请填写求租房源大致面积' }]" />
			<van-row class="mylayout_row">
			  <van-col span="12">
				  <van-field label="室数目" label-width="4em">
					  <template #input>
					     <van-stepper v-model.number="bedroom" min="1" max="10" />
					  </template>
				  </van-field>				 
			  </van-col>
			  <van-col span="12">
				  <van-field label="厅数目" label-width="4em">
				  		<template #input>
				  		   <van-stepper v-model.number="hall" min="0" max="10" />
				  		</template>
				  </van-field>	
			  </van-col>
			  
			</van-row>
			<van-field v-model="price_monthly" type="number" name="月租金(元)" label="月租金(元)" placeholder="请输入期望的最高月租金(元)" :rules="[{ required: true, message: '请填写期望的每月租金' }]" />
			<van-field v-model="demand_detail" rows="3" autosize label="详细描述" type="textarea" maxlength="200" placeholder="请输入所求租房源详细描述"
			 show-word-limit :rules="[{ required: true, message: '请填写求租房源详细描述' }]" />
		
			
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
				addOrUpdate: 'add', //当前是登录还是更新
				demandid:'', //如果是更新则有此值
				
				demand_title: '',							
				house_detail: '', //详细描述		
				price_monthly: '', //每月租金
				area: '',
				demand_detail:'',
				bedroom: 1,
				hall: 0,			
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
			
			/*判断是添加还是更新*/
			let demand = this.$route.params.demand
			console.log(demand)
			if(demand){ //当前页是更新求租信息页
				this.addOrUpdate = 'update'
				
				this.demandid = demand.demandid
				this.demand_title = demand.demand_title
				this.house_detail = demand.demand_detail
				this.price_monthly = demand.price_monthly
				this.area = demand.area				
				this.demand_detail = demand.demand_detail
				this.bedroom = demand.layout.length>=2?demand.layout.substr(0,1):1
				this.hall = demand.layout.length>=4?demand.layout.substr(2,1):0
				
				this.province_city_region = demand.demand_address.split(' ')[0]
				this.detail_address = demand.demand_address.split(' ')[1]
																
			}else{ //当前页是添加房源信息页
				this.addOrUpdate = 'add'	
			}
			
		},
		methods:{
			ConfirmCity(cityinfo) { //地区选择器确认选择时
				console.log(cityinfo)
				this.province_city_region = cityinfo[0].name + cityinfo[1].name + cityinfo[2].name
				this.showCityPick = false
			},
			addDemand(){ //添加求租需求时
				let _this = this
				this.$refs.addDemandForm.validate()
				.then(()=>{	//表单项绑定的验证规则全部通过后执行 then 代码块					
					_this.$http.post('/demand/add', {						
						demand_title: _this.demand_title,
						demand_address: _this.demand_address,
						publisher_uid: _this.user.uid,						
						price_monthly: _this.price_monthly,
						demand_detail: _this.demand_detail,
						area: _this.area,
						layout: _this.layout												
					}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的添加失败信息
								_this.$toast(res.meta.msg)
							}else{  //添加成功，跳转求租列表页
								_this.$toast('发布求租需求信息成功')
								_this.$router.replace('/demanding')
							}
						})					
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			},
			updateDemand(){ //更新求租需求时
				let _this = this
				this.$refs.addDemandForm.validate()
				.then(()=>{	//表单项绑定的验证规则全部通过后执行 then 代码块					
					_this.$http.post('/demand/update', {						
						demandid: _this.demandid,
						demand_title: _this.demand_title,
						demand_address: _this.demand_address,
						publisher_uid: _this.user.uid,						
						price_monthly: _this.price_monthly,
						demand_detail: _this.demand_detail,
						area: _this.area,
						layout: _this.layout												
					}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的更新失败信息
								_this.$toast(res.meta.msg)
							}else{  //更新成功，跳转我的求租需求列表页
								_this.$toast('更新求租需求信息成功')
								_this.$router.replace('/mydemandlist')
							}
						})					
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			},			
			submitForm(){  //提交添加求租需求表单
				if(this.addOrUpdate === 'update'){
					
					this.updateDemand()					
				}else{
					this.addDemand()
				}	
			}
		},
		computed: {
			demand_address() { //省市区 与 详细地址之间以 空格 间隔
				return this.province_city_region.replace(/\s+/g,"") + ' ' + this.detail_address.replace(/\s+/g,"")
			},
			layout(){
				return this.bedroom+'室'+(this.hall>0?(this.hall+'厅'):'')
			}
		}
	}
</script>

<style lang="less" scoped>
	.mylayout_row{
		.van-cell.van-field{
			padding-right: 0;			
		}
	}	
</style>
