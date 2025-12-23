<template>
	<view class="login-container">
		<view class="login-box">
			<view class="title">登录</view>
			<input class="input-field" placeholder="请输入用户名" v-model="username" />
			<input class="input-field" type="password" placeholder="请输入密码" v-model="password" />
			<!-- 可选：新增登录方式提示（非必填） -->
			<view class="login-tip">也可使用注册时的手机号/邮箱登录（暂仅支持用户名）</view>
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
			// 整合后的登录核心方法（保留原有逻辑 + 优化体验）
			handleLogin() {
				// 1. 基础校验（保留原有逻辑）
				if (!this.username || !this.password) {
					uni.showToast({
						title: '请输入账号密码',
						icon: 'none'
					});
					return;
				}

				// 2. 调用登录云函数（整合新逻辑，保留原有云函数名userLogin）
				uniCloud.callFunction({
					name: 'userLogin', // 保持你原有云函数名，无需改为checkUser
					data: {
						username: this.username,
						password: this.password
					},
					success: (res) => {
						console.log('登录云函数返回：', res); // 新增调试日志
						if (res.result.code === 200) {
							// 3. 保存登录状态（保留你原有复杂状态存储逻辑）
							uni.setStorageSync('userInfo', {
								isLogin: true,
								username: res.result.account.username, // 用户名
								userId: res.result.account.user_id, // 用户ID
								nickname: res.result.account.nickname || res.result.account
									.username, // 补全昵称字段（mine.vue要读取）
								avatar: res.result.account.avatar || '', // 补全头像字段（mine.vue要读取）
								detail: res.result.userInfo
							});

							// 4. 登录成功提示 + TabBar切换 + 跳转（保留原有逻辑）
							// 登录成功后的跳转（原setTimeout可能导致切换不及时）
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
							// 立即更新TabBar，再跳转
							uni.setTabBarItem({
								index: 3,
								text: '我的'
							});
							// 延迟跳转确保TabBar更新完成
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/mine/Mine'
								}); // 跳转到「我的」页面，而非新闻页
							}, 500);
							uni.switchTab({
								url: '/pages/tabBar/news/News'
							});
						} else {
							// 5. 登录失败处理（保留原有逻辑）
							uni.showToast({
								title: res.result.message || '用户名或密码错误',
								icon: 'none'
							});
							this.password = ''; // 清空密码，防止重复提交
						}
					},
					fail: (err) => {
						// 6. 网络异常处理（优化提示文案）
						uni.showToast({
							title: '网络异常，登录失败',
							icon: 'none'
						});
						console.error('登录云函数调用失败：', err); // 优化日志提示
					}
				});
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

	/* 新增登录提示样式 */
	.login-tip {
		font-size: 22rpx;
		color: #999;
		margin-bottom: 20rpx;
		text-align: right;
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