<template>
	<view class="list-scroll-container">
		<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadmore">
			<view class="list-card-container">
				<ListCard v-for="(item, index) in articleList" :key="item._id" :item="item"></ListCard>
			</view>
			<uni-load-more v-if="articleList.length === 0 || articleList.length > pageSize"
				:status="loadData.loading || 'loading'"></uni-load-more>
			<view v-else style="padding-bottom: 20rpx;"></view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const emit = defineEmits(['loadmore'])
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
		pageSize: {
			type: Number,
			default: 7
		}
	})

	function loadmore() {
		emit('loadmore')
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