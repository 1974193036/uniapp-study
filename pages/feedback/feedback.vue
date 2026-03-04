<template>
	<view>
		<view class="feedback-title">
			意见反馈：
		</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
		</view>

		<view class="feedback-title">
			反馈图片：
		</view>

		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item,index) in imageList" :key="index">
				<view class="close-icon" @click="delImage(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 添加图片的icon -->
			<view v-if="imageList.length < 5" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>

		<button type="warn" class="feedback-button" @click="submitFeedback">提交反馈意见</button>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		storeToRefs
	} from 'pinia'
	import {
		useUserStore
	} from '@/store/user'

	const content = ref('')
	const imageList = ref([])
	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	// 添加图片
	async function addImage() {
		const count = 5 - imageList.value.length
		uni.chooseImage({
			count,
			success: res => {
				// console.log(res)
				const tempFilePaths = res.tempFilePaths
				tempFilePaths.forEach((url, index) => {
					if (index < count) {
						imageList.value.push({
							url,
							name: res.tempFiles[index].name
						})
					}
				})
			}
		})
	}

	// 图片删除
	function delImage(index) {
		imageList.value.splice(index, 1)
	}

	// 发送意见反馈的内容
	const {
		proxy
	} = getCurrentInstance()
	
	async function submitFeedback() {
		if (!content.value) {
			uni.showToast({
				title: '文本内容不能为空',
				icon: 'none'
			})
			return
		}
		uni.showLoading()
		const feedbackImageList = await Promise.all(getFileId())
		console.log('feedbackImageList', feedbackImageList)
		const {
			msg
		} = await proxy.$http.update_feedback({
			content: content.value,
			feedbackImageList,
			userId: userInfo.value._id
		})
		uni.hideLoading()
		uni.showToast({
			title: msg,
		})
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/self/self'
			})
		}, 1500)
	}

	// 获取所有的id结果
	function getFileId() {
		return imageList.value.map(item => {
			return new Promise(async resolve => {
				const result = await uniCloud.uploadFile({
					filePath: item.url,
					cloudPath: item.name
				})
				resolve(result.fileID)
			})
		})
	}
</script>

<style lang="scss" scoped>
	@import './css/feedback.scss';
</style>