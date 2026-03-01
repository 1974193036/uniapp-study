<template>
	<view class="comment-box">
		<view class="comment-header">
			<view class="comment-header-logo">
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<view class="title" v-if="!commentData.is_reply">
					{{commentData.author.author_name}}
				</view>
				<!-- 当评论为指定评论的时候，进行为谁回复的提示信息 -->
				<view v-else class="title">
					{{commentData.author.author_name}}
					<text class="reply-text">回复</text>
					{{commentData.to}}
				</view>
				<view class="">
					<uni-dateformat :date="commentData.create_time" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
				</view>
			</view>
		</view>
		<!-- 内容部分 -->
		<view class="comment-content">
			<view class="">
				{{commentData.comment_content}}
			</view>
			<view class="comment-info">
				<view class="comment-button" @click="commnetReply({comment:commentData,isReply})">
					回复
				</view>
			</view>
			<view class="comment-reply-list" v-for="item in commentData.replyArr" :key="item._comment_id">
				<CommentBox :isReply="true" @commnetReply="commnetReply" :commentData="item"></CommentBox>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		commentData: {
			type: Object,
			default: () => ({
				comment_id: '',
				comment_content: ''
			})
		},
		isReply: {
			type: Boolean,
			default: false
		}
	})

	const emit = defineEmits(['commnetReply'])

	function commnetReply(data) {
		// 区分主回复还是子回复
		if (data.isReply) {
			data.comment.reply_id = data.comment.comment_id
			data.comment.comment_id = props.commentData.comment_id
		}
		emit('commnetReply', data)
	}
</script>

<style lang="scss" scoped>
	@import "./css/CommentBox.scss";
</style>