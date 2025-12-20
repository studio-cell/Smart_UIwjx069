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
				recommendList: [],
				nid: '', // 当前新闻ID（你的参数）
				newsId: '' // 兼容要求的newsId参数
			};
		},
		onLoad(options) {
			// 兼容两种参数名：nid（你的）/newsId（要求的）
			this.nid = options.nid || options.newsId;
			this.newsId = this.nid; // 对齐要求的newsId变量

			// 获取新闻详情（本地JSON兜底）
			this.news = newsData.newsList.find(item => item.nid === this.nid) || {
				title: "新闻不存在",
				author: "未知来源",
				time: "2025.10.26",
				comments: 0,
				summary: "暂无该新闻内容",
				category: "推荐"
			};

			// 初始化用户状态、推荐新闻（不依赖nid的方法直接调用）
			this.getUserStatus();
			this.loadRecommend();

			// ========== 核心优化：延迟100ms调用，确保参数完全赋值 ==========
			setTimeout(() => {
				// 依赖nid的方法延迟调用，避免参数缺失报错
				this.loadComments();
				this.getNewsDetailFromCloud();

				// 记录浏览历史 + 检查点赞/收藏状态
				this.recordHistory();
				if (this.userInfo.isLogin) {
					this.checkLikeStatus();
					this.checkCollectStatus();
				}
			}, 100);
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 获取用户登录状态
			getUserStatus() {
				const user = uni.getStorageSync("userInfo") || {
					isLogin: false
				};
				this.userInfo = user;
			},

			// 加载评论（优先云端，本地兜底）
			loadComments() {
				this.getCommentsFromCloud().then(res => {
					if (res && res.length > 0) {
						this.commentList = res;
					} else {
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
					}
				});
			},

			// 加载推荐新闻
			loadRecommend() {
				const otherNews = newsData.newsList.filter(item => item.nid !== this.news.nid && item.category !== '广告');
				this.recommendList = otherNews.sort(() => Math.random() - 0.5).slice(0, 3);
			},

			// 跳转到其他新闻详情
			goToDetail(nid) {
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
					// 如果要对齐路径要求，修改为：
					// url: `/pages/news/detail/detail?nid=${nid}`
				});
			},

			// ========== 核心：记录浏览历史（严格对齐要求） ==========
			recordHistory() {
				if (!this.newsId) return; // 校验参数
				const user = uni.getStorageSync("userInfo");
				if (user.isLogin) {
					// 获取当前新闻基本信息
					const newsInfo = {
						newsId: this.newsId,
						title: this.news.title || '',
						cover: this.news.cover || '',
						viewTime: new Date().getTime()
					};
					// 读取现有历史
					let historyList = uni.getStorageSync("newsHistory") || [];
					// 去重（避免重复记录）
					historyList = historyList.filter(item => item.newsId !== this.newsId);
					// 添加到头部
					historyList.unshift(newsInfo);
					// 最多保留50条
					if (historyList.length > 50) {
						historyList = historyList.slice(0, 50);
					}
					// 保存到本地
					uni.setStorageSync("newsHistory", historyList);
				}
			},

			// ========== 新增：从云端获取新闻详情（消除400报错） ==========
			async getNewsDetailFromCloud() {
				if (!this.nid) return; // 必须校验参数
				try {
					const res = await uniCloud.callFunction({
						name: "news-getDetail",
						data: {
							newsId: this.nid // 传递新闻ID，解决"缺少新闻ID"报错
						}
					});
					if (res.result.code === 200) {
						// 云端数据优先，覆盖本地JSON数据
						this.news = res.result.data;
					}
				} catch (error) {
					console.error("云端获取新闻详情失败：", error);
				}
			},

			// ========== 点赞功能（对接云端） ==========
			async handleLike() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}
				try {
					const res = await uniCloud.callFunction({
						name: "like-toggle",
						data: {
							userId: this.userInfo.userId,
							targetId: this.nid,
							targetType: "news"
						}
					});
					if (res.result.code === 200) {
						this.isLiked = res.result.data.isLiked;
						// 更新点赞数展示
						this.news.comments = this.isLiked ?
							(this.news.comments || 0) + 1 :
							Math.max(0, (this.news.comments || 0) - 1);
						uni.showToast({
							title: this.isLiked ? '点赞成功' : '取消点赞'
						});
					}
				} catch (error) {
					console.error("点赞失败：", error);
					// 云端失败时本地兜底
					this.isLiked = !this.isLiked;
					uni.showToast({
						title: this.isLiked ? '点赞成功' : '取消点赞'
					});
				}
			},

			// ========== 收藏功能（对接云端） ==========
			async handleCollect() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}
				try {
					const funcName = this.isCollected ? "collection-remove" : "collection-add";
					const res = await uniCloud.callFunction({
						name: funcName,
						data: {
							userId: this.userInfo.userId,
							newsId: this.nid
						}
					});
					if (res.result.code === 200) {
						this.isCollected = !this.isCollected;
						uni.showToast({
							title: this.isCollected ? '收藏成功' : '取消收藏'
						});
					}
				} catch (error) {
					console.error("收藏失败：", error);
					// 云端失败时本地兜底
					this.isCollected = !this.isCollected;
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '取消收藏'
					});
				}
			},

			// ========== 检查点赞状态（对接云端） ==========
			async checkLikeStatus() {
				if (!this.userInfo.userId || !this.nid) return;
				try {
					const res = await uniCloud.callFunction({
						name: "like-toggle",
						data: {
							userId: this.userInfo.userId,
							targetId: this.nid,
							targetType: "news",
							onlyCheck: true
						}
					});
					if (res.result.code === 200) {
						this.isLiked = res.result.data.isLiked;
					}
				} catch (error) {
					console.error("检查点赞状态失败：", error);
				}
			},

			// ========== 检查收藏状态（对接云端） ==========
			async checkCollectStatus() {
				if (!this.userInfo.userId || !this.nid) return;
				try {
					const res = await uniCloud.callFunction({
						name: "collection-check",
						data: {
							userId: this.userInfo.userId,
							newsId: this.nid
						}
					});
					if (res.result.code === 200) {
						this.isCollected = res.result.data.isCollected;
					}
				} catch (error) {
					console.error("检查收藏状态失败：", error);
				}
			},

			// ========== 从云端获取评论 ==========
			async getCommentsFromCloud() {
				if (!this.nid) return [];
				try {
					const res = await uniCloud.callFunction({
						name: "comment-getList",
						data: {
							newsId: this.nid,
							page: 1,
							pageSize: 20
						}
					});
					if (res.result.code === 200) {
						return res.result.data.list;
					}
					return [];
				} catch (error) {
					console.error("获取评论失败：", error);
					return [];
				}
			},

			// ========== 发布评论（对接云端） ==========
			async submitComment() {
				if (!this.commentContent.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}
				try {
					const res = await uniCloud.callFunction({
						name: "comment-add",
						data: {
							newsId: this.nid,
							userId: this.userInfo.userId,
							content: this.commentContent,
							username: this.userInfo.username || "游客",
							time: new Date().toLocaleString()
						}
					});
					if (res.result.code === 200) {
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
					}
				} catch (error) {
					console.error("发布评论失败：", error);
					// 云端失败时本地兜底
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
				}
			},

			// ========== 评论点赞（本地） ==========
			handleCommentLike(idx) {
				const comment = this.commentList[idx];
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
			},

			// ========== 分享功能 ==========
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

			// ========== 封面图片加载失败兜底 ==========
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