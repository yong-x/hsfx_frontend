<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="用户基本信息更新"></detail-add-navbar>
		<van-form :validate-first="true" :show-error-message="false" ref="updateUserForm">
			<!-- 手机号 -->
			<van-field
			v-model="newPhone"
			clearable	
			name="手机号"
			label="手机号"
			placeholder="请输入手机号"
			:rules="[{ required: true, message: '请输入手机号' },
					{ pattern:/^[1][3,4,5,7,8,9][0-9]{9}$/, message: '手机号格式错误' }]"
			/>
			<!-- 用户名 --> 
			<van-field
			v-model="newUsername"
			clearable	
			name="姓名"
			label="姓名"
			placeholder="请输入姓名"
			:rules="[{ required: true, message: '请输入姓名' }]"
			/>			
			<!-- 表单提交按钮 -->
			<div style="margin: 16px;">
				<van-button style="margin-top: 0.625rem;margin-bottom: 0.625rem;" @click="submitForm" round block type="info" native-type="button">提交</van-button>			  			
			</div>
		</van-form>
		
		<van-dialog v-model="showDialog" @confirm="confirmValidtePwd" title="修改手机号需要密码验证" show-cancel-button>
		  <van-field
		  v-model="validatePassword"
		  clearable	
		  type="password"
		  name="密码"
		  label="密码"
		  placeholder="请输入原密码" 		  
		  />
		</van-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				showDialog: false,
				user: {}, //当前登录用户				
				newPhone:'',
				newUsername:'',
				validatePassword:''
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
			
			this.newPhone = this.user.phone
			this.newUsername = this.user.username
		},
		methods:{
			confirmValidtePwd(){  //弹出框确认，修改手机号确认密码时
				if(this.user.password!==this.$mymd5(this.validatePassword,this.user.phone)){
					this.showDialog=false
					this.$toast('确认密码输入错误')
					this.validatePassword=''					
				}else{
					let _this = this
					this.$http.post('/user/update',{
						uid: this.user.uid,
						phone: this.newPhone,
						password: this.$mymd5(this.validatePassword,this.newPhone),
						username: this.newUsername
					})
					.then((res)=>{
						console.log(JSON.stringify(res));
						if(res.meta.code!=200){ 
							_this.$toast(res.meta.msg)
							return
						}else{  //更新用户信息成功							
							_this.$router.replace('/login')
							_this.$toast('更新用户信息成功，请重新登录')
						}
					})
				}
			},
			submitForm(){  //提交更新用户信息
				let _this = this
				this.$refs.updateUserForm.validate()
				.then(()=>{
					if(this.newPhone!==this.user.phone){ //如果用户要更新手机号的话需要验证密码，密码会随手机号更新而更新
						this.showDialog = true  //在confirmValidtePwd回调方法提交信息到服务器
						return
					}else if(this.user.username!==this.newUsername){  //用户不更新手机号，只更新其它信息(用户名)
						this.$toast('只更新用户名')
						this.$http.post('/user/update',{
							uid: this.user.uid,							
							username: this.newUsername
						})
						.then((res)=>{
							console.log(JSON.stringify(res));
							if(res.meta.code!=200){ 
								_this.$toast(res.meta.msg)
								return
							}else{  //更新用户信息成功
								window.sessionStorage.clear()
								_this.$router.replace('/login')
								_this.$toast('更新用户信息成功，请重新登录')
							}
						})
					}
				})
				.catch((e=>{ //表单项规则没有全部验证通过时
					console.log(e)
					_this.$toast(e[0].message)					
				}))
				
			}
		}
	}
</script>

<style>
</style>
