<template>
	<view class="code-container">
		<view class="vCode-btn">
			获取验证码
		</view>
	</view>
</template>

<script>
	export default {
		name: "SendCode",
		data() {
			return {

			}
		}
	}
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
