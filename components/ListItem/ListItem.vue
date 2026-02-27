<template>
	<view class="list-scroll-container">
		<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadmore">
			<view class="list-card-container">
				<ListCard v-for="(item, index) in articleList" :key="item._id" :item="item" @saveHistory="saveHistory"></ListCard>
			</view>
			<uni-load-more v-if="isShowLoading" :status="loadData.loading || 'loading'"
				:contentText="contentText"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const emit = defineEmits(['loadmore', 'saveHistory'])
	const props = defineProps({
		articleList: {
			type: Array,
			default: () => []
		},
		loadData: {
			type: Object,
			default: () => ({
				loading: 'loading'
			})
		},
		isShowLoading: {
			type: Boolean,
			default: true
		}
		// pageSize: {
		// 	type: Number,
		// 	default: 7
		// }
	})

	const contentText = {
		contentdown: ' ',
		contentrefresh: '正在加载...',
		contentnomore: '没有更多数据了'
	}

	function loadmore() {
		emit('loadmore')
	}
	
	function saveHistory() {
		emit('saveHistory')
	}
</script>

<style lang="scss" scoped>
	.list-scroll-container {
		height: 100%;

		.list-scroll {
			overflow: hidden;
			height: 100%;
			box-sizing: border-box;
		}
	}
</style>