<template>
	<view class="list-scroll-container">
		<scroll-view scroll-y="true" class="list-scroll">
			<view class="list-card-container">
				<ListCard v-for="(item, index) in itemList" :key="index" :item="item"></ListCard>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const itemList = ref([{
			mode: 'base'
		},
		{
			mode: 'column'
		},
		{
			mode: 'image'
		},
		{
			mode: 'base'
		},
		{
			mode: 'base'
		},
	])
</script>

<style lang="scss" scoped>
	.list-scroll-container {
		height: 100%;
		
		.list-card-container {
			padding-bottom: 20rpx;
		}

		.list-scroll {
			overflow: hidden;
			height: 100%;
			box-sizing: border-box;
		}
	}
</style>