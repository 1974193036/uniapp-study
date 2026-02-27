<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeCurrentIndex">
		<swiper-item v-for="(item,index) in labelList" :key="item._id">
			<view class="swiper-item">
				<ListItem :articleList="articleData[index] || []" :loadData="loadData[index]" :pageSize="pageSize"
					@loadmore="loadmoreData">
				</ListItem>
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

	const loadData = ref({})
	const pageSize = ref(7)
	const articleData = ref({})
	const {
		proxy
	} = getCurrentInstance()

	watch(() => props.labelList, (val) => {
		val.length > 0 && getArticleList(props.activeIndex)
	}, {
		immediate: true
	})

	function changeCurrentIndex(e) {
		const {
			current
		} = e.detail;
		emit('changeCurrentIndex', current)
		if (!articleData.value[current] || articleData.value[current].length == 0) {
			getArticleList(current)
		}
	}

	async function getArticleList(currentIndex) {
		/* 初始化请求判断当前分类是否含有数据，并记录当前的分类页数 */
		if (!loadData.value[currentIndex]) {
			loadData.value[currentIndex] = {
				page: 1,
				loading: 'loading',
				total: 0
			}
		}

		const {
			list,
			total
		} = await proxy.$http.get_article_list({
			classify: props.labelList[currentIndex].name,
			page: loadData.value[currentIndex].page,
			pageSize: pageSize.value,
		})

		// 填充数据时改变为追加数据
		const oldList = articleData.value[currentIndex] || []
		oldList.push(...list)
		loadData.value[currentIndex].total = total
		loadData.value[currentIndex].loading = 'more'
		articleData.value[currentIndex] = oldList
	}

	function loadmoreData() {
		console.log('到底了')
		// 当现在没有数据的时候，不再进行数据的请求
		if (loadData.value[props.activeIndex].total === articleData.value[props.activeIndex].length) {
			loadData.value[props.activeIndex] = {
				...loadData.value[props.activeIndex],
				...{
					loading: "noMore",
					page: loadData.value[props.activeIndex].page
				}
			}
			return
		}
		loadData.value[props.activeIndex].page++
		loadData.value[props.activeIndex].loading = 'loading'
		getArticleList(props.activeIndex)
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