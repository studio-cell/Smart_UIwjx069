<template>
	<view class="detail-container">
		<!-- 新闻标题区域 -->
		<view class="news-header">
			<text class="news-title">{{ news.title }}</text>
			<view class="news-meta">
				<text class="author" @click="goToAuthorHome">{{ news.author }}</text>
				<!-- 关注按钮 -->
				<button class="follow-btn" :class="{ followed: isFollowed }" @click="handleFollow">
					{{ isFollowed ? '已关注' : '+ 关注' }}
				</button>
				<text class="publish-time">{{ news.time }}</text>
				<text class="comment-count">{{ news.comments }} 评论</text>
			</view>
		</view>

		<!-- 新闻内容区域 -->
		<scroll-view scroll-y class="news-content">
			<view class="content-wrapper">
				<!-- 新闻封面图 -->
				<image v-if="news.cover" :src="news.cover" class="news-cover" mode="widthFix"></image>
				<!-- 新闻正文 -->
				<rich-text class="news-text" :nodes="news.content || news.summary"></rich-text>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="news-footer">
			<view class="footer-btn" @click="handleCollect">
				<text class="iconfont">★</text>
				<text class="btn-text">收藏</text>
			</view>
			<view class="footer-btn" @click="handleShare">
				<text class="iconfont">♡</text>
				<text class="btn-text">分享</text>
			</view>
			<view class="footer-btn" @click="handleComment">
				<text class="iconfont">💬</text>
				<text class="btn-text">评论</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: {}, // 新闻详情数据
				newsList: [], // 新闻列表数据（用于返回列表时保持状态）
				isFollowed: false, // 是否关注该作者
				authorId: '' // 新闻作者ID（从新闻数据中获取）
			};
		},
		onLoad(options) {
			// 接收从列表页传递的新闻数据
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('transferNewsData', (data) => {
				this.news = data.news || {};
				this.newsList = data.newsList || [];
				// 获取作者ID（假设新闻数据中包含authorId字段，若无则用author名称作为标识）
				this.authorId = this.news.authorId || this.news.author;

				// 加载完成后查询关注状态
				this.checkFollowStatus();
			});

			// 如果是从分享/刷新进入，从参数获取nid并请求详情
			if (options.nid) {
				this.getNewsDetail(options.nid);
			}
		},
		methods: {
			/**
			 * 查询作者关注状态
			 */
			async checkFollowStatus() {
				const userInfo = uni.getStorageSync('userInfo');
				// 未登录/无作者ID时不查询
				if (!userInfo?.isLogin || !this.authorId) return;

				try {
					// 调用云函数查询关注状态
					const res = await uniCloud.callFunction({
						name: 'follow-check',
						data: {
							userId: userInfo.userId, // 当前登录用户ID
							authorId: this.authorId // 新闻作者ID
						}
					});
					// 回显关注状态
					this.isFollowed = res.result?.data?.isFollowed || false;
				} catch (error) {
					console.error('查询关注状态失败：', error);
					uni.showToast({
						title: '查询关注状态失败',
						icon: 'none'
					});
				}
			},

			/**
			 * 点击关注/取消关注
			 */
			async handleFollow() {
				const userInfo = uni.getStorageSync('userInfo');
				// 未登录则跳转到登录页
				if (!userInfo?.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}

				// 无作者ID时提示
				if (!this.authorId) {
					uni.showToast({
						title: '作者信息异常',
						icon: 'none'
					});
					return;
				}

				try {
					// 调用关注/取消关注云函数
					const res = await uniCloud.callFunction({
						name: 'follow-toggle',
						data: {
							userId: userInfo.userId,
							authorId: this.authorId,
							isFollowed: !this.isFollowed // 切换关注状态
						}
					});

					if (res.result?.code === 200) {
						this.isFollowed = !this.isFollowed; // 本地更新状态
						uni.showToast({
							title: this.isFollowed ? '关注成功' : '取消关注成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.result?.msg || '操作失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('关注操作失败：', error);
					uni.showToast({
						title: '网络异常，操作失败',
						icon: 'none'
					});
				}
			},

			/**
			 * 获取新闻详情（备用：从接口获取）
			 */
			async getNewsDetail(nid) {
				try {
					const res = await uniCloud.callFunction({
						name: 'news-detail',
						data: {
							nid
						}
					});
					if (res.result?.code === 200) {
						this.news = res.result.data;
						this.authorId = this.news.authorId || this.news.author;
						this.checkFollowStatus(); // 重新查询关注状态
					}
				} catch (error) {
					console.error('获取新闻详情失败：', error);
					uni.showToast({
						title: '获取新闻详情失败',
						icon: 'none'
					});
				}
			},

			/**
			 * 跳转到作者主页
			 */
			goToAuthorHome() {
				if (!this.authorId) return;
				uni.navigateTo({
					url: `/pages/author/Author?authorId=${this.authorId}&authorName=${this.news.author}`
				});
			},

			/**
			 * 收藏新闻
			 */
			handleCollect() {
				// 收藏逻辑（可结合关注状态，已登录才能收藏）
				const userInfo = uni.getStorageSync('userInfo');
				if (!userInfo?.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: '收藏成功',
					icon: 'success'
				});
			},

			/**
			 * 分享新闻
			 */
			handleShare() {
				uni.share({
					title: this.news.title,
					path: `/pages/newsDetail/NewsDetail?nid=${this.news.nid}`
				});
			},

			/**
			 * 评论新闻
			 */
			handleComment() {
				uni.navigateTo({
					url: `/pages/comment/Comment?nid=${this.news.nid}`
				});
			}
		}
	};
</script>

<style scoped>
	.detail-container {
		background-color: #fff;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 新闻标题区域 */
	.news-header {
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.news-title {
		font-size: 36rpx;
		font-weight: bold;
		line-height: 1.5;
		margin-bottom: 20rpx;
		display: block;
	}

	.news-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 20rpx;
		font-size: 24rpx;
		color: #999;
	}

	.author {
		color: #409eff;
	}

	/* 关注按钮样式 */
	.follow-btn {
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
		border: 1px solid #409eff;
		color: #409eff;
		background: #fff;
		font-size: 22rpx;
		line-height: 1;
	}

	.follow-btn.followed {
		background: #409eff;
		color: #fff;
		border-color: #409eff;
	}

	/* 新闻内容区域 */
	.news-content {
		flex: 1;
		padding: 20rpx 30rpx;
	}

	.news-cover {
		width: 100%;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.news-text {
		font-size: 28rpx;
		line-height: 1.8;
		color: #333;
	}

	/* 底部操作栏 */
	.news-footer {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;
		border-top: 1px solid #f5f5f5;
		background: #fff;
	}

	.footer-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.iconfont {
		font-size: 32rpx;
		margin-bottom: 6rpx;
		color: #666;
	}

	.btn-text {
		font-size: 22rpx;
		color: #999;
	}
</style>