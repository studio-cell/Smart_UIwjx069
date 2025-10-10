<template>
	<view class="demos-container">
		<view class="page-title">DEMOS 页面</view>
		<navigator url="/pages/login/login" class="to-login-btn">前往登录页</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {}
	};
</script>

<style scoped>
	.demos-container {
		padding: 15rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	.to-login-btn {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 6rpx;
	}
</style>