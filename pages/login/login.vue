<template>
	<view class="login-container">
		<view class="login-box">
			<view class="title">登录</view>
			<input class="input-field" placeholder="请输入用户名" v-model="username" />
			<input class="input-field" type="password" placeholder="请输入密码" v-model="password" />
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
				username: '', // 恢复为 username（和数据库一致）
				password: ''
			};
		},
		methods: {
			handleLogin() {
				if (!this.username || !this.password) {
					uni.showToast({
						title: '请输入账号密码',
						icon: 'none'
					});
					return;
				}

				uniCloud.callFunction({
					name: 'userLogin',
					data: {
						username: this.username, // 传参用 username（和云函数一致）
						password: this.password
					},
					success: (res) => {
						console.log('登录云函数返回：', res);
						if (res.result.code === 200) {
							uni.setStorageSync('userInfo', {
								isLogin: true,
								username: res.result.account.username,
								userId: res.result.account.userId,
								nickname: res.result.account.nickname || res.result.account.username,
								avatar: res.result.account.avatar || '',
								detail: res.result.userInfo
							});

							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
							uni.setTabBarItem({
								index: 3,
								text: '我的'
							});
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/mine/Mine'
								});
							}, 500);
						} else {
							uni.showToast({
								title: res.result.message || '用户名或密码错误',
								icon: 'none'
							});
							this.password = '';
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络异常，登录失败',
							icon: 'none'
						});
						console.error('登录云函数调用失败：', err);
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