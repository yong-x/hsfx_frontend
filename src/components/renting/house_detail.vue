<template>
	<div class="my-content">
		
		<!-- 顶部导航条 -->
		<detail-add-navbar navBarTitle="房源详情"></detail-add-navbar>
		<!-- 房屋图片 -->
		<van-swipe :autoplay="3000" indicator-color="white" width="100%" height="300">
		  <van-swipe-item  v-for="(imageSrc, index) in house.imglist" :key="index">
		    <img style="width: 100%; height: 100%;" v-lazy="getRealImgSrc(imageSrc)" />
		  </van-swipe-item>
		</van-swipe>
		<!-- 发布人信息 -->
		<van-row class="publisher-Info" type="flex" justify="space-between" >
		  <van-col span="6"><span class="publisher_username">{{house.publisher_username}}</span></van-col>
		  <van-col span="18" style="text-align: right;"><span class="publish_time">发布于 {{house.publish_time}}</span></van-col>		  
		</van-row>
		<!-- 房屋基本信息 -->
		<van-row class="house-baseInfo">
		  <van-col span="8">
			  <div class="desc-title">户型</div>
			  <div class="desc-content"><span clsss="desc-content">{{house.layout}}({{house.area}}m&sup2;)</span> </div>
		  </van-col>
		  <van-col span="8">
			  <div class="desc-title">月租金</div>
			  <div class="desc-content">{{house.price_monthly}}元</div>
		  </van-col>
		  <van-col span="8">
			  <div class="desc-title">位置</div>
			  <div class="desc-content">{{house.house_address.split(' ')[1]}}</div>
		  </van-col>
		</van-row>
		<!-- 房屋标签 -->
		<div class="house-tag">
			<h3 class="tag-title">房屋标签</h3>
			<van-tag plain type="primary" v-for="tag in house.taglist">{{tag}}</van-tag>
		</div>
		<!-- 详情描述 -->
		<div class="house-detail">
			<h3 class="detail-title">详情描述</h3>
			<p class="detail-content">{{house.house_detail}}</p>			
			<div class="detail-address">
				<a :href="'http://api.map.baidu.com/geocoder?address='+house.house_address+'&output=html&src=webapp.baidu.openAPIdemo'">
					<van-icon  class="iconfont" class-prefix="icon" name="dingwei" />  {{house.house_address}}
				</a>				
			</div>
		</div>
		
		<!-- 联系方式 -->
		<div class="publisher-phone">
			<span @click="dial" style="color: red;">
				<van-icon  class="iconfont" class-prefix="icon" name="lianxifangshi" />{{house.publisher_phone}}
			</span>	
		</div>		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				house:{}
			}
		},
		methods:{
			getRealImgSrc(relativeImgSrc){
				return process.env.VUE_APP_Server+relativeImgSrc
			},
			dial(){
				window.location.href = 'tel:' +this.house.publisher_phone
			}
		},
		created() {
			this.house = this.$route.params.house
			console.log( this.$route.params)
		}
	}
</script>

<style lang="less" scoped>
	.publisher-Info{
		
		margin: 0.3125rem;		
		.publisher_username{
			font-size: 0.5rem;
			font-weight: 1000;
			color: #000;
			line-height: .48rem;
			padding-bottom: .133333rem;			
		}
		.publish_time{
			font-size: 0.4375rem;
			line-height: .48rem;
			color: #808080;			
		}
	}
	.house-baseInfo{
		border-top: 0.03125rem solid #808080;
		border-bottom: 0.03125rem solid #808080;
		margin-top: 0.625rem;
		font-size: 0.375rem;
		text-align: center;		
				
		.desc-title {
			color: #808080;
			margin-bottom: 0.375rem;
			padding-top: 0.1875rem;
		};
		.desc-content {
			font-weight: 500;			
			padding-bottom: 0.1875rem;
		};
	}
	.house-detail{
		padding-left: 0.3125rem;
		padding-right: 0.3125rem;
		.detail-title{			
			font-size: 0.625rem;
		}
		.detail-content{
			font-size: 0.5rem
		}
		.detail-address{
			color: #6600ff;
			margin-top: 0.625rem;
			font-size: 0.4375rem;
		}
	}
	.publisher-phone{
		padding: 20px;
		
		margin-bottom: 1.25rem;
		margin-right: 2.5rem;
		font-size:0.625rem;
		
		
	}
	.house-tag{
		padding-left: 0.3125rem;
		padding-right: 0.3125rem;
		.tag-title{
			font-size: 0.625rem;
			margin-top: 0.3125rem;
			margin-bottom: 0.3125rem;			
		}
	}
</style>
