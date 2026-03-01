<template>
	<view class="article-detail-container">
		<view class="detail-title">
			{{articleData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author?.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{articleData.author?.author_name}}
				</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}} 浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="followAuthor">
				{{isFollowAuthor ? '取消关注作者' : '关注作者'}}
			</button>
		</view>
		<view class="detail-content-container">
			<view class="detail-html">
				<UParse className="markdown-body" :content="content"></UParse>
			</view>

			<!-- 评论展示组件 -->
			<view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
					<CommentBox :commentData="item" @commnetReply="commnetReply"></CommentBox>
				</view>
				<view class="no-data" v-if="!commentList.length">暂无评论</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<view class="detail-bottom" :style="{'padding-bottom': paddingBottom}">
			<view class="input-container" @click="openMaskerComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom-icon-box">
					<!-- <uni-icons type="heart" size="22" color="#f07373"></uni-icons> -->
					<SaveLikes size="22" class="detail-bottom-icon-box" :item="articleData">
					</SaveLikes>
				</view>
				<view class="detail-bottom-icon-box">
					<uni-icons :type="isCompliments ? 'hand-up-filled' : 'hand-up'" size="22" color="#f07373"
						@click="updateCompliments"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 评论组件弹窗 -->
		<CommentMasker @sendCommentData="sendCommentData" @closePopupMasker="showPopup=$event" :showPopup="showPopup">
		</CommentMasker>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance,
		computed,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		storeToRefs
	} from 'pinia'
	import {
		marked
	} from 'marked'
	import UParse from '@/components/u-parse/u-parse.vue'
	import {
		useUserStore
	} from '@/store/user'

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	const showPopup = ref(false)
	const articleData = ref({})
	const commentList = ref([])
	const replyData = ref({})

	onLoad((...options) => {
		articleData.value = JSON.parse(options[0].params);

		/* 获取文章详情 */
		getArticleDetail()

		/* 获取评论列表 */
		getCommentList()
	})

	const {
		proxy
	} = getCurrentInstance()

	async function getArticleDetail() {
		const data = await proxy.$http.get_article_detail({
			article_id: articleData.value._id
		})
		articleData.value = data
	}

	async function getCommentList() {
		const res = await proxy.$http.get_comments({
			articleId: articleData.value._id
		})
		commentList.value = res
	}

	const content = computed(() => {
		try {
			return marked(articleData.value.content)
		} catch (e) {
			return null
		}
	})

	// 打开弹窗遮罩层
	async function openMaskerComment() {
		await userStore.checkedIsLogin()
		showPopup.value = true
	}

	async function sendCommentData(content) {
		const {
			msg
		} = await proxy.$http.update_comment({
			articleId: articleData.value._id,
			userId: userStore.userInfo._id,
			content,
			...replyData.value,
		})
		uni.showToast({
			title: msg,
		})
		showPopup.value = false
		getCommentList()
		replyData.value = {}
	}

	/* 处理回复事件函数 */
	function commnetReply(data) {
		replyData.value = {
			"comment_id": data.comment.comment_id,
			is_reply: data.isReply
		}
		// 当前为回复内容的时候添加回复的ID
		data.comment.reply_id && (replyData.value.reply_id = data.comment.reply_id)
		// console.log(replyData.value)
		openMaskerComment()
	}

	const paddingBottom = ref('14px')
	onMounted(() => {
		const {
			safeAreaInsets
		} = uni.getWindowInfo()
		if (safeAreaInsets.bottom > 0) {
			paddingBottom.value = safeAreaInsets.bottom + 'px'
		}
	})

	// 是否关注这篇文章的作者
	const isFollowAuthor = computed(() => {
		try {
			return userInfo.value.id && userInfo.value.author_likes_ids.includes(articleData.value.author.id)
		} catch (e) {
			return false
		}
	})

	/* 关注作者 */
	async function followAuthor() {
		// 用户检测
		await userStore.checkedIsLogin()
		const {
			msg
		} = await proxy.$http.update_follow_author({
			authorId: articleData.value.author.id,
			userId: userInfo.value._id
		})
		uni.showToast({
			title: msg,
		})
		//处理用户存储信息
		let followIds = [...userInfo.value.author_likes_ids]
		if (followIds.includes(articleData.value.author.id)) {
			followIds = followIds.filter(item => item !== articleData.value.author.id)
		} else {
			followIds.push(articleData.value.author.id)
		}
		userStore.updateUserInfo({
			author_likes_ids: followIds
		})
	}

	// 是否显示点赞
	const isCompliments = computed(() => {
		try {
			return userInfo.value.id && userInfo.value.thumbs_up_article_ids.includes(articleData.value._id)
		} catch (e) {
			return false
		}
	})

	// 更新点赞
	async function updateCompliments() {
		// 用户检测
		await userStore.checkedIsLogin()

		const {
			msg
		} = await proxy.$http.update_compliments({
			articleId: articleData.value._id,
			userId: userInfo.value._id
		})
		msg && uni.showToast({
			title: msg,
		})
		// 修改用户信息
		let thumbsArr = [...userInfo.value.thumbs_up_article_ids]
		if (thumbsArr.includes(articleData.value._id)) {
			// 取消点赞
			articleData.value.thumbs_up_count -= 1
			thumbsArr = thumbsArr.filter(item => item !== articleData.value._id)
		} else {
			// 增加点赞
			articleData.value.thumbs_up_count += 1
			thumbsArr.push(articleData.value._id)
		}
		userStore.updateUserInfo({
			thumbs_up_article_ids: thumbsArr
		})
	}
</script>

<style lang="scss" scoped>
	@import './css/articleDetail.scss'
</style>