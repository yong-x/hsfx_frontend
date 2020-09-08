<template>
	<div class="my-content">
		<van-nav-bar title="登录" >
			<template #left>
			    <van-icon @click="toHome"  class="iconfont" class-prefix="icon" name="weibiaoti-_fuzhi" />
			</template>
		</van-nav-bar>
		
		<div class="loginForm-title">
			<span>华师附小周边房屋出租、求租</span>
			<span>及托管系统登录</span>
		</div>
		
		<van-form validate-first :show-error-message="false"  ref="loginForm">
		 
		  <van-field
		      v-model="phone"
		      name="手机号"
		      label="手机号"
		      placeholder="请输入手机号"
		      :rules="[{ required: true, message: '请输入手机号' },
		  			{ pattern: /0?(13|14|15|18|17)[0-9]{9}/, message: '手机号格式错误' }]"
		    />
		  <van-field
		    v-model="password"
			type="password"
		    name="密码"
			label="密码"
		    placeholder="请输入密码"
		    :rules="[{ required: true, message: '请输入密码' }]"
		  />
		  <div style="margin: 16px;">
		  	<van-button style="margin-top: 0.625rem;margin-bottom: 0.625rem;" @click="submitForm" round block type="info" native-type="button">登录</van-button>
			<van-button @click="resetForm" round block type="warning" native-type="button">重置</van-button>
		  </div>
		  <div class="loginForm-footer">
			  <router-link class="reg" to="/register">没有账号，立即注册</router-link>
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
				phone: '',
				password: ''
			}
		},
		methods:{
			toHome(){
				this.$router.push('/home')
			},
			submitForm(){
				let _this = this
				this.$refs.loginForm.validate()
				.then(()=>{  //表单项规则全部验证通过时，发送登录请求
					_this.$http.post('/user/login',
					{
						phone:_this.phone,
						password:_this.$mymd5(_this.password,_this.phone)
					})
					.then(function (res) {
					    console.log(JSON.stringify(res));
						if(res.meta.code!=200){ //1、用户不存在或密码错误
							_this.$toast(res.meta.msg)
						}else{ 					//2、登录成功
						window.sessionStorage.setItem('user',JSON.stringify(res.data.user))
							_this.$router.push('/home')							
						}						
					  })	
				})
				.catch((e=>{ //表单项规则没有全部验证通过时
					console.log(e)
					_this.$toast(e[0].message)
				}))
			},
			resetForm(){
				this.phone=''
				this.password=''
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
		.reg{
			display: block;			
		}
		.company{
			margin-top: 1.5rem;			
		}		
	}
</style>
