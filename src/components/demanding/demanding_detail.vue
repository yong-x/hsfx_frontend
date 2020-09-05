<template>
	<div class="my-content">
		
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="求租详情"></detail-add-navbar>
		<div class="main-container">
			<div class="title">{{demanding.demand_title}}</div>
			<div class="time grey-font">
				<span>发布时间：</span>
				<span>{{demanding.publish_time}}</span>			
			</div>
			<div class="price_layout">
				<div class="orange-font">
					<span>租金：</span>
					<span class="price" >{{demanding.price_monthly}} 元/月</span>			
				</div>、
				<div >
					<span>居室：</span>
					<span class="grey-font">{{demanding.layout}}({{demanding.area}}m&sup2;)</span>			
				</div>
			</div>						
			<div>
				<span>区域：</span>
				<span>{{demanding.house_adderss}}</span>			
			</div>			
			<hr/>
			<div>
				<span>联系方式：</span>
				<span class="phone orange-font">{{demanding.publisher_phone}}</span>
				<span style="margin-left: 0.3125rem;">{{demanding.demand_publisher}}</span>			
			</div>			
			
			<div>
				<h3>求租房源描述</h3>
				<p>{{demanding.demand_detail}}</p>			
			</div>
			<!-- 联系方式 -->
			<div class="publisher-phone">
				<span @click="dial" style="color: red;">
					<van-icon  class="iconfont" class-prefix="icon" name="lianxifangshi" />{{demanding.publisher_phone}}
				</span>	
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				demanding:{}
			}
		},
		methods:{			
			dial(){
				window.location.href = 'tel:' +this.demanding.publisher_phone
			}
		},
		created() {
			this.demanding = this.$route.params.demanding
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
