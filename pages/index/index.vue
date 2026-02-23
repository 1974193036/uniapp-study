<template>
	<view class="home-container">
		<NavBar></NavBar>
		<!-- 添加侧边栏 -->
		<TabBar :labelList="labelList"></TabBar>
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

	const labelList = ref([])
	const { proxy } = getCurrentInstance()

	async function initLabelList() {
		const list = await proxy.$http.get_label_list()
		labelList.value = list || []
	}

	onLoad(() => {
		initLabelList()
	})
</script>

<style lang="scss" scoped>

</style>