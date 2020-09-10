<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="修改密码"></detail-add-navbar>
		
		<van-form :validate-first="true" :show-error-message="false" ref="updatePasswordForm">
			<!-- 原密码 -->
			<van-field
			  v-model="password"
						clearable	
						type="password"
			  name="原密码"
						label="原密码"
			  placeholder="请输入原密码" 
			  :rules="[{ required: true, message: '请输入原密码' }]"
			/>
			<!-- 新密码 -->
			<van-field
			  v-model="newPassword"
						clearable	
						type="password"
			  name="确认密码"
						label="新密码"
			  placeholder="请输入新密码"
			  :rules="[{ required: true, message: '请输入新密码' }]"
			/>	
			<!-- 确认新密码 -->
			<van-field
			  v-model="confirm_newPassword"
						clearable	
						type="password"
			  name="确认新密码"
						label="确认新密码"
			  placeholder="请再次输入新密码确认"
			  :rules="[{ required: true, message: '请再次输入新密码确认' }]"
			/>	
			<!-- 表单提交按钮 -->
			<div style="margin: 16px;">
				<van-button style="margin-top: 0.625rem;margin-bottom: 0.625rem;" @click="submitForm" round block type="info" native-type="button">提交</van-button>			  			
			</div>
		</van-form>
		
		
	</div>
</template>

<script>
	export default{
		data(){			
			return {
				user: {}, //当前登录用户
				password: '', //原密码
				newPassword: '', //新密码
				confirm_newPassword: '' //确认新密码
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
			submitForm(){
				let _this = this
				this.$refs.updatePasswordForm.validate()
				.then(()=>{
					if(_this.newPassword!==_this.confirm_newPassword){
						_this.$toast('新密码确认不一致，请检查新密码')
						return 
					}
					if(_this.user.password!==_this.$mymd5(_this.password,_this.user.phone)){
						_this.$toast('原密码输入错误')
						return 
					}
					
					_this.$http.post('/user/update',{
						uid: _this.user.uid,						
						password: _this.$mymd5(_this.newPassword,_this.user.phone),						
					})
					.then((res)=>{
						console.log(JSON.stringify(res));
						if(res.meta.code!=200){ 
							_this.$toast(res.meta.msg)
							return
						}else{  //更新用户信息成功							
							_this.$router.replace('/login')
							_this.$toast('修改密码成功，请重新登录')
						}
					})															
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
