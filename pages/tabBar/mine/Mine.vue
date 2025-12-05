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

		<!-- 已登录状态（新增昵称展示） -->
		<view v-else class="login-container">
			<view class="user-info">
				<image src="/static/avatar.png" class="avatar"></image>
				<view class="user-text"> <!-- 新增外层容器 -->
					<text class="username">{{ userInfo.username }}</text>
					<text class="nickname">昵称：{{ userInfo.nickname || '未设置' }}</text> <!-- 昵称展示 -->
				</view>
			</view>
			<view class="mine-list">
				<view class="mine-item">
					<text class="item-icon">⭐</text>
					<text class="item-text">我的收藏</text>
				</view>
				<view class="mine-item">
					<text class="item-icon">🕒</text>
					<text class="item-text">浏览历史</text>
				</view>
				<view class="mine-item">
					<text class="item-icon">💬</text>
					<text class="item-text">我的评论</text>
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
				} // 默认未登录
			};
		},
		onShow() {
			// 页面显示时，从本地存储读取登录状态（刷新页面状态）
			this.getUserStatus();
		},
		methods: {
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				console.log('当前用户信息：', user); // 新增日志，校验昵称是否存在
				this.userInfo = user;

				// 若已登录，确保TabBar文字是“我的”
				if (user.isLogin) {
					uni.setTabBarItem({
						index: 3,
						text: "我的"
					});
				} else {
					// 未登录，TabBar文字改为“未登录”
					uni.setTabBarItem({
						index: 3,
						text: "未登录"
					});
				}
			},
			handleLogout() {
				// 退出登录：清除本地存储+更新状态
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
</style>