<template>
	
	<div>
		<!-- 添加页和详情页顶部导航条组件 -->
		<van-nav-bar :title="navBarTitle" @click-left="onBack" >
			<template #left>
				<van-icon size="20" class="iconfont" class-prefix="icon" name="fanhui"/>
			</template>
		</van-nav-bar>
	</div>
</template>

<script>
	export default {
		
		methods:{
			onBack(){
				this.$router.go(-1)
			}
		},
		props:['navBarTitle']    ,//接收父组件传递过来的属性值	
		//props: {navBarTitle: String}  //规定父组件传递过来属性值的类型，如果父组件在使用子组件时传递过来的值不是规定的类型，则会编译就报错。
	}
</script>

<style>
</style>
