<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar :navBarTitle="addOrUpdate=='add'?'发布房源':'修改房源信息'"></detail-add-navbar>
		<!-- 要提交的表单 -->
		<van-form :validate-first="true" :show-error-message="false" ref="addHouseForm">
			<van-field v-model="taglist" name="房源标签" label="房源标签" placeholder="多个房源标签以空格分隔" :rules="[{ required: true, message: '请填写房源标签' },
						{ pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/, message: '请输入正确的房源标签格式' }]" />

			<van-field v-model="house_detail" rows="3" autosize label="详细描述" type="textarea" maxlength="200" placeholder="请输入房源详细描述"
			 show-word-limit :rules="[{ required: true, message: '请填写房源详细描述' }]" />
			<van-field v-model="province_city_region" name="省市区" label="省市区" placeholder="省市区" readonly @click="showCityPick=!showCityPick"
			 :rules="[{ required: true, message: '请确认地区' }]" />
			<van-field v-model="detail_address" name="详细地址" label="详细地址" placeholder="小区或街道 楼栋" :rules="[{ required: true, message: '请填写房源详细地址' }]" />
			<van-field v-model="price_monthly" type="number" name="月租金(元)" label="月租金(元)" placeholder="月租金(元)" :rules="[{ required: true, message: '请填写每月租金' }]" />
			<van-field v-model="area" type="number" name="房屋面积" label="房屋面积" placeholder="房屋面积(平方米)" :rules="[{ required: true, message: '请填写房屋面积' }]" />
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
			
			<!-- 添加时允许选择图片，更新时不允许修改图片 -->
			<van-field v-if="addOrUpdate=='add'?true:false" name="uploader" label="房源图片">
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
	export default {
		data() {
			return {
				user: {},  //当前登录用户
				addOrUpdate: 'add', //当前是登录还是更新		
				houseid: '',  //添加时没有此值，更新时有此值
				
				taglist: '', //房源标签
				house_detail: '', //详细描述		
				price_monthly: '', //每月租金
				area: '',
				bedroom: 1,
				hall: 0,
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
				},
				


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
			
			let house = this.$route.params.house
			console.log(house)
			if(house){ //当前页是更新房源信息页
				this.addOrUpdate = 'update'
				
				house.taglist.forEach(tag=>{
					this.taglist+=tag+' '
				})
				this.taglist.trim(' ')
				
				this.houseid = house.houseid	
				this.house_detail = house.house_detail	
				this.price_monthly = house.price_monthly
				this.area = house.area
				this.bedroom = house.layout.length>=2?house.layout.substr(0,1):1
				this.hall = house.layout.length>=4?house.layout.substr(2,1):0
				//this.imglist=
				
				this.province_city_region = house.house_address.split(' ')[0]
				this.detail_address = house.house_address.split(' ')[1]
				
				
			}else{ //当前页是添加房源信息页
				this.addOrUpdate = 'add'	
			}
			
		},
		methods: {
			ConfirmCity(cityinfo) { //地区选择器确认选择时			
				console.log(cityinfo)
				this.province_city_region = cityinfo[0].name + cityinfo[1].name + cityinfo[2].name
				this.showCityPick = false
			},
			afterRead(file) { //选择上传图片之后，此时还没有开始上传
				// 此时可以自行将文件上传至服务器
				console.log(file);
			},
			addHouse(){ //添加房源时
				let _this = this
				this.$refs.addHouseForm.validate()
					.then(() => { //表单项绑定的验证规则全部通过后执行 then 代码块					
						if (_this.imglist.length <= 0) {
							_this.$toast('请至少选择一张房源图片')
							return
						}
						const fromdata = new FormData(); //封装fromData发送数据到服务器
				
						
				
						/*将普通字符串和图片文件数据封装为formdata，进行上传*/
						fromdata.append('publisher_phone', _this.user.phone);
						fromdata.append('publisher_uid', _this.user.uid);
						fromdata.append('taglist', _this.taglist.trim(' ').replace(/\s+/g,' '));//多个空格全部替换为一个空格
						fromdata.append('house_detail', _this.house_detail);
						fromdata.append('house_address', _this.house_address);
						fromdata.append('area', _this.area);
						fromdata.append('layout', _this.layout);
						fromdata.append('price_monthly', _this.price_monthly);
						_this.imglist.forEach((item, index) => {
							fromdata.append('file' + index, item.file);
						})
				
						//打印出formdata数据
						for (var [a, b] of fromdata.entries()) {
							console.log(a, b);
						}
						_this.$http.post('/house/add', fromdata, {
							headers: {
								'content-type': 'multipart/form-data'
							}
						}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的上传失败信息
								_this.$toast(res.meta.msg)
							}else{  //上传成功，跳转房源列表页
								_this.$toast('发布房源信息成功')
								_this.$router.replace('/renting')
							}
						})
					})
					.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
						_this.$toast(e[0].message)
					})
			},
			updateHouse(){  //更新房源时
				let _this = this
				this.$refs.addHouseForm.validate()
				.then(()=>{
					_this.$http.post('/house/update', 
					{
						houseid:_this.houseid,
						publisher_phone:_this.user.phone,
						publisher_uid:_this.user.uid,
						taglist:_this.taglist.trim(' ').replace(/\s+/g,' '),
						house_detail:_this.house_detail,
						house_address: _this.house_address,
						area:_this.area,
						layout:_this.layout,
						price_monthly:_this.price_monthly
					}).then(res => {
							console.log(res)
							if(res.meta.code!==200){  //收到服务器的失败信息
								_this.$toast(res.meta.msg)
							}else{  //更新成功，跳转我的房源列表页
								_this.$toast('更新房源信息成功')
								_this.$router.replace('/myhouselist')
							}
						})
					
				})
				.catch((e) => { //表单项绑定的验证规则没有全部通过后执行 catch 代码块
					_this.$toast(e[0].message)
				})
			},
			
			
			submitForm() { //验证表单项并上传			
				if(this.addOrUpdate==='update'){
					this.updateHouse()					
				}else{
					this.addHouse()
				}				
			}
		},
		computed: {
			house_address() { //省市区 与 详细地址之间以 空格 间隔
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
