<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<view :style="{height:statusHeight + 'rpx'}"></view>

			<!--当界面为搜索界面的时候，添加回退按钮  -->
			<view @click="returnArticleList" :style="{top:statusHeight + 'rpx'}" class="return-icon" v-if="isSearch">
				<uni-icons type="back" size="22" color="white"></uni-icons>
			</view>

			<view @click="goSearchPage" class="nav-bar-content"
				:style="{marginRight:marginRight + 'rpx', marginLeft: isSearch ? '20rpx':''}">
				<uni-icons class="nav-bar-search-icon" type="search" color="#999"></uni-icons>
				<view v-if="!isSearch" class="nav-bar-search-text">输入文章标题进行搜索</view>
				<input v-else @confirm="changeInputVal" v-model.trim="searchVal" class="search-input" type="text"
					confirm-type="search" placeholder="输入文章标题进行搜索">
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
		computed,
	} from 'vue';

	const props = defineProps({
		isSearch: {
			type: Boolean,
			default: false
		},
		parentVal: {
			type: String
		}
	})
	const emit = defineEmits(['sendSearchData', 'updateVal'])

	const statusHeight = ref(20)
	const marginRight = ref(0)

	function goSearchPage() {
		if (props.isSearch) return
		uni.navigateTo({
			url: '/pages/search/search'
		})
	}

	function returnArticleList() {
		// #ifdef H5
		uni.switchTab({
			url: '/pages/index/index'
		})
		// #endif
		// #ifndef H5
		uni.navigateBack()
		// #endif
	}

	const searchVal = computed({
		get() {
			return props.parentVal || ''
		},
		set(val) {
			emit('updateVal', val)
			if (!val) {
				emit('sendSearchData')
			}
		}
	})

	function changeInputVal(val) {
		emit('sendSearchData')
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