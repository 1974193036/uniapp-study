<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:currentIndex===0}" @click="currentIndex = 0">文章</view>
				<view class="follow-tab-item" :class="{active:currentIndex===1}" @click="currentIndex = 1">作者</view>
			</view>
		</view>
		<!-- 内容切换区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex =$event.detail.current">
				<swiper-item>
					<ListItem :isShowLoading="isShowLoading" :articleList="articleList" v-if="articleList.length"></ListItem>
					<view v-if="articleDataNone" class="no-data">暂无收藏的文章</view>
				</swiper-item>
				<swiper-item>
					<AuthorList :authorList="authorList" v-if="authorList.length"></AuthorList>
					<view v-if="authorDataNone" class="no-data">暂无关注的作者</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		storeToRefs
	} from 'pinia'
	import {
		useUserStore
	} from '@/store/user'

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	onLoad(() => {
		if (!userInfo.value.id) {
			uni.redirectTo({
				url: '/pages/userInfo/login/login?navType=switchTab&pageUrl=/pages/follow/follow'
			})
			return
		}
		getFollowArticle()
		getAuthorList()

		uni.$on('updateArticle', (e) => {
			getFollowArticle(false)
		})
		uni.$on('updateAuthor', (e) => {
			getAuthorList(false)
		})
	})

	const currentIndex = ref(0)
	const {
		proxy
	} = getCurrentInstance()

	const isShowLoading = ref(false)

	const articleList = ref([])
	const articleDataNone = ref(false)
	const authorList = ref([])
	const authorDataNone = ref(false)


	// onShow(async () => {
	// 	await userStore.checkedIsLogin()
	// })

	async function getFollowArticle(isLoading) {
		const list = await proxy.$http.get_follow_article({
			userId: userInfo.value._id
		}, {
			showLoading: isLoading
		})
		articleList.value = list
		articleDataNone.value = !list.length
	}

	// 获取关注作者
	async function getAuthorList(isLoading) {
		const list = await proxy.$http.get_follow_author({
			userId: userInfo.value._id
		}, {
			showLoading: isLoading
		})
		authorList.value = list
		authorDataNone.value = !list.length
	}
</script>


<style>
	page {
		height: 100%;
		display: flex;
	}
</style>
<style lang="scss" scoped>
	@import "./css/follow.scss";
</style>