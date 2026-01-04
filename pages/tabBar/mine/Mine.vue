<template>
	<view class="mine-container">
		<!-- 未登录状态 -->
		<view v-if="!userInfo.isLogin" class="unlogin" @click="goToLogin">
			<text class="login-icon">👤</text>
			<text class="login-text">点击登录/注册</text>
		</view>

		<!-- 已登录状态 -->
		<view v-else class="user-info">
			<view class="user-info-bg">
				<!-- 渐变背景层 -->
				<view class="bg-gradient"></view>
				<!-- 用户信息内容 -->
				<view class="user-info-content">
					<view class="user-info-main">
						<view class="avatar-wrapper" @click="handleAvatarClick">
							<image class="avatar" :src="userInfo.avatar || '/static/avatar.png'" mode="aspectFill"></image>
							<view class="avatar-mask">
								<text class="avatar-icon">📷</text>
								<text class="avatar-text">更换头像</text>
							</view>
						</view>
						<view class="user-detail">
							<text class="username">{{ userInfo.username }}</text>
							<text class="user-desc">昵称：{{ userInfo.nickname || '未设置' }}</text>
						</view>
					</view>
					<button class="logout-btn" @click="handleLogout">退出登录</button>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="function-list" v-if="userInfo.isLogin">
			<view class="function-item" @click="goToCollection" hover-class="item-hover">
				<view class="item-icon-wrap collection-icon">
					<text class="item-icon">⭐</text>
				</view>
				<text class="item-text">我的收藏</text>
				<text class="item-arrow">＞</text>
			</view>
			<view class="function-item" @click="goToComment" hover-class="item-hover">
				<view class="item-icon-wrap comment-icon">
					<text class="item-icon">💬</text>
				</view>
				<text class="item-text">我的评论</text>
				<text class="item-arrow">＞</text>
			</view>
			<view class="function-item" @click="goToHistory" hover-class="item-hover">
				<view class="item-icon-wrap history-icon">
					<text class="item-icon">🕒</text>
				</view>
				<text class="item-text">浏览历史</text>
				<text class="item-arrow">＞</text>
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

			// 点击头像处理
			handleAvatarClick() {
				uni.showActionSheet({
					itemList: ['从相册选择', '拍照', '查看大图'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								this.chooseFromAlbum();
								break;
							case 1:
								this.takePhoto();
								break;
							case 2:
								this.viewAvatar();
								break;
						}
					}
				});
			},

			// 从相册选择
			chooseFromAlbum() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 压缩图片
					sourceType: ['album'],
					success: (res) => {
						this.uploadAvatar(res.tempFilePaths[0]);
					}
				});
			},

			// 拍照
			takePhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: (res) => {
						this.uploadAvatar(res.tempFilePaths[0]);
					}
				});
			},

			// 上传头像
			uploadAvatar(filePath) {
				uni.showLoading({
					title: '上传中...',
					mask: true
				});

				// 先上传到云存储
				uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: `avatar/${this.userInfo.userId}_${Date.now()}.jpg`,
					success: (uploadRes) => {
						console.log('上传成功：', uploadRes);

						// 获取文件URL
						const avatarUrl = uploadRes.fileID;

						// 调用云函数更新头像
						uniCloud.callFunction({
							name: 'user-updateAvatar',
							data: {
								userId: this.userInfo.userId,
								avatarUrl: avatarUrl
							},
							success: (res) => {
								console.log('更新头像成功：', res);
								if (res.result.code === 200) {
									// 更新本地存储
									this.userInfo.avatar = avatarUrl;
									const userInfo = uni.getStorageSync('userInfo') || {};
									userInfo.avatar = avatarUrl;
									uni.setStorageSync('userInfo', userInfo);

									uni.showToast({
										title: '头像更新成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: res.result.message || '更新失败',
										icon: 'none'
									});
								}
							},
							fail: (err) => {
								console.error('更新头像失败：', err);
								uni.showToast({
									title: '网络异常，请重试',
									icon: 'none'
								});
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					},
					fail: (err) => {
						console.error('上传失败：', err);
						uni.hideLoading();
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						});
					}
				});
			},

			// 查看大图
			viewAvatar() {
				uni.previewImage({
					urls: [this.userInfo.avatar || '/static/avatar.png'],
					current: 0
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
		padding: 0;
		min-height: 100vh;
		background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
	}

	/* 未登录状态样式升级 */
	.unlogin {
		margin: 20rpx 20rpx 30rpx;
		height: 180rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.2);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.unlogin::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
		animation: rotate 20s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.unlogin:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
	}

	.login-icon {
		font-size: 48rpx;
		margin-bottom: 12rpx;
		position: relative;
		z-index: 1;
	}

	.login-text {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
		position: relative;
		z-index: 1;
	}

	/* 已登录用户信息样式升级 */
	.user-info {
		margin: 20rpx 20rpx 30rpx;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.15);
	}

	.user-info-bg {
		position: relative;
	}

	/* 渐变背景层 */
	.bg-gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		z-index: 1;
	}

	.user-info-content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: 30rpx 30rpx 40rpx;
		background: #ffffff;
	}

	.user-info-main {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.avatar-wrapper {
		position: relative;
		width: 130rpx;
		height: 130rpx;
		margin-right: 24rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 4rpx solid #ffffff;
		box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.2);
	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.avatar-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.avatar-wrapper:active .avatar-mask {
		opacity: 1;
	}

	.avatar-icon {
		font-size: 36rpx;
		margin-bottom: 4rpx;
	}

	.avatar-text {
		font-size: 18rpx;
		color: #ffffff;
	}

	.user-detail {
		flex: 1;
	}

	.username {
		font-size: 36rpx;
		font-weight: 600;
		color: #303133;
		display: block;
		margin-bottom: 10rpx;
		letter-spacing: 1rpx; /* 字间距更舒适 */
	}

	.user-desc {
		font-size: 24rpx;
		color: #909399;
		line-height: 1.4;
	}

	.logout-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff5f5;
		color: #e63946;
		border-radius: 16rpx;
		font-size: 30rpx;
		font-weight: 500;
		border: 2rpx solid #ffebee;
		transition: all 0.3s ease;
	}

	.logout-btn:active {
		background-color: #ffebee;
		transform: scale(0.98);
	}

	/* 功能列表样式升级 */
	.function-list {
		margin: 0 20rpx 40rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.function-item {
		display: flex;
		align-items: center;
		padding: 30rpx 30rpx;
		border-bottom: 1rpx solid #f5f7fa; /* 更柔和的分隔线 */
		transition: all 0.2s ease;
	}

	/* 最后一个项去掉分隔线 */
	.function-item:last-child {
		border-bottom: none;
	}

	/* 点击悬浮样式 */
	.item-hover {
		background-color: #f8f9fa;
	}

	/* 图标包裹层（增加背景更精致） */
	.item-icon-wrap {
		width: 80rpx;
		height: 80rpx;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
	}

	.collection-icon {
		background-color: #fef7f2;
	}

	.comment-icon {
		background-color: #f0f9ff;
	}

	.history-icon {
		background-color: #f5fafe;
	}

	.item-icon {
		font-size: 36rpx;
		color: #409eff;
	}

	.item-text {
		flex: 1;
		font-size: 30rpx;
		color: #303133;
		font-weight: 500;
	}

	.item-arrow {
		font-size: 28rpx;
		color: #c0c4cc;
		transition: all 0.2s ease;
	}

	.function-item:active .item-arrow {
		transform: translateX(4rpx);
	}
</style>