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
		getCurrentInstance,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		useLabelStore
	} from '@/store/label.js'
	import {
		useUserStore
	} from '@/store/user.js'
	import {
		storeToRefs
	} from 'pinia'

	const labelStore = useLabelStore()
	const {
		labelList: labelListStore
	} = storeToRefs(labelStore)

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	const activeIndex = ref(0)

	function changeCurrentIndex(index) {
		activeIndex.value = index
	}

	const labelList = computed(() => {
		if (userInfo.value && userInfo.value.id) {
			activeIndex.value = 0
			return [
				...labelListStore.value.slice(0, 1),
				...labelListStore.value.filter(item => userInfo.value
					.label_ids.includes(item._id))
			]
		} else {
			return labelListStore.value
		}
	})

	const {
		proxy
	} = getCurrentInstance()

	async function initLabelList() {
		if (labelList.value.length > 0) return
		const list = await proxy.$http.get_label_list()
		labelStore.setLabelList([{
			name: "全部"
		}, ...(list || [])])
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