<template>
	<div class="my-content">
		<detail-add-navbar navBarTitle="注册"></detail-add-navbar>
		
		<div class="loginForm-title">
			<span>华师附小周边房屋出租、求租</span>
			<span>及托管系统注册</span>
		</div>
		
		<van-form validate-first losable  ref="regForm">
		 
		  <van-field
		      v-model="regForm.phone"
			  clearable	
		      name="手机号"
		      label="手机号"
		      placeholder="请输入手机号"
		      :rules="[{ required: true, message: '请输入手机号' },
		  			{ pattern:/^[1][3,4,5,7,8,9][0-9]{9}$/, message: '手机号格式错误' }]"
		    />
			<van-field
		      v-model="regForm.username"
			  clearable	
		      name="姓名"
		      label="姓名"
		      placeholder="请输入姓名"
		      :rules="[{ required: true, message: '请输入姓名' }]"
		    />
		  <van-field
		    v-model="regForm.password"
			clearable	
			type="password"
		    name="密码"
			label="密码"
		    placeholder="密码最少六位,字母 数字 下划线组合" 
		    :rules="[{ required: true, message: '请输入密码' },
					{ pattern: /^(\w){6,20}$/, message: '密码格式不符合要求' }]"
		  />
		  <van-field
		    v-model="regForm.confirmPassword"
			clearable	
			type="password"
		    name="确认密码"
			label="确认密码"
		    placeholder="请再次输入密码"
		    :rules="[{ required: true, message: '请再次输入确认密码' }]"
		  />
		  <div style="margin: 16px;">
		  	<van-button style="margin-top: 0.625rem;margin-bottom: 0.625rem;" @click="submitForm" round block type="info" native-type="button">提交</van-button>
			<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
		  </div>
		  <div class="loginForm-footer">
			 
			  <div class="company">@2020 武汉乔城科技有限公司</div>
			  <div class="icp">鄂ICP备 19005859</div>
		  </div>
		</van-form>  
	</div>
</template>

<script>
	
	export default{
		data(){
			return {
				regForm: {
					phone: '',
					username: '',
					password: '',
					confirmPassword: ''
				}				
			}
		},
		methods:{
			submitForm(){
				console.log(this.$mymd5(this.regForm.password,this.regForm.phone))
				let _this = this
				this.$refs.regForm.validate()
				.then(()=>{  //表单项规则全部验证通过时
					if(_this.regForm.password!==_this.regForm.confirmPassword){
						_this.$toast('两次输入的密码不一致，请检查密码')
						return 
					}
					
					_this.$http.post('/user/register',
					{
						phone:_this.regForm.phone,
						username:_this.regForm.username,
						password:_this.$mymd5(_this.regForm.password,_this.regForm.phone)
					})
					.then(function (res) {
						console.log(JSON.stringify(res));
					    if(res.meta.code!=200){ 
							_this.$toast(res.meta.msg)
							return
						}else{  //注册成功
							_this.$toast('注册成功，立即登录')
							_this.$router.push('/login')
							return
						}											
					  })
					
				})
				.catch((e=>{ //表单项规则没有全部验证通过时
					_this.$toast(e[0].message)
				}))
			},
			resetForm(){
				this.regForm={}
			}
		}
	}
</script>

<style lang="less" scoped="">
	.loginForm-title{
		width: 100%;
		height: 3.125rem;
		margin-top: 0.625rem;		
		font-size: 0.625rem;
		text-align: center;
		font-weight: bold;
		span{
			margin: 0.625rem;			
		}
	}
	.loginForm-footer{
		width: 100%;
		margin-top: 1.25rem;
		font-size: 0.375rem;
		text-align: center;		
		.company{
			margin-top: 1.5rem;			
		}		
	}
</style>

