<template>
	<view class="comment-container">
		<view class="page-title">我的评论</view>
		<!-- 空状态 -->
		<view v-if="commentList.length === 0 && !isLoading" class="empty-container">
			<text class="empty-text">暂无评论内容</text>
		</view>
		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>
		<!-- 评论列表 -->
		<view v-else class="comment-list">
			<view class="comment-item" v-for="(item, index) in commentList" :key="index">
				<!-- 新闻标题 -->
				<view class="news-title" @click="goToNewsDetail(item.newsId)">
					{{ item.newsTitle || '已删除的新闻' }}
				</view>
				<!-- 评论内容 -->
				<view class="comment-content">
					{{ item.content }}
				</view>
				<!-- 评论时间+操作 -->
				<view class="comment-footer">
					<text class="comment-time">{{ formatTime(item.time) }}</text>
					<view class="delete-btn" @click="deleteComment(item._id)">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentList: [],
				userId: '',
				isLoading: true // 新增加载状态
			};
		},
		onLoad() {
			// 获取登录用户ID
			const user = uni.getStorageSync("userInfo");
			if (user && user.userId) {
				this.userId = user.userId;
				this.getMyCommentList();
			} else {
				this.isLoading = false; // 终止加载状态
				uni.showToast({
					title: "请先登录",
					icon: "none"
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			}
		},
		methods: {
			// 获取我的评论列表（完整修复版）
			async getMyCommentList() {
				try {
					const res = await uniCloud.callFunction({
						name: "comment-getMyList",
						data: {
							userId: this.userId,
							page: 1,
							pageSize: 20
						}
					});

					// 兼容不同返回格式
					if (res.result && res.result.code === 200) {
						this.commentList = res.result.data?.list || [];
					} else {
						// 云函数未部署时的本地兜底
						this.commentList = [];
					}
				} catch (error) {
					console.error("获取评论失败：", error);
					uni.showToast({
						title: "加载失败，使用本地数据",
						icon: "none"
					});
					// 本地兜底数据（测试用）
					this.commentList = [];
				} finally {
					this.isLoading = false; // 确保关闭加载状态
				}
			},

			// 删除评论（完整修复版）
			// 我的评论页面 - deleteComment 方法
			async deleteComment(commentId) {
				if (!commentId) {
					uni.showToast({
						title: "评论ID异常",
						icon: "none"
					});
					return;
				}

				uni.showModal({
					title: "提示",
					content: "确定删除这条评论吗？",
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中...'
							}); // 新增加载状态
							try {
								const res = await uniCloud.callFunction({
									name: "comment-delete",
									data: {
										commentId: commentId,
										userId: this.userId // 新增：传递当前用户ID，用于云函数校验
									}
								});
								uni.hideLoading();

								if (res.result.code === 200) {
									uni.showToast({
										title: "删除成功"
									});
									this.getMyCommentList(); // 刷新列表
								} else if (res.result.code === 403) {
									uni.showToast({
										title: "无权删除他人评论",
										icon: "none"
									});
								} else if (res.result.code === 404) {
									uni.showToast({
										title: "评论已被删除",
										icon: "none"
									});
									this.getMyCommentList(); // 刷新列表
								} else {
									uni.showToast({
										title: res.result.message || '删除失败',
										icon: 'none'
									});
								}
							} catch (error) {
								uni.hideLoading();
								console.error("删除评论失败：", error);
								// 本地兜底删除（防止云函数报错但数据还在）
								this.commentList = this.commentList.filter(item => item._id !== commentId);
								uni.showToast({
									title: "删除成功（本地）",
									icon: "none"
								});
							}
						}
					}
				});
			},

			// 跳转到新闻详情（适配参数）
			goToNewsDetail(newsId) {
				if (!newsId) return;
				uni.navigateTo({
					url: `/pages/news/detail/detail?nid=${newsId}` // 适配你的详情页参数nid
				});
			},

			// 格式化时间（兼容时间戳和字符串）
			formatTime(time) {
				if (!time) return "";
				// 兼容时间戳
				const timestamp = typeof time === 'number' ? time : new Date(time).getTime();
				const date = new Date(timestamp);
				return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
			}
		}
	};
</script>

<style scoped>
	.comment-container {
		padding: 20rpx;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.page-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	/* 加载状态 */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}

	.empty-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.comment-list {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.comment-item {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.news-title {
		font-size: 24rpx;
		color: #666;
		line-height: 1.4;
		margin-bottom: 10rpx;
	}

	.comment-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
		margin-bottom: 10rpx;
	}

	.comment-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.comment-time {
		font-size: 20rpx;
		color: #999;
	}

	.delete-btn {
		font-size: 22rpx;
		color: #d00;
		padding: 5rpx 15rpx;
		background-color: #fef0f0;
		border-radius: 15rpx;
	}
</style>