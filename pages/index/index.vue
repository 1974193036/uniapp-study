<template>
	<view class="home-container">
		<NavBar></NavBar>
		<!-- 添加侧边栏 -->
		<TabBar :labelList="labelList"></TabBar>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const labelList = ref([])

	function initLabelList() {
		uniCloud.callFunction({
			name: "get_label_list",
			success: (res) => {
				const {
					result: {
						code,
						data
					}
				} = res
				if (code === 1) {
					labelList.value = data || []
				} else {
					labelList.value = []
				}
			}
		})
	}

	onLoad(() => {
		initLabelList()
	})
</script>

<style lang="scss" scoped>

</style>