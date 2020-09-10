<template>
	<div class="my-content">
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="托管需求详情"></detail-add-navbar>
		 <div class="main-container">
		 	<div class="title">{{trustDemand.trustdemand_title}}</div>
		 	<div class="time grey-font">
		 		<span>{{trustDemand.publisher_username}}发布于：</span>
		 		<span>{{trustDemand.publish_time}}</span>			
		 	</div>
		 	<div class="price_layout">
		 		<div class="orange-font">
		 			<span>月托管费（元）：</span>
		 			<span class="price" >{{trustDemand.price_monthly}} 元/月</span>			
		 		</div>、
		 		<div >
		 			<span>年龄：</span>
		 			<span class="grey-font">{{trustDemand.childage}}岁</span>			
		 		</div>
		 	</div>
			<div>
				<span>日均托管时长（小时）：</span>
				<span class="grey-font">{{trustDemand.trustdemand_time}}</span>
			</div>
		 	<div>
		 		<span>地址：</span>
		 		<span class="grey-font">{{trustDemand.trustdemand_address}}</span>			
		 	</div>			
		 	<hr/>
		 	<div>
		 		<span>托管需求发布人：</span>
		 		<!-- <span class="phone orange-font">{{trustDemand.publisher_phone}}</span> -->
		 		<span class="grey-font" >{{trustDemand.publisher_username}}</span>			
		 	</div>			
		 	
			<!-- 标签 -->
			<div v-if="trustDemand.edu_service.length>0" class="tag">
				<h3 class="tag-title">课程辅导</h3>
				<van-tag plain type="primary" v-for="tag in trustDemand.edu_service">{{tag}}</van-tag>
			</div>
			<div v-if="trustDemand.food_service.length>0" class="tag">
				<h3 class="tag-title">早中晚餐</h3>
				<van-tag plain type="primary" v-for="tag in trustDemand.food_service">{{tag}}</van-tag>
			</div>
			
			
		 	<div>
		 		<h3>托管需求描述</h3>
		 		<p>{{trustDemand.trustdemand_detail}}</p>			
		 	</div>
		 	<!-- 联系方式 -->
		 	<div class="publisher-phone">
		 		<span @click="dial" style="color: red;">
		 			<van-icon  class="iconfont" class-prefix="icon" name="lianxifangshi" />{{trustDemand.publisher_phone}}
		 		</span>
		 		<span style="color: #808080;font-size: 0.375rem;">
		 			{{trustDemand.publisher_username}}
		 		</span>
		 	</div>
		 </div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				trustDemand:{}
			}
		},
		methods:{			
			dial(){
				window.location.href = 'tel:' +this.trustDemand.publisher_phone
			}
		},
		created() {
			this.trustDemand = this.$route.params.trustDemand
			console.log( this.$route.params)
		}
	}
</script>

<style lang="less" scoped>
	.grey-font{
		color: #808080;
	}
	.orange-font{
		color: #ff8000;
	}
	.main-container{		
		display: flex;
		flex-direction: column;
		font-size: 0.4375rem;
		padding-left: 0.1875rem;
		padding-right: 0.1875rem;
		div{
			margin-top: 0.3125rem;
			margin-bottom: 0.3125rem;
		}
		.title{
			font-size: 0.625rem;
			font-weight: bold;
		}
		.price_layout{
			display: flex;
			.price{
				font-size: 0.5rem;
				font-weight: bold;
			}
		}
		.phone{
			font-size: 0.5rem;
		}
		.publisher-phone{
		padding: 20px;
		
		margin-bottom: 1.25rem;
		margin-right: 2.5rem;
		font-size:0.625rem;
		}
		
	}
		
	
</style>
