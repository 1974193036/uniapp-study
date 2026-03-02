<template>
	<view>
		<!-- 评论展示组件 -->
		<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
			<CommentBox @commnetReply="commnetReply" :commentData="item"></CommentBox>
		</view>
		<uni-load-more :status="loading" :contentText="contentText"></uni-load-more>
		<!-- 评论内容输入组件 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="sendCommentData">
		</CommentMasker>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance,
	} from 'vue'
	import {
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/store/user'

	const page = ref(1)
	const pageSize = ref(5)
	const commentList = ref([])
	const loading = ref('loading')
	const articleId = ref('')
	const showPopup = ref(false)
	const replyData = ref({})
	const contentText = {
		contentdown: ' ',
		contentrefresh: '正在加载...',
		contentnomore: '没有更多评论了'
	}
	const userStore = useUserStore()

	const {
		proxy
	} = getCurrentInstance()

	onLoad((props) => {
		articleId.value = props.articleId
		getCommentList()
	})

	onReachBottom(() => {
		if (loading.value === 'noMore' || loading.value === 'loading') return
		page.value++
		getCommentList()
	})

	async function getCommentList() {
		loading.value = 'loading'
		const list = await proxy.$http.get_comments({
			articleId: articleId.value,
			page: page.value,
			pageSize: pageSize.value,
		})
		if (list.length === 0) {
			loading.value = 'noMore'
			return
		}
		let oldList = JSON.parse(JSON.stringify(commentList.value))
		oldList.push(...list)
		commentList.value = oldList
		loading.value = 'more'
	}

	/* 处理回复事件函数 */
	function commnetReply(data) {
		replyData.value = {
			"comment_id": data.comment.comment_id,
			is_reply: data.isReply
		}
		// 当前为回复内容的时候添加回复的ID
		data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id)
		openMaskerComment()
	}

	// 打开弹窗遮罩层
	async function openMaskerComment() {
		await userStore.checkedIsLogin()
		showPopup.value = true
	}

	async function sendCommentData(content) {
		const {
			msg
		} = await proxy.$http.update_comment({
			articleId: articleId.value,
			userId: userStore.userInfo._id,
			content,
			...replyData.value,
		})
		uni.showToast({
			title: msg,
		})
		showPopup.value = false
		page.value = 1
		commentList.value = []
		replyData.value = {}
		getCommentList()
	}
</script>

<style lang="scss" scoped>
	.comment-content-container {
		padding: 0 15px;
		border-bottom: 1px solid #eee;
	}
</style>