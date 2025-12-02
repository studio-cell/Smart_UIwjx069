<template>
	<view class="detail-container">
		<!-- 新闻头部信息 -->
		<view class="detail-header">
			<text class="detail-title">{{ news.title }}</text>
			<view class="detail-meta">
				<text class="detail-author">{{ news.author }}</text>
				<text class="detail-time">{{ news.time }}</text>
				<text class="detail-comments">{{ news.comments }}条评论</text>
			</view>
		</view>

		<!-- 新闻封面图 -->
		<view class="detail-cover">
			<image :src="news.cover" mode="widthFix" class="cover-img"></image>
		</view>

		<!-- 新闻正文 -->
		<view class="detail-content">
			<text class="content-text">{{ news.summary }}</text>
			<text class="content-text">
				这是新闻的详细内容扩展部分。根据实际业务需求，可在此处添加完整的新闻正文，支持多段落、图片、引用等富文本格式。
				本文相关背景补充：{{ news.category }}领域近期动态频繁，相关政策落地将进一步推动行业发展，后续将持续关注事件进展。
			</text>
		</view>

		<!-- 操作按钮 -->
		<view class="detail-actions">
			<button class="action-btn" @click="handleLike">{{ isLiked ? '已点赞' : '点赞' }}</button>
			<button class="action-btn" @click="handleCollect">{{ isCollected ? '已收藏' : '收藏' }}</button>
			<button class="action-btn" @click="handleShare">分享</button>
		</view>

		<!-- 评论区 -->
		<view class="comment-section">
			<text class="comment-title">热门评论</text>

			<!-- 评论输入框（未登录隐藏） -->
			<view class="comment-input" v-if="userInfo.isLogin">
				<input v-model="commentContent" placeholder="输入你的评论..." class="input-field" />
				<button @click="submitComment" class="submit-btn">发布</button>
			</view>
			<view class="login-tip" v-else>
				<navigator url="/pages/login/login" class="login-link">登录后可发表评论</navigator>
			</view>

			<!-- 评论列表 -->
			<view class="comment-list">
				<view class="comment-item" v-for="(item, idx) in commentList" :key="idx">
					<view class="comment-user">
						<image src="/static/avatar.png" class="user-avatar"></image>
						<text class="user-name">{{ item.username }}</text>
						<text class="comment-time">{{ item.time }}</text>
					</view>
					<text class="comment-content">{{ item.content }}</text>
					<view class="comment-like" @click="handleCommentLike(idx)">
						<text class="like-icon">{{ item.isLiked ? '❤️' : '♡' }}</text>
						<text class="like-count">{{ item.likeCount }}</text>
					</view>
				</view>
				<view class="no-comment" v-if="commentList.length === 0">
					暂无评论，快来抢沙发～
				</view>
			</view>
		</view>

		<!-- 精彩推荐 -->
		<view class="recommend-section">
			<text class="recommend-title">精彩推荐</text>
			<view class="recommend-list">
				<NewsCard v-for="item in recommendList" :key="item.nid" :nid="item.nid" :title="item.title"
					:cover="item.cover" :summary="item.summary" :author="item.author" :time="item.time"
					:comments="item.comments" :is-top="item.isTop" @card-click="goToDetail(item.nid)"></NewsCard>
			</view>
		</view>
	</view>
</template>

<script>
	import NewsCard from "@/components/NewsCard.vue";
	import newsData from "@/Data/news.json";

	export default {
		components: {
			NewsCard
		},
		data() {
			return {
				news: {}, // 当前新闻详情
				userInfo: {
					isLogin: false
				}, // 用户登录状态
				commentContent: "", // 评论输入内容
				commentList: [], // 评论列表
				isLiked: false, // 是否点赞
				isCollected: false, // 是否收藏
				recommendList: [] // 精彩推荐列表
			};
		},
		onLoad(options) {
			const nid = options.nid;
			// 根据nid获取当前新闻详情
			this.news = newsData.newsList.find(item => item.nid === nid) || {};
			// 获取用户登录状态
			this.getUserStatus();
			// 加载评论列表（模拟数据）
			this.loadComments();
			// 加载精彩推荐（随机3条其他新闻）
			this.loadRecommend();
		},
		methods: {
			// 获取用户登录状态
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				this.userInfo = user;
			},
			// 加载评论列表（模拟）
			loadComments() {
				this.commentList = [{
						username: "网友872503",
						time: "2小时前",
						content: "内容很精彩，支持一下！",
						likeCount: 37,
						isLiked: false
					},
					{
						username: "平安379373",
						time: "3小时前",
						content: "分析得很到位，期待后续报道",
						likeCount: 15,
						isLiked: false
					}
				];
			},
			// 加载精彩推荐（随机3条不同新闻）
			loadRecommend() {
				const otherNews = newsData.newsList.filter(item => item.nid !== this.news.nid);
				// 随机排序后取前3条
				this.recommendList = otherNews.sort(() => Math.random() - 0.5).slice(0, 3);
			},
			// 跳转其他新闻详情
			goToDetail(nid) {
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
				});
			},
			// 点赞
			handleLike() {
				this.isLiked = !this.isLiked;
				uni.showToast({
					title: this.isLiked ? '点赞成功' : '取消点赞'
				});
			},
			// 收藏（登录校验）
			handleCollect() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}
				this.isCollected = !this.isCollected;
				uni.showToast({
					title: this.isCollected ? '收藏成功' : '取消收藏'
				});
				// 实际项目可将收藏状态存入本地存储或调用接口
			},
			// 分享
			handleShare() {
				uni.showActionSheet({
					itemList: ['分享给好友', '分享到朋友圈', '复制链接'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								uni.showToast({
									title: '分享给好友'
								});
								break;
							case 1:
								uni.showToast({
									title: '分享到朋友圈'
								});
								break;
							case 2:
								uni.setClipboardData({
									data: window.location.href
								});
								uni.showToast({
									title: '链接已复制'
								});
								break;
						}
					}
				});
			},
			// 提交评论
			submitComment() {
				if (!this.commentContent.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}
				// 新增评论到列表头部
				this.commentList.unshift({
					username: this.userInfo.username,
					time: "刚刚",
					content: this.commentContent,
					likeCount: 0,
					isLiked: false
				});
				// 清空输入框
				this.commentContent = "";
				uni.showToast({
					title: '评论发布成功'
				});
			},
			// 评论点赞
			handleCommentLike(idx) {
				const comment = this.commentList[idx];
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
			}
		}
	};
</script>

<style scoped>
	.detail-container {
		padding: 20rpx;
		background-color: #fff;
		min-height: 100vh;
	}

	/* 头部信息 */
	.detail-header {
		margin-bottom: 20rpx;
	}

	.detail-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1a1a1a;
		line-height: 50rpx;
		margin-bottom: 16rpx;
		display: block;
	}

	.detail-meta {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		justify-content: space-between;
	}

	/* 封面图 */
	.detail-cover {
		margin-bottom: 30rpx;
	}

	.cover-img {
		width: 100%;
		border-radius: 12rpx;
	}

	/* 正文 */
	.detail-content {
		margin-bottom: 30rpx;
	}

	.content-text {
		font-size: 28rpx;
		color: #333;
		line-height: 44rpx;
		margin-bottom: 20rpx;
		display: block;
		text-indent: 56rpx;
	}

	/* 操作按钮 */
	.detail-actions {
		display: flex;
		justify-content: space-around;
		margin-bottom: 30rpx;
	}

	.action-btn {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		border-radius: 30rpx;
		background-color: #f2f3f5;
		color: #333;
	}

	.action-btn:nth-child(1).active {
		background-color: #ff3333;
		color: #fff;
	}

	/* 评论区 */
	.comment-section {
		margin-bottom: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.comment-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.comment-input {
		display: flex;
		gap: 12rpx;
		margin-bottom: 20rpx;
	}

	.input-field {
		flex: 1;
		border: 1rpx solid #eee;
		border-radius: 30rpx;
		padding: 16rpx 20rpx;
		font-size: 24rpx;
	}

	.submit-btn {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		border-radius: 30rpx;
		background-color: #d00;
		color: #fff;
	}

	.login-tip {
		text-align: center;
		margin-bottom: 20rpx;
		font-size: 24rpx;
		color: #666;
	}

	.login-link {
		color: #007aff;
		text-decoration: none;
	}

	.comment-list {
		margin-top: 20rpx;
	}

	.comment-item {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.comment-user {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.user-avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		margin-right: 12rpx;
	}

	.user-name {
		font-size: 24rpx;
		font-weight: 600;
		color: #333;
		margin-right: 20rpx;
	}

	.comment-time {
		font-size: 20rpx;
		color: #999;
	}

	.comment-content {
		font-size: 24rpx;
		color: #333;
		line-height: 36rpx;
		margin-bottom: 12rpx;
		display: block;
	}

	.comment-like {
		display: flex;
		align-items: center;
		font-size: 22rpx;
		color: #999;
	}

	.like-icon {
		margin-right: 8rpx;
	}

	.no-comment {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 40rpx 0;
	}

	/* 精彩推荐 */
	.recommend-section {
		margin-top: 30rpx;
	}

	.recommend-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.recommend-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}
</style>