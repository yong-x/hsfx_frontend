<template>
	<div class="my-content">
		<van-nav-bar id="topNav" title="我的"></van-nav-bar>
		<ul class="mine-menu">
			<li>发布的房源提供信息</li>
			<li>发布的房源求租信息</li>
			<li>发布的托管提供信息</li>
			<li>发布的托管需求信息</li>
			<li @click="updateUser">修改基本信息</li>
			<li @click="updatePwd">修改密码</li>
		</ul>		
		<div style="margin: 16px;">
			<van-button @click="logout" round block type="warning" native-type="button">
				退出登录
			</van-button>
		</div>
		
		
		
	</div>
</template>

<script>
	export default{
		data(){
			return {
				user: {}  //当前登录用户				
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
			updateUser(){ //修改用户信息
				this.$router.push('/userinfo')
			},
			updatePwd(){ //修改密码
				this.$router.push('/update_pwd')
			},
			logout(){  //退出登录
				window.sessionStorage.clear();
				this.$router.replace('/login')
			}
		}
	}
</script>

<style lang="less" scoped>
	.mine-menu{
		font-size: 0.4rem;								
		li{
			padding: 0.4rem 0.5rem;			
			box-shadow:#b1b1b1 1px 1px;
			-moz-box-shadow:#b1b1b1 0 1px 2px;
			-webkit-box-shadow:#b1b1b1 0 1px 2px;
		}
	}
</style>
