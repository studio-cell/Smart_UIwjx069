<template>
	<view class="login-container">
		<view class="login-box">
			<view class="title">登录</view>
			<input class="input-field" placeholder="请输入用户名" v-model="username" />
			<input class="input-field" type="password" placeholder="请输入密码" v-model="password" />
			<button class="login-btn" @click="handleLogin">登录</button>
			<view class="navigate-text">
				没有账号？<navigator url="/pages/register/register">去注册</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '', // 绑定用户名输入框
				password: '' // 绑定密码输入框
			};
		},
		methods: {
			handleLogin() {
				// 1. 非空校验（保持不变）
				if (!this.username || !this.password) {
					uni.showToast({
						title: '请输入完整的用户名和密码',
						icon: 'none'
					});
					return;
				}

				// 2. 关键修改：读取注册页保存的所有用户（不再用固定账号）
				const registeredUsers = uni.getStorageSync('registeredUsers') || [];
				// 查找是否有匹配的用户名和密码
				const matchedUser = registeredUsers.find(user => {
					return user.username === this.username && user.password === this.password;
				});

				// 3. 校验结果（匹配成功则登录，否则提示错误）
				if (matchedUser) {
					// 登录成功逻辑（保持不变）
					uni.showLoading({
						title: '登录中...'
					});

					setTimeout(() => {
						uni.hideLoading();
						// 保存登录状态
						uni.setStorageSync('userInfo', {
							username: this.username,
							isLogin: true
						});
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						// 跳转到新闻首页
						uni.switchTab({
							url: '/pages/tabBar/news/News'
						});
						// 切换TabBar文字
						setTimeout(() => {
							uni.setTabBarItem({
								index: 3,
								text: "我的"
							});
						}, 500);
					}, 1000);
				} else {
					// 账号或密码不匹配（保持不变）
					uni.showToast({
						title: '账号或密码错误，请重新输入',
						icon: 'none'
					});
					this.password = '';
				}
			}
		}
	};
</script>

<style scoped>
	/* 样式保持不变，无需修改 */
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.login-box {
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

	.login-btn {
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