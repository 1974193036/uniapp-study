<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{ runTime ? `${time}秒后获取`: '获取验证码' }}
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance,
		onUnmounted
	} from 'vue'

	const emit = defineEmits(['getForm', 'setCurrentCode'])

	const runTime = ref(false)
	const timeId = ref(null)
	const INTERVAL = 60
	const time = ref(INTERVAL)
	
	const {
		proxy
	} = getCurrentInstance()

	function getForm() {
		if (runTime.value) return
		emit('getForm', _sendCode)
	}

	async function _sendCode(form) {
		const {
			phone
		} = await form.validateField(['phone'])
		// 开启定时器
		runTime.value = true
		timeRunning()
		
		// 发送数据请求到云函数
		const {
			msg,
			data: mobileCode
		} = await proxy.$http.get_code({
			phone
		})
		uni.showToast({
			title: msg,
			icon: 'none'
		})
		// console.log(mobileCode)
		emit('setCurrentCode', mobileCode)
	}

	function timeRunning() {
		timeId.value = setInterval(() => {
			if (time.value === 1) {
				clearInterval(timeId.value)
				runTime.value = false
				time.value = INTERVAL
			}
			time.value--
		}, 1000)
	}
	
	onUnmounted(() => {
		clearInterval(timeId.value)
		timeId.value = null
		runTime.value = false
		time.value = INTERVAL
	})
</script>

<style lang="scss" scoped>
	.code-container {
		flex-shrink: 0;
		margin-right: 20rpx;

		.vCode-btn {
			background-color: $base-color;
			color: #FFFFFF;
			padding: 16rpx 20rpx;
			border-radius: 10rpx;
			opacity: .8;
		}
	}
</style>