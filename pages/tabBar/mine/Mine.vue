<template>
	<view class="mine-container">
		<!-- 未登录状态 -->
		<view v-if="!userInfo.isLogin" class="unlogin-container">
			<text class="unlogin-text">HI~ 欢迎回来</text>
			<navigator url="/pages/login/login" class="login-btn">登录</navigator>
			<view class="unlogin-desc">
				登录后可查看收藏、历史、发表评论
			</view>
		</view>

		<!-- 已登录状态 -->
		<view v-else class="login-container">
			<view class="user-info">
				<image src="/static/avatar.png" class="avatar"></image>
				<view class="user-text">
					<text class="username">{{ userInfo.username }}</text>
					<text class="nickname">昵称：{{ userInfo.nickname || '未设置' }}</text>
				</view>
			</view>
			<view class="mine-list">
				<!-- 我的收藏：添加跳转 -->
				<view class="mine-item" @click="goToCollection">
					<text class="item-icon">⭐</text>
					<text class="item-text">我的收藏</text>
					<text class="item-arrow">＞</text>
				</view>
				<!-- 浏览历史：添加跳转 -->
				<view class="mine-item" @click="goToHistory">
					<text class="item-icon">🕒</text>
					<text class="item-text">浏览历史</text>
					<text class="item-arrow">＞</text>
				</view>
				<!-- 我的评论：添加跳转 -->
				<view class="mine-item" @click="goToComment">
					<text class="item-icon">💬</text>
					<text class="item-text">我的评论</text>
					<text class="item-arrow">＞</text>
				</view>
				<view class="mine-item" @click="handleLogout">
					<text class="item-icon">🚪</text>
					<text class="item-text">退出登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					isLogin: false
				}
			};
		},
		onShow() {
			this.getUserStatus();
		},
		methods: {
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				console.log('当前用户信息：', user);
				this.userInfo = user;
				if (user.isLogin) {
					uni.setTabBarItem({
						index: 3,
						text: "我的"
					});
				} else {
					uni.setTabBarItem({
						index: 3,
						text: "未登录"
					});
				}
			},
			handleLogout() {
				uni.removeStorageSync("userInfo");
				this.userInfo = {
					isLogin: false
				};
				uni.setTabBarItem({
					index: 3,
					text: "未登录"
				});
				uni.showToast({
					title: "已退出登录"
				});
			},
			// 跳转到我的收藏页
			goToCollection() {
				uni.navigateTo({
					url: "/pages/mine/collection/collection"
				});
			},
			// 跳转到浏览历史页
			goToHistory() {
				uni.navigateTo({
					url: "/pages/mine/history/history"
				});
			},
			// 跳转到我的评论页
			goToComment() {
				uni.navigateTo({
					url: "/pages/mine/comment/comment"
				});
			}
		}
	};
</script>

<style scoped>
	.mine-container {
		background-color: #f7f7f7;
		min-height: 100vh;
		padding: 20rpx;
	}

	/* 未登录样式 */
	.unlogin-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 200rpx;
	}

	.unlogin-text {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 40rpx;
	}

	.login-btn {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #d00;
		color: #fff;
		border-radius: 35rpx;
		font-size: 28rpx;
		text-decoration: none;
		margin-bottom: 20rpx;
	}

	.unlogin-desc {
		font-size: 22rpx;
		color: #999;
	}

	/* 已登录样式 */
	.login-container {
		margin-top: 30rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	/* 新增用户文字容器样式 */
	.user-text {
		display: flex;
		flex-direction: column;
	}

	.username {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	/* 新增昵称样式 */
	.nickname {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.mine-list {
		background: #fff;
		border-radius: 12rpx;
		padding: 10rpx 0;
	}

	.mine-item {
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.item-icon {
		font-size: 32rpx;
		margin-right: 20rpx;
		color: #d00;
	}

	.item-text {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}

	.item-arrow {
		font-size: 24rpx;
		color: #999;
	}
</style>