<template>
	<view>
	<!-- 	<ListItem :isShowLoading="false" :articleList="articleList" v-if="articleList.length"></ListItem> -->
		<ListCard :item="item" v-for="item in articleList" :key="item._id"></ListCard>
		<view class="no-data" v-if="noArticle">您还没有发布过任何文章</view>
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
	import {
		storeToRefs
	} from 'pinia'
	import {
		useUserStore
	} from '@/store/user'

	onLoad(() => {
		getMyArticle()
	})

	const {
		proxy
	} = getCurrentInstance()

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	const noArticle = ref(false)
	const articleList = ref([])

	async function getMyArticle() {
		const list = await proxy.$http.get_my_article({
			userId: userInfo.value._id
		})
		noArticle.value = !list.length
		articleList.value = list
	}
</script>

<style lang="scss" scoped>
.no-data {
  height: 400rpx;
  line-height: 400rpx;
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
</style>