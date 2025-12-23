<template>
	<view class="mine-container">
		<!-- 未登录状态 -->
		<view v-if="!userInfo.isLogin" class="unlogin" @click="goToLogin">
			<text class="login-text">点击登录</text>
		</view>

		<!-- 已登录状态（简化头像：只显示，暂不上传） -->
		<view v-else class="user-info">
			<image class="avatar" :src="userInfo.avatar || '/static/avatar.png'" mode="aspectFill"></image>
			<view class="user-detail">
				<text class="username">{{ userInfo.username }}</text>
				<text class="user-id">昵称：{{ userInfo.nickname || '未设置' }}</text>
			</view>
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>

		<!-- 功能列表 -->
		<view class="function-list" v-if="userInfo.isLogin">
			<view class="function-item" @click="goToCollection">
				<text class="item-icon">⭐</text>
				<text class="item-text">我的收藏</text>
				<text class="item-arrow">→</text>
			</view>
			<view class="function-item" @click="goToComment">
				<text class="item-icon">💬</text>
				<text class="item-text">我的评论</text>
				<text class="item-arrow">→</text>
			</view>
			<view class="function-item" @click="goToHistory">
				<text class="item-icon">🕒</text>
				<text class="item-text">浏览历史</text>
				<text class="item-arrow">→</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					isLogin: false,
					avatar: '' // 头像字段保留，用于显示
				}
			};
		},
		onShow() {
			this.getUserStatus();
		},
		methods: {
			// 获取用户登录状态
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				console.log('当前用户信息：', user);
				// 补全所有字段，避免undefined
				this.userInfo = {
					isLogin: user.isLogin || false,
					username: user.username || '',
					userId: user.userId || '',
					nickname: user.nickname || '',
					avatar: user.avatar || '',
					detail: user.detail || {}
				};
				uni.setTabBarItem({
					index: 3,
					text: this.userInfo.isLogin ? "我的" : "未登录"
				});
			},

			// 退出登录
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync("userInfo");
							this.userInfo = {
								isLogin: false,
								avatar: ''
							};
							uni.setTabBarItem({
								index: 3,
								text: "未登录"
							});
							uni.showToast({
								title: "已退出登录"
							});
						}
					}
				});
			},

			// 跳转我的收藏
			goToCollection() {
				uni.navigateTo({
					url: "/pages/mine/collection/collection"
				});
			},

			// 跳转浏览历史
			goToHistory() {
				uni.navigateTo({
					url: "/pages/mine/history/history"
				});
			},

			// 跳转我的评论
			goToComment() {
				uni.navigateTo({
					url: "/pages/mine/comment/comment"
				});
			},

			// 跳转登录页
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		}
	};
</script>

<style scoped>
	.mine-container {
		padding: 20rpx;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.unlogin {
		height: 160rpx;
		background-color: #fff;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.login-text {
		font-size: 32rpx;
		color: #999;
	}

	.user-info {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-detail {
		flex: 1;
	}

	.username {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
	}

	.user-id {
		font-size: 24rpx;
		color: #999;
	}

	.logout-btn {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #f5f5f5;
		color: #d00;
		border-radius: 30rpx;
		font-size: 24rpx;
	}

	.function-list {
		background-color: #fff;
		border-radius: 12rpx;
	}

	.function-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.item-icon {
		font-size: 32rpx;
		margin-right: 20rpx;
		width: 40rpx;
		text-align: center;
		color: #d00;
	}

	.item-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.item-arrow {
		font-size: 24rpx;
		color: #ccc;
	}
</style>