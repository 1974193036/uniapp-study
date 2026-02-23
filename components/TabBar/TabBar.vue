<template>
	<view class="tab">
		<scroll-view class="tab-scroll" :scroll-into-view="currentId" :scroll-with-animation="true" scroll-x="true">
			<view class="tab-scroll-box">
				<view @click="navClickFn(index)" :class="{active: activeIndex === index}" v-for="(item, index) in labelList"
					:key="index" :id="`prefixId${index}`" class="tab-scroll-item">
					{{ item.name }}
				</view>
			</view>
		</scroll-view>
		<view class="tab-icons">
			<uni-icons @click="goLabelAdmin" type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	
	const currentId = ref(null)
	const prefixId = 'tab-scroll-item-'

	const emit = defineEmits(['changeCurrentIndex'])
	const props = defineProps({
		labelList: {
			type: Array,
			default: () => []
		},
		activeIndex: {
			type: Number,
			default: 0
		}
	})
	
	watch(() => props.activeIndex, index => {
		currentId.value = `prefixId${index}`
	})

	function navClickFn(index) {
		emit('changeCurrentIndex', index)
	}

	function goLabelAdmin() {
		uni.navigateTo({
			url: "/pages/labelAdmin/labelAdmin"
		})
	}
</script>

<style lang="scss" scoped>
	@import "./css/TabBar.scss";
</style>