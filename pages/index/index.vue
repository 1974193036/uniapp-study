<template>
	<view class="container">
		<text class="left">left</text>
		<text class="center">center</text>
		<text class="right">right</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		@include flex(flex-start,column);
		color: $base-color;
	}
</style>
