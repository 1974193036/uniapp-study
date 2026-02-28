<template>
	<view class="comment-box">
		<view class="comment-header">
			<view class="comment-header-logo">
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<view class="title">
					{{commentData.author.author_name}}
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
				<view class="comment-button">
					回复
				</view>
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
	})
</script>

<style lang="scss" scoped>
	@import "./css/CommentBox.scss";
</style>