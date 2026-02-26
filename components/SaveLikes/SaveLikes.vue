<template>
	<view class="save-incons" @click.stop="changeSaveStatus">
		<uni-icons color="#ff6600" :type="isLike ? 'heart-filled':'heart'" size="20"></uni-icons>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance
	} from 'vue'
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

	const props = defineProps({
		item: {
			type: Object,
			default: () => ({
				_id: ''
			})
		},
	})

	const {
		proxy
	} = getCurrentInstance()
	async function changeSaveStatus() {
		// 登录 改变当前的收藏状态
		// 没有登录 => 界面的跳转 => 用户登录的界面
		await userStore.checkedIsLogin()
		const {
			operateTip,
			newUserInfo
		} = await proxy.$http.update_save_like({
			articleId: props.item._id,
			userId: userInfo.value._id
		})

		uni.showToast({
			title: operateTip,
			icon: 'none'
		})
		userStore.updateUserInfo(newUserInfo)
	}

	const isLike = computed(() => {
		return userInfo.value &&
			(!!userInfo.value.article_likes_ids?.includes(props.item._id))
	})
</script>

<style>

</style>