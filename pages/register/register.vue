<template>
	<view class="register-container">
		<view class="register-box">
			<view class="title">注册</view>
			<input class="input-field" placeholder="请输入用户名" v-model="username" />
			<input class="input-field" type="password" placeholder="请输入密码" v-model="password" />
			<input class="input-field" type="password" placeholder="确认密码" v-model="confirmPassword" />
			<button class="register-btn" @click="handleRegister">注册</button>
			<view class="navigate-text">
				已有账号？<navigator url="/pages/login/login">去登录</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: ''
			};
		},
		methods: {
			handleRegister() {
				// 这里可以添加注册逻辑，比如调用接口创建账号
				uni.showToast({
					title: '注册点击效果',
					icon: 'none'
				});
			}
		}
	};
</script>

<style scoped>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.register-box {
		width: 80%;
		max-width: 500rpx;
		background-color: #fff;
		padding: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.input-field {
		width: 100%;
		height: 60rpx;
		border: 1px solid #ccc;
		border-radius: 6rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
	}

	.register-btn {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 6rpx;
	}

	.navigate-text {
		text-align: center;
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #666;
	}
</style>