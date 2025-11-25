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
				// 1. 非空校验
				if (!this.username || !this.password) {
					uni.showToast({
						title: '请输入完整的用户名和密码',
						icon: 'none'
					});
					return; // 阻止后续逻辑
				}

				// 2. 模拟固定账号密码校验（实际项目替换为接口请求）
				// 假设测试账号：wjx  密码：123456
				if (this.username === 'wjx' && this.password === '123456') {
					// 2.1 显示加载提示（模拟登录中）
					uni.showLoading({
						title: '登录中...'
					});

					// 2.2 模拟接口请求延迟
					setTimeout(() => {
						uni.hideLoading(); // 关闭加载

						// ### 【新增代码块 1：保存登录状态】 ###
						// 将用户信息（用户名和登录状态）保存到本地存储
						uni.setStorageSync('userInfo', {
							username: this.username,
							isLogin: true
						});
						// ### 【新增代码块 1 结束】 ###

						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});

						// ### 【修改代码块 1：调整跳转目标】 ###
						// 登录成功后，跳转到 TabBar 的 "新闻" 首页（根据你的 pages.json 配置）
						// 注意：请确保 '/pages/tabBar/news/News' 是你想要跳转的首页路径
						uni.switchTab({
							url: '/pages/tabBar/news/News'
						});

						// ### 【新增代码块 2：切换TabBar文字】 ###
						// 延迟执行，确保在切换到TabBar页面后生效
						setTimeout(() => {
							uni.setTabBarItem({
								index: 3, // TabBar的第4项（索引从0开始）
								text: "我的" // 将文字从“未登录”改为“我的”
							});
						}, 500);
						// ### 【新增代码块 2 结束】 ###

					}, 1000); // 延迟 1 秒，模拟接口响应时间
				} else {
					// 3. 账号或密码错误提示
					uni.showToast({
						title: '账号或密码错误，请重新输入',
						icon: 'none'
					});
					// 清空密码框，方便重新输入
					this.password = '';
				}
			}
		}
	};
</script>

<style scoped>
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