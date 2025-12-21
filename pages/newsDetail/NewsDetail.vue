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
			<!-- 优先显示摘要 -->
			<text class="content-text summary-text">{{ news.summary }}</text>

			<!-- 有content则显示完整内容，没有则显示优化后的兜底文本 -->
			<text class="content-text" v-if="news.content && news.content.trim()">
				{{ news.content }}
			</text>
			<text class="content-text default-content" v-else-if="news.title !== '新闻不存在'">
				{{ news.category }}领域近期动态更新：
				根据最新行业报告显示，{{ news.category }}行业正处于快速发展阶段，相关政策持续落地，市场规模预计将在未来一年内增长15%-20%。
				业内人士分析，该领域的技术创新和模式升级将成为核心增长点，投资者可重点关注头部企业的发展动态。
			</text>
			<text class="content-text" v-else>
				{{ news.content }}
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
				news: {}, // 新闻详情（优先用传递的完整数据）
				commentList: [], // 评论列表
				recommendList: [], // 推荐新闻列表
				commentContent: '', // 评论输入内容
				transferedNewsList: [], // 从首页传递过来的完整新闻列表

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
			// 1. 初始化新闻ID
			this.nid = options.nid || options.newsId || '';
			this.newsId = this.nid;

			// 2. 初始化用户信息
			this.initUserInfo();

			// 3. 关键：监听首页传递的完整新闻数据
			this.listenNewsDataTransfer();

			// 4. 加载核心数据
			this.loadAllData();
		},
		methods: {
			/**
			 * 关键：监听首页通过eventChannel传递的完整新闻数据
			 */
			listenNewsDataTransfer() {
				const eventChannel = this.getOpenerEventChannel();
				if (eventChannel) {
					eventChannel.on('transferNewsData', (data) => {
						// 直接接收首页传递的完整新闻数据
						if (data.news && data.news.nid === this.nid) {
							this.news = data.news; // 直接赋值完整新闻数据
						}
						if (data.newsList) {
							this.transferedNewsList = data.newsList;
						}
					});
				}
			},

			/**
			 * 初始化用户信息
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
			 * 加载所有核心数据（优先使用传递的完整数据）
			 */
			async loadAllData() {
				try {
					// 第一步：如果已经通过eventChannel拿到完整新闻数据，直接使用
					if (this.news && this.news.nid === this.nid && this.news.content) {
						// 数据已就绪，无需后续操作
					}
					// 第二步：从传递的新闻列表中查找
					else if (this.transferedNewsList.length > 0) {
						const memoryNews = this.transferedNewsList.find(item => item.nid === this.nid);
						if (memoryNews) {
							this.news = memoryNews;
						} else {
							// 第三步：从本地JSON查找
							this.loadFromLocalJson();
						}
					}
					// 最后：兜底逻辑
					else {
						// 先查本地JSON
						this.loadFromLocalJson();
						// 尝试调用云函数（可选）
						await this.loadNewsDetailFromCloud();
					}

					// 加载评论和推荐新闻
					await Promise.all([
						this.loadComments(),
						this.loadRecommendNews()
					]);

					// 登录用户加载点赞/收藏状态
					if (this.userInfo.isLogin) {
						await Promise.all([
							this.checkLikeStatus(),
							this.checkCollectStatus()
						]);
						this.recordBrowseHistory();
					}
				} catch (error) {
					console.error('数据加载失败：', error);
					// 最终兜底
					this.loadFromLocalJson();
				} finally {
					this.isLoading = false;
				}
			},

			/**
			 * 从本地JSON加载（最终兜底）
			 */
			loadFromLocalJson() {
				const localNews = newsData.newsList.find(item => item.nid === this.nid);
				if (localNews) {
					this.news = localNews;
				} else {
					// 找不到时的兜底内容
					this.news = {
						title: "新闻不存在",
						author: "未知来源",
						time: new Date().toLocaleDateString(),
						comments: 0,
						likeCount: 0,
						summary: "暂无该新闻内容",
						content: "暂无该新闻的详细内容，可能已被删除或下架。",
						category: "推荐"
					};
				}
			},

			/**
			 * 从云端加载新闻详情（仅兜底使用）
			 */
			async loadNewsDetailFromCloud() {
				try {
					const res = await uniCloud.callFunction({
						name: "news-getDetail",
						data: {
							newsId: this.newsId
						}
					});
					if (res.result.code === 200) {
						this.news = res.result.data;
					}
				} catch (error) {
					console.error('云端加载失败：', error);
				}
			},

			/**
			 * 加载评论列表
			 */
			async loadComments() {
				if (!this.newsId) {
					this.setDefaultComments();
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
					if (res.result.code === 200 && res.result.data.list && res.result.data.list.length > 0) {
						this.commentList = res.result.data.list;
					} else {
						this.setDefaultComments();
					}
				} catch (error) {
					this.setDefaultComments();
				}
			},

			/**
			 * 设置默认评论
			 */
			setDefaultComments() {
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

			/**
			 * 加载推荐新闻
			 */
			loadRecommendNews() {
				// 优先使用传递的列表
				let allNews = this.transferedNewsList.length > 0 ? this.transferedNewsList : newsData.newsList;
				const filterNews = allNews.filter(item =>
					item.nid !== this.nid && item.category !== '广告'
				);
				this.recommendList = filterNews.sort(() => Math.random() - 0.5).slice(0, 3);
			},

			/**
			 * 检查点赞状态
			 */
			async checkLikeStatus() {
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
					this.isLiked = false;
				}
			},

			/**
			 * 检查收藏状态
			 */
			async checkCollectStatus() {
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
					if (res.result && res.result.code === 200) {
						this.isCollected = res.result.data.isCollected;
					} else {
						// 兼容无专门检查接口的情况：直接查询收藏记录
						const checkRes = await uniCloud.callFunction({
							name: "collection-getList",
							data: {
								userId: this.userInfo.userId,
								page: 1,
								pageSize: 1
							}
						});
						if (checkRes.result && checkRes.result.code === 200) {
							const hasCollect = checkRes.result.data.list.some(item => item.newsId === this.newsId);
							this.isCollected = hasCollect;
						}
					}
				} catch (error) {
					this.isCollected = false;
				}
			},

			/**
			 * 记录浏览历史
			 */
			recordBrowseHistory() {
				if (!this.newsId) return;

				const historyItem = {
					newsId: this.newsId,
					title: this.news.title || '',
					cover: this.news.cover || '',
					viewTime: Date.now()
				};

				let historyList = uni.getStorageSync("newsHistory") || [];
				historyList = historyList.filter(item => item.newsId !== this.newsId);
				historyList.unshift(historyItem);
				if (historyList.length > 50) {
					historyList = historyList.slice(0, 50);
				}
				uni.setStorageSync("newsHistory", historyList);
			},

			/**
			 * 点赞/取消点赞
			 */
			async handleLike() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}

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
					console.error('点赞操作异常：', error);
					// 本地兜底处理
					this.isLiked = !this.isLiked;
					this.news.likeCount = this.isLiked ?
						(this.news.likeCount || 0) + 1 :
						Math.max(0, (this.news.likeCount || 0) - 1);
					uni.showToast({
						title: this.isLiked ? '点赞成功' : '取消点赞成功',
						icon: 'none'
					});
				}
			},

			/**
			 * 收藏/取消收藏 - 完整修复版
			 */
			async handleCollect() {
				if (!this.userInfo.isLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return;
				}

				if (!this.userInfo.userId || !this.newsId) {
					uni.showToast({
						title: '操作失败，参数异常',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: this.isCollected ? '取消收藏中...' : '收藏中...'
				});

				try {
					const funcName = this.isCollected ? "collection-remove" : "collection-add";
					const res = await uniCloud.callFunction({
						name: funcName,
						data: {
							userId: this.userInfo.userId,
							newsId: this.newsId
						}
					});

					uni.hideLoading();

					// 处理不同的返回码
					if (res.result.code === 200) {
						this.isCollected = !this.isCollected;
						uni.showToast({
							title: this.isCollected ? '收藏成功' : '取消收藏成功',
							icon: 'success'
						});
					} else if (res.result.code === 409) {
						// 已收藏的情况
						this.isCollected = true;
						uni.showToast({
							title: '您已收藏该新闻',
							icon: 'none'
						});
					} else if (res.result.code === 404) {
						// 未收藏的情况
						this.isCollected = false;
						uni.showToast({
							title: '您尚未收藏该新闻',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: res.result.message || '操作失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('收藏操作异常：', error);
					// 本地兜底处理
					this.isCollected = !this.isCollected;
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '取消收藏成功',
						icon: 'none'
					});
				}
			},

			/**
			 * 发布评论 - 修复showLoading配对问题
			 */
			async submitComment() {
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

				if (!this.userInfo.userId || !this.newsId) {
					uni.showToast({
						title: '发布失败，参数异常',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '发布中...'
				});

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

					uni.hideLoading();

					if (res.result.code === 200) {
						this.addCommentToLocal(content);
					} else {
						uni.showToast({
							title: res.result.message || '发布失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('发布评论异常：', error);
					this.addCommentToLocal(content);
				}
			},

			/**
			 * 本地添加评论
			 */
			// 在新闻详情页的 submitComment 方法中，修改 addCommentToLocal 部分
			addCommentToLocal(content) {
				const newComment = {
					_id: 'local_' + Date.now(), // 本地ID，云端会自动生成
					newsId: this.newsId,
					userId: this.userInfo.userId,
					username: this.userInfo.username || "游客",
					newsTitle: this.news.title, // 新增：保存新闻标题
					avatar: `https://picsum.photos/48/48?random=${Date.now()}`,
					time: new Date(), // 使用Date对象，方便格式化
					content: content,
					likeCount: 0,
					isLiked: false
				};
				this.commentList.unshift(newComment);
				this.commentContent = '';

				// 同步更新到本地缓存（可选，用于无网络时显示）
				let myComments = uni.getStorageSync('myComments_' + this.userInfo.userId) || [];
				myComments.unshift(newComment);
				uni.setStorageSync('myComments_' + this.userInfo.userId, myComments);

				uni.showToast({
					title: '评论发布成功',
					icon: 'none'
				});
			},

			/**
			 * 评论点赞
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
			 * 封面加载失败兜底
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
				const news = this.transferedNewsList.find(item => item.nid === nid) ||
					newsData.newsList.find(item => item.nid === nid);

				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`,
					success: (res) => {
						res.eventChannel.emit('transferNewsData', {
							news: news,
							newsList: this.transferedNewsList.length > 0 ? this.transferedNewsList :
								newsData.newsList
						});
					}
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

	/* 摘要文本样式 */
	.summary-text {
		font-weight: 500;
		color: #444;
		border-left: 4rpx solid #4facfe;
		padding-left: 16rpx;
		margin-bottom: 30rpx !important;
	}

	/* 默认内容样式 */
	.default-content {
		color: #666;
		font-style: italic;
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