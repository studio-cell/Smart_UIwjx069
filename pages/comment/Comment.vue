<template>
	<view class="comment-page">
		<!-- 新闻信息预览 -->
		<view class="news-preview" @click="goToNewsDetail">
			<text class="preview-title">{{ newsTitle }}</text>
			<text class="preview-comment-count">{{ commentCount }} 条评论</text>
		</view>

		<!-- 评论列表 -->
		<scroll-view scroll-y class="comment-scroll" @scrolltolower="loadMoreComments">
			<!-- 空状态 -->
			<view v-if="commentList.length === 0 && !loading" class="empty-state">
				<text class="empty-icon">💬</text>
				<text class="empty-text">暂无评论，快来抢沙发吧</text>
			</view>

			<!-- 评论列表 -->
			<view v-else class="comment-list">
				<view class="comment-item" v-for="(item, index) in commentList" :key="item.commentId || index">
					<view class="comment-header">
						<view class="user-info">
							<text class="username">{{ item.username || '匿名用户' }}</text>
							<text class="comment-time">{{ formatTime(item.time) }}</text>
						</view>
						<view v-if="item.isMine" class="delete-btn" @click="deleteComment(item)">删除</view>
					</view>
					<view class="comment-body">
						<text class="comment-content">{{ item.content }}</text>
					</view>
					<view class="comment-footer">
						<view class="like-btn" :class="{ liked: item.isLiked }" @click="toggleLike(item)">
							<text class="like-icon">{{ item.isLiked ? '❤️' : '🤍' }}</text>
							<text class="like-count">{{ item.likeCount || 0 }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 没有更多 -->
			<view v-if="noMore && commentList.length > 0" class="no-more">
				<text class="no-more-text">没有更多评论了</text>
			</view>
		</scroll-view>

		<!-- 底部输入框 -->
		<view class="comment-input-bar">
			<input
				class="comment-input"
				v-model="commentText"
				placeholder="说点什么..."
				:confirm-type="'send'"
				@confirm="submitComment"
			/>
			<button class="send-btn" :disabled="!commentText.trim()" @click="submitComment">
				发送
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			newsId: '',           // 新闻ID
			newsTitle: '',        // 新闻标题
			commentCount: 0,       // 评论总数
			commentList: [],       // 评论列表
			commentText: '',       // 输入框内容
			loading: false,        // 加载状态
			noMore: false,         // 是否没有更多
			page: 1,              // 当前页码
			pageSize: 20,         // 每页条数
			currentUserId: ''      // 当前用户ID
		};
	},
	onLoad(options) {
		// 获取新闻ID
		this.newsId = options.nid || options.newsId;
		if (!this.newsId) {
			uni.showToast({
				title: '新闻ID缺失',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
			return;
		}

		// 获取当前用户信息
		const userInfo = uni.getStorageSync('userInfo');
		this.currentUserId = userInfo.userId || '';

		// 获取新闻标题（从参数或本地存储）
		this.newsTitle = options.title || '新闻详情';
		this.commentCount = parseInt(options.commentCount) || 0;

		// 加载评论列表
		this.getCommentList();
	},
	methods: {
		/**
		 * 获取评论列表
		 */
		async getCommentList(refresh = false) {
			if (this.loading) return;

			if (refresh) {
				this.page = 1;
				this.noMore = false;
			}

			this.loading = true;

			try {
				const res = await uniCloud.callFunction({
					name: 'comment-getList',
					data: {
						newsId: this.newsId,
						page: this.page,
						pageSize: this.pageSize
					}
				});

				if (res.result.code === 200) {
					const newComments = res.result.data.list.map(item => ({
						...item,
						commentId: item._id,
						isMine: item.userId === this.currentUserId,
						isLiked: false
					}));

					if (refresh) {
						this.commentList = newComments;
					} else {
						this.commentList = [...this.commentList, ...newComments];
					}

					this.commentCount = res.result.data.total;
					this.noMore = this.commentList.length >= res.result.data.total;
				}
			} catch (error) {
				console.error('获取评论失败：', error);
				// 使用本地模拟数据
				this.useMockData();
			} finally {
				this.loading = false;
			}
		},

		/**
		 * 使用模拟数据（云函数未部署时）
		 */
		useMockData() {
			const mockComments = [
				{
					commentId: 'c001',
					username: '热心网友',
					content: '这新闻写得很不错，学到了很多！',
					time: new Date(Date.now() - 5 * 60 * 1000),
					likeCount: 12,
					isMine: false,
					isLiked: false
				},
				{
					commentId: 'c002',
					username: '新闻爱好者',
					content: '期待更多这样的深度报道',
					time: new Date(Date.now() - 30 * 60 * 1000),
					likeCount: 8,
					isMine: false,
					isLiked: false
				}
			];

			if (this.page === 1) {
				this.commentList = mockComments;
				this.commentCount = mockComments.length;
			}
		},

		/**
		 * 发布评论
		 */
		async submitComment() {
			const content = this.commentText.trim();
			if (!content) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				});
				return;
			}

			// 检查是否登录
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo || !userInfo.isLogin) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}, 1500);
				return;
			}

			uni.showLoading({ title: '发布中...' });

			try {
				const res = await uniCloud.callFunction({
					name: 'comment-add',
					data: {
						newsId: this.newsId,
						content: content,
						userId: this.currentUserId,
						username: userInfo.username || userInfo.nickname || '匿名用户'
					}
				});

				uni.hideLoading();

				console.log('云函数返回：', res.result);

				if (res.result.code === 200) {
					// 清空输入框
					this.commentText = '';
					// 刷新评论列表
					this.getCommentList(true);
					// 提示成功
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.result.message || '发布失败',
						icon: 'none',
						duration: 3000
					});
				}
			} catch (error) {
				uni.hideLoading();
				console.error('发布评论失败：', error);
				uni.showToast({
					title: '网络异常，请重试',
					icon: 'none',
					duration: 3000
				});
			}
		},

		/**
		 * 删除评论
		 */
		deleteComment(comment) {
			uni.showModal({
				title: '提示',
				content: '确定删除这条评论吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							const deleteRes = await uniCloud.callFunction({
								name: 'comment-delete',
								data: {
									commentId: comment.commentId,
									userId: this.currentUserId
								}
							});

							if (deleteRes.result.code === 200) {
								this.commentList = this.commentList.filter(item => item.commentId !== comment.commentId);
								this.commentCount--;
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
							}
						} catch (error) {
							// 本地删除
							this.commentList = this.commentList.filter(item => item.commentId !== comment.commentId);
							this.commentCount--;
							uni.showToast({
								title: '删除成功（本地）',
								icon: 'success'
							});
						}
					}
				}
			});
		},

		/**
		 * 点赞/取消点赞
		 */
		toggleLike(comment) {
			comment.isLiked = !comment.isLiked;
			comment.likeCount = comment.isLiked ? (comment.likeCount || 0) + 1 : Math.max(0, (comment.likeCount || 0) - 1);
		},

		/**
		 * 加载更多评论
		 */
		loadMoreComments() {
			if (!this.noMore && !this.loading) {
				this.page++;
				this.getCommentList();
			}
		},

		/**
		 * 返回新闻详情
		 */
		goToNewsDetail() {
			uni.navigateBack();
		},

		/**
		 * 格式化时间
		 */
		formatTime(time) {
			if (!time) return '';
			const now = new Date().getTime();
			const timestamp = typeof time === 'number' ? time : new Date(time).getTime();
			const diff = now - timestamp;

			const minute = 60 * 1000;
			const hour = 60 * minute;
			const day = 24 * hour;

			if (diff < minute) return '刚刚';
			if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
			if (diff < day) return `${Math.floor(diff / hour)}小时前`;
			if (diff < 30 * day) return `${Math.floor(diff / day)}天前`;

			const date = new Date(timestamp);
			return `${date.getMonth() + 1}-${date.getDate()}`;
		}
	}
};
</script>

<style scoped>
.comment-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f7f7f7;
}

/* 新闻预览 */
.news-preview {
	background-color: #fff;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.preview-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
	line-height: 1.5;
}

.preview-comment-count {
	font-size: 24rpx;
	color: #999;
}

/* 评论列表滚动区域 */
.comment-scroll {
	flex: 1;
	padding: 20rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

/* 评论列表 */
.comment-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.comment-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.comment-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.username {
	font-size: 26rpx;
	font-weight: 500;
	color: #333;
}

.comment-time {
	font-size: 22rpx;
	color: #999;
}

.delete-btn {
	font-size: 22rpx;
	color: #d00;
	padding: 6rpx 16rpx;
	background-color: #fef0f0;
	border-radius: 12rpx;
}

.comment-body {
	margin-bottom: 16rpx;
}

.comment-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	word-wrap: break-word;
}

.comment-footer {
	display: flex;
	align-items: center;
}

.like-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 16rpx;
	background-color: #f5f5f5;
	border-radius: 16rpx;
}

.like-btn.liked {
	background-color: #ffecec;
}

.like-icon {
	font-size: 24rpx;
}

.like-count {
	font-size: 22rpx;
	color: #666;
}

/* 加载状态 */
.loading-state {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80rpx;
}

.loading-text {
	font-size: 24rpx;
	color: #999;
}

/* 没有更多 */
.no-more {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80rpx;
}

.no-more-text {
	font-size: 24rpx;
	color: #999;
}

/* 底部输入框 */
.comment-input-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.comment-input {
	flex: 1;
	height: 70rpx;
	background-color: #f5f5f5;
	border-radius: 35rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	margin-right: 20rpx;
}

.send-btn {
	width: 120rpx;
	height: 70rpx;
	line-height: 70rpx;
	background-color: #007aff;
	color: #fff;
	font-size: 28rpx;
	border-radius: 35rpx;
	border: none;
	padding: 0;
}

.send-btn[disabled] {
	background-color: #ccc;
	color: #fff;
}
</style>
