<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeCurrentIndex">
		<swiper-item v-for="(item,index) in labelList" :key="item._id">
			<view class="swiper-item">
				<ListItem :articleList="articleData[index] || []"></ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import {
		watch,
		ref,
		getCurrentInstance
	} from 'vue'
	import ListItem from './ListItem.vue'

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

	watch(() => props.labelList, () => {
		getArticleList(props.activeIndex)
	})

	const articleData = ref({})
	function changeCurrentIndex(e) {
		const {
			current
		} = e.detail;
		emit('changeCurrentIndex', current)
		if (!articleData.value[current] || articleData.value[current].length == 0) {
			getArticleList(current)
		}
	}

	const {
		proxy
	} = getCurrentInstance()

	async function getArticleList(currentIndex) {
		const articleList = await proxy.$http.get_article_list({
			classify: props.labelList[currentIndex].name
		})
		articleData.value[currentIndex] = articleList || []
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