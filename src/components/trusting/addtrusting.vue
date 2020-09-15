<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar
		 :navBarTitle="addOrUpdate=='add'?'发布托管提供信息':'修改托管提供信息'"></detail-add-navbar>
		<!-- 要提交的表单 -->
		<van-form :validate-first="true" :show-error-message="false" ref="addTrustForm">
			<!-- 标题 -->
			<van-field v-model="trust_title" name="托管班标题" label="托管班标题" placeholder="请输入托管班标题" :rules="[{ required: true, message: '请输入托管班标题' }]" />			
			<!-- 详情描述 -->
			<van-field v-model="trust_detail" rows="3" autosize label="托管详细描述" type="textarea" maxlength="200" placeholder="请输入托管详细描述"
			 show-word-limit :rules="[{ required: true, message: '请输入托管详细描述' }]" />
			<!-- 地址 -->
			<van-field v-model="province_city_region" name="省市区" label="省市区" placeholder="省市区" readonly @click="showCityPick=!showCityPick"
			 :rules="[{ required: true, message: '请确认地区' }]" />
			<van-field v-model="detail_address" name="详细地址" label="详细地址" placeholder="小区或街道 楼栋" :rules="[{ required: true, message: '请填写托管班详细地址' }]" />
			<!-- 每月价格 -->
			<van-field v-model="price_monthly" type="number" name="月托管费(元)" label="月托管费(元)" placeholder="月租金(元)" :rules="[{ required: true, message: '请填写每月托管费用' }]" />
			<!-- 最小年龄 -->
			<van-field label="最小年龄限制">
				<template #input>
				   <van-stepper v-model.number="min_age" min="1" max="15" />
				</template>
			</van-field>
			<!-- 最大年龄 -->
			<van-field label="最大年龄限制">
				<template #input>
				   <van-stepper v-model.number="max_age" min="1" max="15" />
				</template>
			</van-field>
			<!-- 早中晚餐选项 -->
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
			
			<!-- 添加时允许选择图片，更新时不允许修改图片 -->
			<van-field v-if="addOrUpdate=='add'?true:false" name="uploader" label="托管条件图片">
				<template #input>
					<van-uploader v-model="imglist" :after-read="afterRead" accept="image/*" multiple :max-count="5" :max-size="5 * 1024*1024" />
				</template>
			</van-field>
		
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
				trustid:'', //添加时没有此值，更新时有此值
				
				trust_title: '',
				trust_detail: '',  //详情描述
				price_monthly: '', //每月租金
				min_age: 3,
				max_age: 12,
				foodCondition: [],
				eduCondition: [],				
				imglist: [],
			
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
			
			let trust = this.$route.params.trust
			console.log(trust)
			if(trust){ //当前页是更新房源信息页，暂不支持修改图片
				this.addOrUpdate = 'update'
				
				this.trustid = trust.trustid
				this.trust_title = trust.trust_title
				this.trust_detail = trust.trust_detail
				this.price_monthly = trust.price_monthly
				this.min_age = trust.min_age
				this.max_age = trust.max_age
				this.foodCondition = trust.food_service
				this.eduCondition = trust.edu_service
				this.province_city_region = trust.trust_address.split(' ')[0]
				this.detail_address = trust.trust_address.split(' ')[1]
				//
				//this.imglist=
				
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
			afterRead(file) { //选择上传图片之后，此时还没有开始上传
				// 此时可以自行将文件上传至服务器
				console.log(file);
			},
			
			addTrust(){	//添加托管提供信息时
				let _this = this
				this.$refs.addTrustForm.validate()
				.then(()=>{
					if (_this.imglist.length <= 0) {
						_this.$toast('请至少选择一张托管相关图片')
						return
					}
					const fromdata = new FormData(); //封装fromData发送数据到服务器
										
					/*将普通字符串和图片文件数据封装为formdata，进行上传*/
					fromdata.append('publisher_phone', _this.user.phone);
					fromdata.append('publisher_uid', _this.user.uid);
					fromdata.append('trust_title', _this.trust_title);
					fromdata.append('price_monthly', _this.price_monthly);
					fromdata.append('min_age', _this.min_age);
					fromdata.append('max_age', _this.max_age);
					fromdata.append('trust_detail', _this.trust_detail);
					fromdata.append('trust_address', _this.trust_address);
					fromdata.append('edu_service', _this.edu_service);
					fromdata.append('food_service', _this.food_service);
					_this.imglist.forEach((item, index) => {
						fromdata.append('file' + index, item.file);
					})
					
					//打印出formdata数据
					for (var [a, b] of fromdata.entries()) {
						console.log(a, b);
					}
					_this.$http.post('/trust/add', fromdata, {
						headers: {
							'content-type': 'multipart/form-data'
						}
					}).then(res => {
						console.log(res)
						if(res.meta.code!==200){  //收到服务器的上传失败信息
							_this.$toast(res.meta.msg)
						}else{  //上传成功，跳转托管提供信息列表页
							_this.$toast('发布托管提供信息成功')
							_this.$router.replace('/trusting')
						}
					})
					
					
										
					
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			},
			updateTrust(){	//更新托管提供信息时
				let _this = this
				this.$refs.addTrustForm.validate()
				.then(()=>{
					_this.$http.post('/trust/update',{
						trustid: _this.trustid,
						publisher_phone: _this.user.phone,
						publisher_uid: _this.user.uid,        
						trust_title: _this.trust_title,       
						price_monthly: _this.price_monthly,   
						min_age: _this.min_age,              
						max_age: _this.max_age,               
						trust_detail: _this.trust_detail,    
						trust_address: _this.trust_address,   
						edu_service: _this.edu_service,      
						food_service: _this.food_service     
						
					}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的失败信息
								_this.$toast(res.meta.msg)
							}else{  //更新成功，跳转我的托管提供信息列表页
								_this.$toast('更新托管提供信息成功')
								_this.$router.replace('/mytrustlist')
							}
						})				
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			},
			
			submitForm() { //验证表单项并上传	
				if(this.addOrUpdate==='update'){
					this.updateTrust()					
				}else{
					this.addTrust()
				}	
			}
			
		},
		computed: {
			trust_address() { //省市区 与 详细地址之间以 空格 间隔
				return this.province_city_region.replace(/\s+/g,"") + ' ' + this.detail_address.replace(/\s+/g,"")
			},
			edu_service(){
				let eduStr=''
				this.eduCondition.forEach((item,index)=>{
					eduStr+=item.trim(' ')+','
				})
				return eduStr.replace(/^,+|,+$/gi,'')
			},
			food_service(){
				let foodStr=''
				this.foodCondition.forEach((item,index)=>{
					foodStr+=item.trim(' ')+','
				})
				return foodStr.replace(/^,+|,+$/gi,'')
			}
		}
	}
</script>

<style lang="less" scoped>
	// 标签下边距
	.van-checkbox.van-checkbox--horizontal{
		margin-bottom: 0.32rem;
	}
</style>
