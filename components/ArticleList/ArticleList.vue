<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeCurrentIndex">
		<swiper-item v-for="(item,index) in labelList" :key="index">
			<view class="swiper-item">
				<ListItem></ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import ListItem from './ListItem.vue'

	const emit = defineEmits(['changeCurrentIndex'])
	defineProps({
		labelList: {
			type: Array,
			default: () => []
		},
		activeIndex: {
			type: Number,
			default: 0
		}
	})

	function changeCurrentIndex(e) {
		const {
			current
		} = e.detail;
		emit('changeCurrentIndex', current)
	}
</script>

<style lang="scss" scoped>
	.swiper-container {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>