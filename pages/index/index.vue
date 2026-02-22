<template>
	<view class="home-container">
		<NavBar></NavBar>
		<view v-for="item in 100" :key="item">
			{{item}}
		</view>
	</view>
</template>

<script>

</script>

<style lang="scss" scoped>

</style>