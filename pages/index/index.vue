<template>
	<view class="home-container">
		<NavBar></NavBar>
		<!-- 添加侧边栏 -->
		<TabBar :labelList="labelList" :activeIndex="activeIndex" @changeCurrentIndex="changeCurrentIndex"></TabBar>
		<!-- 文章列表组件 -->
		<ArticleList :labelList="labelList" class="list-container" :activeIndex="activeIndex"
			@changeCurrentIndex="changeCurrentIndex"></ArticleList>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const activeIndex = ref(0)

	function changeCurrentIndex(index) {
		activeIndex.value = index
	}

	const labelList = ref([])
	const {
		proxy
	} = getCurrentInstance()

	async function initLabelList() {
		const list = await proxy.$http.get_label_list()
		labelList.value = [{
			name: "全部"
		}, ...(list || [])]
	}

	onLoad(() => {
		initLabelList()
	})
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home-container {
		overflow: hidden;
		flex: 1;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}

	.list-container {
		flex: 1;
		box-sizing: border-box;
	}
</style>