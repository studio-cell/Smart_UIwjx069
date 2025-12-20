<template>
	<view class="comment-container">
		<view class="page-title">我的评论</view>
		<!-- 空状态 -->
		<view v-if="commentList.length === 0" class="empty-container">
			<text class="empty-text">暂无评论内容</text>
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
				userId: ''
			};
		},
		onLoad() {
			// 获取登录用户ID
			const user = uni.getStorageSync("userInfo");
			if (user && user.userId) {
				this.userId = user.userId;
				this.getMyCommentList();
			} else {
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
			// 获取我的评论列表
			async getMyCommentList() {
				uni.showLoading({
					title: "加载中"
				});
				try {
					const res = await uniCloud.callFunction({
						name: "comment-getMyList", // 需要新增这个云函数
						data: {
							userId: this.userId,
							page: 1,
							pageSize: 20
						}
					});
					if (res.result.code === 200) {
						this.commentList = res.result.data.list;
					}
				} catch (error) {
					console.error("获取评论失败：", error);
					uni.showToast({
						title: "加载失败",
						icon: "none"
					});
				} finally {
					uni.hideLoading();
				}
			},
			// 删除评论
			async deleteComment(commentId) {
				uni.showModal({
					title: "提示",
					content: "确定删除这条评论吗？",
					success: async (res) => {
						if (res.confirm) {
							try {
								const res = await uniCloud.callFunction({
									name: "comment-delete", // 需要新增这个云函数
									data: {
										commentId: commentId
									}
								});
								if (res.result.code === 200) {
									uni.showToast({
										title: "删除成功"
									});
									this.getMyCommentList(); // 刷新列表
								}
							} catch (error) {
								console.error("删除评论失败：", error);
								uni.showToast({
									title: "操作失败",
									icon: "none"
								});
							}
						}
					}
				});
			},
			// 跳转到新闻详情
			goToNewsDetail(newsId) {
				uni.navigateTo({
					url: `/pages/news/detail/detail?newsId=${newsId}`
				});
			},
			// 格式化时间
			formatTime(time) {
				if (!time) return "";
				const date = new Date(time);
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