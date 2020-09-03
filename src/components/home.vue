<template>
	<div>
		<!--路由占位符，路由所匹配的组件将会渲染到该占位符-->
		<router-view></router-view>
		
		<van-tabbar v-model="changedTabIndex" fixed @change='changeTab'>
			<van-tabbar-item icon="home-o" index="/renting" to="/renting">租房
				<template #icon="props">
					<van-icon class="iconfont" class-prefix="icon" name="weibiaoti-_fuzhi" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item icon="search" index to="/demanding">求租
				<template #icon="props">
					<van-icon size="20" class="iconfont" class-prefix="icon" name="fangwuqiuzuzhaozu" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item icon="friends-o" to="/trusting">提供托管
				<template #icon="props">
					<van-icon size="20" class="iconfont" class-prefix="icon" name="tuoguan1" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item icon="friends-o" to="/trusting_demanding">托管需求
				<template #icon="props">
					<van-icon size="20" class="iconfont" class-prefix="icon" name="tuoguan" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item icon="setting-o" to="/mine">我的
				<template #icon="props">
					<van-icon size="20" class="iconfont" class-prefix="icon" name="wode" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	export default {
		props:{ShowBottomTabbar:Boolean},
		data() {
			return {				
				changedTabIndex: 0 //默认当前选择的底部tab
			}
		},
		methods: {
			changeTab(index) {
				this.changedTabIndex = index //更换底部tab
			}
		}		
	}
</script>

<style>
</style>
