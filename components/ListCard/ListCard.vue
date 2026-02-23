<template>
	<view>
		<!-- 基础卡片 -->
		<view class="list-card" v-if="item.mode==='base'">
			<view class="list-card-img">
				<image src="https://gips3.baidu.com/it/u=1537137094,335954266&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280"
					mode="aspectFill"></image>
			</view>
			<view class="list-card-content">
				<view class="list-card-content-title">
					<text>《故宫博物院》集训营直播课开讲啦（4月17号）《故宫博物院》集训营直播课开讲啦（4月17号）《故宫博物院》集训营直播课开讲啦（4月17号）《故宫博物院》集训营直播课开讲啦（4月17号）</text>
					<SaveLikes></SaveLikes>
				</view>
				<view class="list-card-content-desc">
					<view class="article-type">
						精彩直播
					</view>
					<view class="browse-number">
						293浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 多图模式 -->
		<view class="list-card mode-column" v-if="item.mode==='column'">
			<view class="list-card-top">
				<text>SSR基本介绍以及API的使用</text>
				<SaveLikes></SaveLikes>
			</view>
			<view class="list-card-middle">
				<view class="image-container" v-for="(item,index) in 3" :key="index">
					<image
						src="https://gips3.baidu.com/it/u=3732737575,1337431568&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f1440_2560"
						mode="aspectFill"></image>
				</view>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="article-type">
					精彩直播
				</view>
				<view class="browse-number">
					293浏览
				</view>
			</view>
		</view>
		<!-- 大图模式 -->
		<view class="list-card mode-image" v-if="item.mode==='image'">
			<view class="list-card-top">
				<view class="image-container">
					<image src="https://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024" mode="aspectFill"></image>
				</view>
			</view>
			<view class="list-card-middle">
				<text>SSR基本介绍以及API的使用</text>
				<SaveLikes></SaveLikes>
			</view>
			<view class="list-card-content-desc list-card-bottom">
				<view class="article-type">
					精彩直播
				</view>
				<view class="browse-number">
					293浏览
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		item: {
			type: Object,
			default: () => ({})
		},
	})
</script>

<style lang="scss" scoped>
	@import './css/ListCard.scss'
</style>