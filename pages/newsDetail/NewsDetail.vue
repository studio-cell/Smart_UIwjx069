<template>
	<view class="detail-container">
		<!-- 返回按钮 -->
		<view class="back-btn" @click="goBack">← 返回</view>

		<!-- 新闻头部 -->
		<view class="detail-header" v-if="!isLoading">
			<text class="detail-title">{{ news.title }}</text>
			<view class="detail-meta">
				<text class="detail-author">{{ news.author }}</text>
				<text class="detail-time">{{ news.time }}</text>
				<text class="detail-like-count">{{ news.likeCount || 0 }}人点赞</text>
				<text class="detail-comments">{{ news.comments || 0 }}条评论</text>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-container" v-if="isLoading">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 新闻封面 -->
		<view class="detail-cover" v-if="news.cover && !isLoading">
			<image :src="news.cover" mode="widthFix" class="cover-img" @error="handleCoverError"></image>
		</view>

		<!-- 新闻内容 -->
		<view class="detail-content" v-if="!isLoading">
			<text class="content-text">{{ news.summary }}</text>
			<text class="content-text" v-if="news.content">
				{{ news.content }}
			</text>
			<text class="content-text" v-else>
				这是新闻的详细内容扩展部分。根据实际业务需求，可在此处添加完整的新闻正文，支持多段落、图片、引用等富文本格式。
				本文相关背景补充：{{ news.category }}领域近期动态频繁，相关政策落地将进一步推动行业发展，后续将持续关注事件进展。
			</text>
		</view>

		<!-- 操作按钮区 -->
		<view class="detail-actions" v-if="!isLoading">
			<button class="action-btn" :class="{ active: isLiked }" @click="handleLike">
				{{ isLiked ? '已点赞' : '点赞' }}
			</button>
			<button class="action-btn" :class="{ active: isCollected }" @click="handleCollect">
				{{ isCollected ? '已收藏' : '收藏' }}
			</button>
			<button class="action-btn" @click="handleShare">分享</button>
		</view>

		<!-- 评论区 -->
		<view class="comment-section" v-if="!isLoading">
			<text class="comment-title">热门评论</text>

			<!-- 评论输入框 -->
			<view class="comment-input" v-if="userInfo.isLogin">
				<input v-model="commentContent" placeholder="输入你的评论..." class="input-field" />
				<button @click="submitComment" class="submit-btn">发布</button>
			</view>

			<!-- 未登录提示 -->
			<view class="login-tip" v-else>
				<navigator url="/pages/login/login" class="login-link">登录后可发表评论</navigator>
			</view>

			<!-- 评论列表 -->
			<view class="comment-list">
				<view class="comment-item" v-for="(item, idx) in commentList" :key="idx">
					<view class="comment-user">
						<image :src="item.avatar || 'https://picsum.photos/48/48'" class="user-avatar"></image>
						<text class="user-name">{{ item.username || '匿名用户' }}</text>
						<text class="comment-time">{{ item.time }}</text>
					</view>
					<text class="comment-content">{{ item.content }}</text>
					<view class="comment-like" @click="handleCommentLike(idx)">
						<text class="like-icon">{{ item.isLiked ? '❤️' : '♡' }}</text>
						<text class="like-count">{{ item.likeCount || 0 }}</text>
					</view>
				</view>

				<!-- 无评论提示 -->
				<view class="no-comment" v-if="commentList.length === 0">暂无评论，快来抢沙发～</view>
			</view>
		</view>

		<!-- 推荐新闻 -->
		<view class="recommend-section" v-if="!isLoading">
			<text class="recommend-title">精彩推荐</text>
			<view class="recommend-list">
				<view v-for="item in recommendList" :key="item.nid" @click="goToDetail(item.nid)">
					<NewsView :nid="item.nid" :title="item.title" :is-top="item.isTop" :author="item.author"
						:comments="item.comments" :time="item.time" :mode="2" :images="[item.cover]"
						:summary="item.summary">
					</NewsView>
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
				// 核心参数
				nid: '', // 页面跳转传参的新闻ID
				newsId: '', // 兼容云函数的新闻ID参数

				// 数据存储
				news: {}, // 新闻详情
				commentList: [], // 评论列表
				recommendList: [], // 推荐新闻列表
				commentContent: '', // 评论输入内容

				// 状态控制
				isLoading: true, // 全局加载状态
				isLiked: false, // 点赞状态
				isCollected: false, // 收藏状态
				userInfo: {
					isLogin: false,
					userId: '',
					username: ''
				} // 用户信息
			};
		},
		onLoad(options) {
			// 1. 初始化新闻ID（兼容nid/newsId两种参数名）
			this.nid = options.nid || options.newsId || '';
			this.newsId = this.nid;

			// 2. 初始化用户信息
			this.initUserInfo();

			// 3. 加载核心数据（确保参数完整后执行）
			if (this.newsId) {
				this.loadAllData();
			} else {
				this.isLoading = false;
				uni.showToast({
					title: '无效的新闻ID',
					icon: 'none'
				});
				setTimeout(() => uni.navigateBack(), 1500);
			}
		},
		methods: {
			/**
			 * 初始化用户信息（从缓存读取）
			 */
			initUserInfo() {
				const user = uni.getStorageSync("userInfo") || {};
				this.userInfo = {
					isLogin: user.isLogin || false,
					userId: user.userId || '',
					username: user.username || ''
				};
			},

			/**
			 * 加载所有核心数据（统一入口）
			 */
			async loadAllData() {
				try {
					// 强制校验参数，避免空值调用云函数
					if (!this.newsId) {
						throw new Error('新闻ID不能为空');
					}

					// 并行加载数据，提升性能
					await Promise.all([
						this.loadNewsDetail(), // 加载新闻详情
						this.loadComments(), // 加载评论列表
						this.loadRecommendNews() // 加载推荐新闻
					]);

					// 登录用户额外加载状态
					if (this.userInfo.isLogin) {
						await Promise.all([
							this.checkLikeStatus(), // 检查点赞状态
							this.checkCollectStatus() // 检查收藏状态
						]);
						this.recordBrowseHistory(); // 记录浏览历史
					}
				} catch (error) {
					console.error('数据加载失败：', error);
					uni.showToast({
						title: '数据加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false; // 关闭加载状态
				}
			},

			/**
			 * 加载新闻详情（云端优先，本地兜底）
			 */
			async loadNewsDetail() {
				try {
					// 优先从云端获取
					const res = await uniCloud.callFunction({
						name: "news-getDetail",
						data: {
							newsId: this.newsId
						}
					});

					if (res.result.code === 200) {
						this.news = res.result.data;
					} else if (res.result.code === 404) {
						// 云端无数据，友好提示+本地兜底
						uni.showToast({
							title: '该新闻已下架，展示本地数据',
							icon: 'none',
							duration: 2000
						});
						this.loadLocalNewsDetail();
					}
				} catch (error) {
					// 网络错误/云函数异常，本地兜底
					this.loadLocalNewsDetail();
					console.error('云端加载新闻失败：', error);
				}
			},

			/**
			 * 加载本地新闻详情（兜底方案）
			 */
			loadLocalNewsDetail() {
				this.news = newsData.newsList.find(item => item.nid === this.nid) || {
					title: "新闻不存在",
					author: "未知来源",
					time: new Date().toLocaleDateString(),
					comments: 0,
					likeCount: 0,
					summary: "暂无该新闻内容",
					category: "推荐"
				};
			},

			/**
			 * 加载评论列表（云端优先，本地兜底）
			 */
			async loadComments() {
				// 双重校验参数，避免云函数报错
				if (!this.newsId) {
					this.commentList = [];
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: "comment-getList",
						data: {
							newsId: this.newsId,
							page: 1,
							pageSize: 20
						}
					});

					if (res.result.code === 200) {
						this.commentList = res.result.data.list || [];
					}
				} catch (error) {
					// 云端失败，使用本地默认评论
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
					console.error('加载评论失败：', error);
				}
			},

			/**
			 * 加载推荐新闻（本地数据）
			 */
			loadRecommendNews() {
				const filterNews = newsData.newsList.filter(item =>
					item.nid !== this.nid && item.category !== '广告'
				);
				// 随机排序，取前3条
				this.recommendList = filterNews.sort(() => Math.random() - 0.5).slice(0, 3);
			},

			/**
			 * 检查点赞状态（强化参数校验）
			 */
			async checkLikeStatus() {
				// 双重校验参数，避免云函数报错
				if (!this.userInfo.userId || !this.newsId) {
					this.isLiked = false;
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: "like-toggle",
						data: {
							userId: this.userInfo.userId,
							targetId: this.newsId,
							targetType: "news",
							onlyCheck: true
						}
					});
					if (res.result.code === 200) {
						this.isLiked = res.result.data.isLiked;
					}
				} catch (error) {
					console.error('检查点赞状态失败：', error);
					// 云端失败，本地默认未点赞
					this.isLiked = false;
				}
			},

			/**
			 * 检查收藏状态（强化参数校验）
			 */
			async checkCollectStatus() {
				// 双重校验参数，避免云函数报错
				if (!this.userInfo.userId || !this.newsId) {
					this.isCollected = false;
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: "collection-check",
						data: {
							userId: this.userInfo.userId,
							newsId: this.newsId
						}
					});
					if (res.result.code === 200) {
						this.isCollected = res.result.data.isCollected;
					}
				} catch (error) {
					console.error('检查收藏状态失败：', error);
					// 云端失败，本地默认未收藏
					this.isCollected = false;
				}
			},

			/**
			 * 记录浏览历史
			 */
			recordBrowseHistory() {
				if (!this.newsId) return; // 校验参数

				const historyItem = {
					newsId: this.newsId,
					title: this.news.title || '',
					cover: this.news.cover || '',
					viewTime: Date.now() // 阿里云兼容：使用时间戳替代serverDate
				};

				// 读取现有历史并去重
				let historyList = uni.getStorageSync("newsHistory") || [];
				historyList = historyList.filter(item => item.newsId !== this.newsId);

				// 添加到头部，最多保留50条
				historyList.unshift(historyItem);
				if (historyList.length > 50) {
					historyList = historyList.slice(0, 50);
				}

				// 保存到缓存
				uni.setStorageSync("newsHistory", historyList);
			},

			/**
			 * 点赞/取消点赞（强化容错）
			 */
			async handleLike() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}

				// 参数校验
				if (!this.userInfo.userId || !this.newsId) {
					uni.showToast({
						title: '操作失败，参数异常',
						icon: 'none'
					});
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: "like-toggle",
						data: {
							userId: this.userInfo.userId,
							targetId: this.newsId,
							targetType: "news"
						}
					});

					if (res.result.code === 200) {
						this.isLiked = res.result.data.isLiked;
						// 更新点赞数
						this.news.likeCount = this.isLiked ?
							(this.news.likeCount || 0) + 1 :
							Math.max(0, (this.news.likeCount || 0) - 1);
						uni.showToast({
							title: res.result.message,
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: res.result.message || '操作失败',
							icon: 'none'
						});
					}
				} catch (error) {
					// 云端失败，本地兜底（兼容阿里云serverDate问题）
					this.isLiked = !this.isLiked;
					this.news.likeCount = this.isLiked ?
						(this.news.likeCount || 0) + 1 :
						Math.max(0, (this.news.likeCount || 0) - 1);
					uni.showToast({
						title: this.isLiked ? '点赞成功' : '取消点赞成功',
						icon: 'none'
					});
					console.error('点赞操作失败：', error);
				}
			},

			/**
			 * 收藏/取消收藏（强化容错）
			 */
			async handleCollect() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}

				// 参数校验
				if (!this.userInfo.userId || !this.newsId) {
					uni.showToast({
						title: '操作失败，参数异常',
						icon: 'none'
					});
					return;
				}

				try {
					const funcName = this.isCollected ? "collection-remove" : "collection-add";
					const res = await uniCloud.callFunction({
						name: funcName,
						data: {
							userId: this.userInfo.userId,
							newsId: this.newsId
						}
					});

					if (res.result.code === 200) {
						this.isCollected = !this.isCollected;
						uni.showToast({
							title: this.isCollected ? '收藏成功' : '取消收藏成功',
							icon: 'none'
						});
					}
				} catch (error) {
					// 云端失败，本地兜底
					this.isCollected = !this.isCollected;
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '取消收藏成功',
						icon: 'none'
					});
					console.error('收藏操作失败：', error);
				}
			},

			/**
			 * 发布评论
			 */
			async submitComment() {
				// 内容校验
				const content = this.commentContent.trim();
				if (!content) {
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

				// 参数校验
				if (!this.userInfo.userId || !this.newsId) {
					uni.showToast({
						title: '发布失败，参数异常',
						icon: 'none'
					});
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: "comment-add",
						data: {
							newsId: this.newsId,
							userId: this.userInfo.userId,
							username: this.userInfo.username,
							content: content,
							time: new Date().toLocaleString()
						}
					});

					if (res.result.code === 200) {
						this.addCommentToLocal(content);
					}
				} catch (error) {
					// 云端失败，本地展示
					this.addCommentToLocal(content);
					console.error('发布评论失败：', error);
				}
			},

			/**
			 * 本地添加评论（兜底）
			 */
			addCommentToLocal(content) {
				this.commentList.unshift({
					username: this.userInfo.username || "游客",
					avatar: `https://picsum.photos/48/48?random=${Date.now()}`,
					time: "刚刚",
					content: content,
					likeCount: 0,
					isLiked: false
				});
				this.commentContent = '';
				uni.showToast({
					title: '评论发布成功',
					icon: 'none'
				});
			},

			/**
			 * 评论点赞（本地）
			 */
			handleCommentLike(idx) {
				const comment = this.commentList[idx];
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
			},

			/**
			 * 分享功能
			 */
			handleShare() {
				uni.showActionSheet({
					itemList: ['分享给好友', '分享到朋友圈', '复制链接'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								uni.showToast({
									title: '分享给好友成功',
									icon: 'none'
								});
								break;
							case 1:
								uni.showToast({
									title: '分享到朋友圈成功',
									icon: 'none'
								});
								break;
							case 2:
								uni.setClipboardData({
									data: `https://news.example.com/${this.newsId}`
								});
								uni.showToast({
									title: '链接已复制',
									icon: 'none'
								});
								break;
						}
					}
				});
			},

			/**
			 * 封面图片加载失败兜底
			 */
			handleCoverError() {
				this.$set(this.news, 'cover', 'https://picsum.photos/750/400');
			},

			/**
			 * 返回上一页
			 */
			goBack() {
				uni.navigateBack();
			},

			/**
			 * 跳转到其他新闻详情
			 */
			goToDetail(nid) {
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
				});
			}
		}
	};
</script>

<style scoped>
	/* 全局容器 */
	.detail-container {
		padding: 20rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	/* 加载状态 */
	.loading-container {
		text-align: center;
		padding: 100rpx 0;
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 返回按钮 */
	.back-btn {
		font-size: 28rpx;
		color: #1e88e5;
		margin-bottom: 20rpx;
	}

	/* 新闻头部 */
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
		flex-wrap: wrap;
		gap: 10rpx;
	}

	/* 新闻封面 */
	.detail-cover {
		margin-bottom: 30rpx;
	}

	.cover-img {
		width: 100%;
		border-radius: 12rpx;
	}

	/* 新闻内容 */
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

	/* 操作按钮区 */
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

	.action-btn.active {
		background-color: #e53935;
		color: #fff;
	}

	/* 评论区 */
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

	/* 推荐新闻区 */
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