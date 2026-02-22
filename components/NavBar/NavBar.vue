<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<view :style="{height:statusHeight + 'rpx'}"></view>
			<view @click="goSearchPage" class="nav-bar-content" :style="{marginRight:marginRight + 'rpx'}">
				<uni-icons class="nav-bar-search-icon" type="search" color="#999"></uni-icons>
				<view class="nav-bar-search-text">输入文章标题进行搜索</view>
			</view>
		</view>
		<!-- 底部垫片 -->
		<view :style="{height: 80 + statusHeight + 'rpx'}"></view>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		ref,
	} from 'vue';

	const statusHeight = ref(20)
	const marginRight = ref(0)

	function goSearchPage() {
		uni.navigateTo({
			url: '/pages/search/search'
		})
	}

	function initStatusBarHeight() {
		/* 如果是小程序的换，进行胶囊处理 */
		// #ifdef MP-WEIXIN
		const systemInfo = uni.getDeviceInfo()
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		const match = systemInfo.model.match(/\d+/)
		const isGap = match ? match[0] >= 14 : false
		statusHeight.value = menuButtonInfo.top * 2 - (isGap ? 5 : 0)
		marginRight.value = menuButtonInfo.width * 2
		// #endif

		// #ifndef MP-WEIXIN
		const systemInfo = uni.getSystemInfoSync()
		statusHeight.value = systemInfo.statusBarHeight ? systemInfo.statusBarHeight * 2 : 20;
		// #endif
	}

	onBeforeMount(() => {
		/* 初始化获取状态栏高度 */
		initStatusBarHeight()
	})
</script>

<style lang="scss" scoped>
	@import "./css/NavBar.scss";
</style>