<template>
	<view>
		<!-- 当用户为登录状态时进行显示 -->
		<view v-if="isLogin" class="my-header">
			<view class="my-header-background">
				<image :src="userInfo.avatar" mode="aspectFill"></image>
			</view>
			<view class="my-header-logo">
				<view class="my-header-logo-box" @click="changeAvatar">
					<image :src="userInfo.avatar" mode="aspectFill"></image>
				</view>
				<text class="user-name">
					{{userInfo.author_name}}
				</text>
			</view>
			<view class="my-header-info">
				<view class="my-header-info-box">
					<text class="my-header-info-title">被关注</text>
					<text>{{userInfo.follow_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-info-title">粉丝</text>
					<text>{{userInfo.fans_count}}</text>
				</view>
				<view class="my-header-info-box">
					<text class="my-header-info-title">积分</text>
					<text>{{userInfo.integral_count || 0}}</text>
				</view>
			</view>
		</view>

		<view class="my-content">
			<view v-if="!isLogin" class="my-content-list" @click="goLoginPage">
				<view class="my-content-list-title">
					<image class="company-logo" src="/static/img/logo.png" mode="aspectFill"></image>
					<text>HI，您尚未登录,请点击登录</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content-list" @click="goMyArticlePage">
				<view class="my-content-list-title">
					<uni-icons class="icons" type="contact" size="16" color="#666"></uni-icons>
					<text>我的文章</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<view class="my-content-list">
				<view class="my-content-list-title" @click="goFeedbackPage">
					<uni-icons class="icons" type="help" size="16" color="#666"></uni-icons>
					<text>意见反馈</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>

			<!-- #ifdef APP-PLUS -->
			<view class="my-content-list" @click="haveNewVersion&&getNewVersion()">
				<view class="my-content-list-title">
					<uni-icons class="icons" type="paperclip" size="16" color="#666"></uni-icons>
					<view class="version-container">
						<text>
							当前版本
							<text v-if="haveNewVersion" class="new-version-tip">(点击下载最新版本)</text>
						</text>
						<text class="version">{{currentVersion}}</text>
					</view>
				</view>
				<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
			</view>
			<!-- #endif -->

			<button v-if="isLogin" type="warn" class="sign-out" @click="siginOut">退出</button>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		storeToRefs
	} from 'pinia'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/store/user'

	const currentVersion = '1.0.0'
	const haveNewVersion = ref(false)
	const downLoadLinkUrl = ref('')

	onLoad(() => {
		// !判断是否有新版本进行下载及获取当前的版本
		// #ifdef APP-PLUS
		uni.getSystemInfo({
			success: (res) => {
				console.log(res)
				if (res.platform == "android") {
					plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
						// 获取当前版本
						currentVersion.value = wgitinfo
						// 检测是否有新版本
						checkVersion()
					})
				}
			}
		})
		// #endif
	})

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	const isLogin = computed(() => {
		return userInfo.value && userInfo.value.id
	})

	const {
		proxy
	} = getCurrentInstance()

	function siginOut() {
		userStore.reset()
		uni.switchTab({
			url: '/pages/index/index'
		})
	}

	// 跳转到登录界面
	function goLoginPage() {
		uni.navigateTo({
			url: '/pages/userInfo/login/login?navType=switchTab&pageUrl=/pages/self/self'
		})
	}

	// app中判断是否有新版本
	async function checkVersion() {
		const {
			version,
			downLoadLinkUrl: url
		} = await proxy.$http.get_current_version()
		if (version > currentVersion.value) {
			haveNewVersion.value = true
			downLoadLinkUrl.value = url
		}
	}

	function getNewVersion() {
		uni.showLoading({
			title: '下载中，请稍后'
		});
		var dtask = plus.downloader.createDownload(downLoadLinkUrl.value, {}, function(d, status) {
			// 下载完成  
			uni.hideLoading({})
			if (status == 200) {
				plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
					uni.showToast({
						title: '安装失败',
						duration: 1500,
						icon: 'none'
					});
				})
			} else {
				uni.showToast({
					title: '更新失败',
					duration: 1500,
					icon: 'none'
				});
			}
		})
		dtask.start()
	}

	// 跳转到我的文章界面
	function goMyArticlePage() {
		if (!isLogin.value) {
			uni.showToast({
				title: '请先登录',
				duration: 1500,
				icon: 'none'
			});
			return
		}
		uni.navigateTo({
			url: '/pages/myArticle/myArticle'
		})
	}

	// 跳转到意见反馈界面
	function goFeedbackPage() {
		uni.navigateTo({
			url: '/pages/feedback/feedback'
		})
	}

	// 修改用户图片
	function changeAvatar() {
		uni.chooseImage({
			count: 1,
			success: async res => {
				const filePath = await uploadFile(res.tempFilePaths[0], res.tempFiles[0].name)
				await updateUserAvatar(filePath)
			}
		})
	}
	async function uploadFile(filePath, cloudPath) {
		const {
			fileID
		} = await uniCloud.uploadFile({
			filePath,
			cloudPath
		})
		return fileID
	}

	// 上传图片内容
	async function updateUserAvatar(filePath) {
		const {
			msg
		} = await proxy.$http.update_user_avatar({
			userId: userInfo.value._id,
			filePath,
		})
		uni.showToast({
			title: msg,
			icon: 'none'
		})
		userStore.updateUserInfo({
			avatar: filePath
		})
	}
</script>

<style lang="scss" scoped>
	@import "./css/self.scss";
</style>