<template>
	<view class="detail-container">
		<view class="back-btn" @click="goBack">← 返回</view>
		<view class="detail-header">
			<text class="detail-title">{{ news.title }}</text>
			<view class="detail-meta">
				<text class="detail-author">{{ news.author }}</text>
				<text class="detail-time">{{ news.time }}</text>
				<text class="detail-comments">{{ news.comments }}条评论</text>
			</view>
		</view>
		<view class="detail-cover" v-if="news.cover">
			<image :src="news.cover" mode="widthFix" class="cover-img" @error="handleCoverError"></image>
		</view>
		<view class="detail-content">
			<text class="content-text">{{ news.summary }}</text>
			<text class="content-text">
				这是新闻的详细内容扩展部分。根据实际业务需求，可在此处添加完整的新闻正文，支持多段落、图片、引用等富文本格式。
				本文相关背景补充：{{ news.category }}领域近期动态频繁，相关政策落地将进一步推动行业发展，后续将持续关注事件进展。
			</text>
		</view>
		<view class="detail-actions">
			<button class="action-btn" @click="handleLike">{{ isLiked ? '已点赞' : '点赞' }}</button>
			<button class="action-btn" @click="handleCollect">{{ isCollected ? '已收藏' : '收藏' }}</button>
			<button class="action-btn" @click="handleShare">分享</button>
		</view>
		<view class="comment-section">
			<text class="comment-title">热门评论</text>
			<view class="comment-input" v-if="userInfo.isLogin">
				<input v-model="commentContent" placeholder="输入你的评论..." class="input-field" />
				<button @click="submitComment" class="submit-btn">发布</button>
			</view>
			<view class="login-tip" v-else>
				<navigator url="/pages/login/login" class="login-link">登录后可发表评论</navigator>
			</view>
			<view class="comment-list">
				<view class="comment-item" v-for="(item, idx) in commentList" :key="idx">
					<view class="comment-user">
						<image src="https://picsum.photos/48/48" class="user-avatar"></image>
						<text class="user-name">{{ item.username }}</text>
						<text class="comment-time">{{ item.time }}</text>
					</view>
					<text class="comment-content">{{ item.content }}</text>
					<view class="comment-like" @click="handleCommentLike(idx)">
						<text class="like-icon">{{ item.isLiked ? '❤️' : '♡' }}</text>
						<text class="like-count">{{ item.likeCount }}</text>
					</view>
				</view>
				<view class="no-comment" v-if="commentList.length === 0">暂无评论，快来抢沙发～</view>
			</view>
		</view>
		<view class="recommend-section">
			<text class="recommend-title">精彩推荐</text>
			<view class="recommend-list">
				<!-- 核心修复：将 NewsView 包裹在 view 中绑定点击事件 -->
				<view v-for="item in recommendList" :key="item.nid" @click="goToDetail(item.nid)">
					<NewsView :nid="item.nid" :title="item.title" :is-top="item.isTop" :author="item.author"
						:comments="item.comments" :time="item.time" :mode="2" :images="[item.cover]"
						:summary="item.summary"></NewsView>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NewsView from "@/components/NewsView.vue";
	import newsData from "@/Data/news.json";

	export default {
		components: {
			NewsView
		},
		data() {
			return {
				news: {},
				userInfo: {
					isLogin: false
				},
				commentContent: "",
				commentList: [],
				isLiked: false,
				isCollected: false,
				recommendList: []
			};
		},
		onLoad(options) {
			const nid = options.nid;
			this.news = newsData.newsList.find(item => item.nid === nid) || {
				title: "新闻不存在",
				author: "未知来源",
				time: "2025.10.26",
				comments: 0,
				summary: "暂无该新闻内容",
				category: "推荐"
			};
			this.getUserStatus();
			this.loadComments();
			this.loadRecommend();
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				this.userInfo = user;
			},
			loadComments() {
				this.commentList = [{
					username: "网友872503",
					time: "2小时前",
					content: "内容很精彩，支持一下！",
					likeCount: 37,
					isLiked: false
				}, {
					username: "平安379373",
					time: "3小时前",
					content: "分析得很到位，期待后续报道",
					likeCount: 15,
					isLiked: false
				}];
			},
			loadRecommend() {
				const otherNews = newsData.newsList.filter(item => item.nid !== this.news.nid && item.category !== '广告');
				this.recommendList = otherNews.sort(() => Math.random() - 0.5).slice(0, 3);
			},
			goToDetail(nid) {
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
				});
			},
			handleLike() {
				this.isLiked = !this.isLiked;
				uni.showToast({
					title: this.isLiked ? '点赞成功' : '取消点赞'
				});
			},
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
			},
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
			submitComment() {
				if (!this.commentContent.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}
				this.commentList.unshift({
					username: this.userInfo.username || "游客",
					time: "刚刚",
					content: this.commentContent,
					likeCount: 0,
					isLiked: false
				});
				this.commentContent = "";
				uni.showToast({
					title: '评论发布成功'
				});
			},
			handleCommentLike(idx) {
				const comment = this.commentList[idx];
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
			},
			handleCoverError() {
				this.$set(this.news, 'cover', 'https://picsum.photos/750/400');
			}
		}
	};
</script>

<style scoped>
	.detail-container {
		padding: 20rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.back-btn {
		font-size: 28rpx;
		color: #1e88e5;
		margin-bottom: 20rpx;
	}

	.detail-header {
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
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

	.detail-cover {
		margin-bottom: 30rpx;
	}

	.cover-img {
		width: 100%;
		border-radius: 12rpx;
	}

	.detail-content {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
	}

	.content-text {
		font-size: 28rpx;
		color: #333;
		line-height: 44rpx;
		margin-bottom: 20rpx;
		display: block;
		text-indent: 56rpx;
	}

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

	.comment-section {
		margin-bottom: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f5f5f5;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
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

	.recommend-section {
		margin-top: 30rpx;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
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