<template>
	<view class="save-incons" @click.stop="changeSaveStatus">
		<uni-icons color="#ff6600" type="heart-filled" size="20"></uni-icons>
	</view>
</template>

<script setup>
	function changeSaveStatus() {
		// 登录 改变当前的收藏状态
		// 没有登录 => 界面的跳转 => 用户登录的界面
		uni.navigateTo({
			url: '/pages/userInfo/login/login'
		})
	}
</script>

<style>

</style>