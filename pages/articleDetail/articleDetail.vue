<template>
	<view class="article-detail-container">
		<view class="detail-title">
			{{articleData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{articleData.author.author_name}}
				</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}} 浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button">取消关注</button>
		</view>
		<view class="detail-content-container">
			<view class="detail-html">
				<UParse className="markdown-body" :content="content"></UParse>
			</view>
		</view>
		<!-- 评论组件 -->
		<view class="detail-bottom">
			<view class="input-container">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom-icon-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom-icon-box">
					<uni-icons type="hand-up" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import { marked } from 'marked'
	import UParse from  '@/components/u-parse/u-parse.vue'

	const articleData = ref(null)

	onLoad((...options) => {
		articleData.value = JSON.parse(options[0].params);
		getArticleDetail()
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

	const content = computed(() => {
		try {
			return marked(articleData.value.content)
		} catch (e) {
			return null
		}
	})
</script>

<style lang="scss" scoped>
	@import './css/articleDetail.scss'
</style>