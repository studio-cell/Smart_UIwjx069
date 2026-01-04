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
				<!-- 动态显示收藏图标状态 -->
				<text class="iconfont" :class="{ collected: isCollected }">★</text>
				<text class="btn-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
			</view>
			<view class="footer-btn" @click="handleLike">
				<text class="iconfont" :class="{ liked: isLiked }">👍</text>
				<text class="btn-text">{{ isLiked ? '已点赞' : '点赞' }}</text>
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
				authorId: '', // 新闻作者ID（从新闻数据中获取）
				isCollected: false, // 是否收藏该新闻（新增）
				isLiked: false // 是否点赞该新闻（新增）
			};
		},
		onLoad(options) {
			// 接收从列表页传递的新闻数据（优先使用）
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('transferNewsData', (data) => {
				this.news = data.news || {};
				this.newsList = data.newsList || [];
				// 修复：模拟数据无authorId，直接用author作为标识
				this.authorId = this.news.author;
				// 修复：模拟环境下跳过云函数查询，默认未关注
				this.isFollowed = false;
				// 初始化收藏状态（新增）
				this.initCollectStatus();
				// 初始化点赞状态（新增）
				this.initLikeStatus();
				// 记录浏览历史
				this.saveToHistory();
				console.log('从列表页获取新闻数据：', JSON.parse(JSON.stringify(this.news)));
			});

			// 仅当无列表页数据、且有nid参数时，才尝试从本地获取（避免模拟环境报错）
			if (options.nid && !Object.keys(this.news).length) {
				// 模拟环境下，直接从本地newsList找数据，不调用云函数
				const mockNews = this.newsList.find(item => item.nid === options.nid);
				if (mockNews) {
					this.news = mockNews;
					this.authorId = mockNews.author;
					// 初始化收藏状态（新增）
					this.initCollectStatus();
					// 初始化点赞状态（新增）
					this.initLikeStatus();
					// 记录浏览历史
					this.saveToHistory();
				} else {
					uni.showToast({
						title: '暂无该新闻数据',
						icon: 'none'
					});
				}
				// 注释掉云函数调用，避免报错
				// this.getNewsDetail(options.nid);
			}
		},
		methods: {
			/**
			 * 记录浏览历史到本地存储
			 */
			saveToHistory() {
				if (!this.news.nid) return;

				// 获取当前浏览历史
				let historyList = uni.getStorageSync('newsHistory') || [];

				// 构建历史记录对象
				const historyItem = {
					newsId: this.news.nid,
					title: this.news.title,
					cover: this.news.images ? this.news.images[0] : '',
					viewTime: new Date().getTime()
				};

				// 检查是否已存在该新闻的历史记录
				const existingIndex = historyList.findIndex(item => item.newsId === this.news.nid);
				if (existingIndex !== -1) {
					// 如果已存在，删除旧记录
					historyList.splice(existingIndex, 1);
				}

				// 将新记录插入到最前面
				historyList.unshift(historyItem);

				// 限制历史记录数量，最多保存50条
				if (historyList.length > 50) {
					historyList = historyList.slice(0, 50);
				}

				// 保存到本地存储
				uni.setStorageSync('newsHistory', historyList);
				console.log('浏览历史已保存：', historyList);
			},

			/**
			 * 初始化收藏状态（新增）
			 */
			initCollectStatus() {
				if (!this.news.nid) return;
				const collectedNews = uni.getStorageSync('collectedNews') || [];
				this.isCollected = collectedNews.includes(this.news.nid);
			},

			/**
			 * 初始化点赞状态（新增）
			 */
			initLikeStatus() {
				if (!this.news.nid) return;
				const likedNews = uni.getStorageSync('likedNews') || [];
				this.isLiked = likedNews.includes(this.news.nid);
			},

			/**
			 * 查询作者关注状态（模拟环境下注释云函数调用）
			 */
			async checkFollowStatus() {
				// 模拟环境下跳过云函数查询
				const userInfo = uni.getStorageSync('userInfo');
				if (!userInfo?.isLogin || !this.authorId) return;
				// 注释云函数调用，默认未关注
				// try {
				//   const res = await uniCloud.callFunction({
				//     name: 'follow-check',
				//     data: { userId: userInfo.userId, authorId: this.authorId }
				//   });
				//   this.isFollowed = res.result?.data?.isFollowed || false;
				// } catch (error) {
				//   console.error('查询关注状态失败：', error);
				// }
			},

			/**
			 * 点击关注/取消关注（精准匹配你提供的版本）
			 */
			async handleFollow() {
				const userInfo = uni.getStorageSync('userInfo');
				// 未登录拦截
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

				// 无作者ID提示
				if (!this.authorId) {
					uni.showToast({
						title: '作者信息异常',
						icon: 'none'
					});
					return;
				}

				// 模拟环境：仅更新本地状态，不调用云函数
				this.isFollowed = !this.isFollowed;
				uni.showToast({
					title: this.isFollowed ? '关注成功' : '取消关注成功',
					icon: 'success'
				});

				// 真实环境的云函数调用（后续启用）
				// try {
				//   const res = await uniCloud.callFunction({
				//     name: 'follow-toggle',
				//     data: {
				//       userId: userInfo.userId,
				//       authorId: this.authorId,
				//       isFollowed: !this.isFollowed
				//     }
				//   });
				//   if (res.result?.code === 200) {
				//     this.isFollowed = !this.isFollowed;
				//     uni.showToast({
				//       title: this.isFollowed ? '关注成功' : '取消关注成功',
				//       icon: 'success'
				//     });
				//   } else {
				//     uni.showToast({ title: res.result?.msg || '操作失败', icon: 'none' });
				//   }
				// } catch (error) {
				//   console.error('关注操作失败：', error);
				//   uni.showToast({ title: '网络异常，操作失败', icon: 'none' });
				// }
			},

			/**
			 * 获取新闻详情（模拟环境下注释云函数调用）
			 */
			async getNewsDetail(nid) {
				// 模拟环境下注释，后续对接真实云数据库再启用
				// try {
				//   const res = await uniCloud.callFunction({
				//     name: 'news-detail',
				//     data: { nid }
				//   });
				//   if (res.result?.code === 200) {
				//     this.news = res.result.data;
				//     this.authorId = this.news.authorId || this.news.author;
				//     this.checkFollowStatus();
				//   }
				// } catch (error) {
				//   console.error('获取新闻详情失败：', error);
				//   uni.showToast({ title: '获取新闻详情失败', icon: 'none' });
				// }
			},

			/**
			 * 跳转到作者主页（模拟环境下仅提示，无实际跳转）
			 */
			goToAuthorHome() {
				if (!this.authorId) return;
				// 模拟环境下仅提示，后续对接作者主页再启用跳转
				uni.showToast({
					title: `进入${this.news.author}的主页`,
					icon: 'none'
				});
				// 真实环境跳转代码（注释）
				// uni.navigateTo({
				//   url: `/pages/author/Author?authorId=${this.authorId}&authorName=${this.news.author}`
				// });
			},

			/**
			 * 收藏新闻（替换为你提供的版本，新增状态更新）
			 */
			handleCollect() {
				const userInfo = uni.getStorageSync('userInfo');
				if (!userInfo?.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				// 模拟收藏：本地存储记录已收藏的新闻ID
				let collectedNews = uni.getStorageSync('collectedNews') || [];
				const isCollected = collectedNews.includes(this.news.nid);
				if (isCollected) {
					collectedNews = collectedNews.filter(id => id !== this.news.nid);
					this.isCollected = false; // 更新本地状态
					uni.showToast({
						title: '取消收藏成功',
						icon: 'success'
					});
				} else {
					collectedNews.push(this.news.nid);
					this.isCollected = true; // 更新本地状态
					uni.showToast({
						title: '收藏成功',
						icon: 'success'
					});
				}
				uni.setStorageSync('collectedNews', collectedNews);
			},

			/**
			 * 点赞新闻（新增）
			 */
			handleLike() {
				const userInfo = uni.getStorageSync('userInfo');
				if (!userInfo?.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				// 模拟点赞：本地存储记录已点赞的新闻ID
				let likedNews = uni.getStorageSync('likedNews') || [];
				const isLiked = likedNews.includes(this.news.nid);
				if (isLiked) {
					likedNews = likedNews.filter(id => id !== this.news.nid);
					this.isLiked = false; // 更新本地状态
					uni.showToast({
						title: '取消点赞成功',
						icon: 'success'
					});
				} else {
					likedNews.push(this.news.nid);
					this.isLiked = true; // 更新本地状态
					uni.showToast({
						title: '点赞成功',
						icon: 'success'
					});
				}
				uni.setStorageSync('likedNews', likedNews);
			},

			/**
			 * 分享新闻（模拟环境下仅提示）
			 */
			handleShare() {
				// 模拟环境下仅提示，后续对接真实分享功能再启用
				uni.showToast({
					title: `分享《${this.news.title}》成功`,
					icon: 'success'  
				});
				// 真实环境分享代码（注释）
				// uni.share({
				//   title: this.news.title,
				//   path: `/pages/newsDetail/NewsDetail?nid=${this.news.nid}`
				// });
			},

			/**
			 * 评论新闻
			 */
			handleComment() {
				if (!this.news.nid) {
					uni.showToast({
						title: '新闻信息异常',
						icon: 'none'
					});
					return;
				}
				// 跳转到评论页面
				uni.navigateTo({
					url: `/pages/comment/Comment?nid=${this.news.nid}&title=${encodeURIComponent(this.news.title)}&commentCount=${this.news.comments || 0}`
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

	/* 新增收藏状态样式 */
	.iconfont.collected {
		color: #ff9900;
	}

	/* 新增点赞状态样式 */
	.iconfont.liked {
		color: #e63946;
	}

	.btn-text {
		font-size: 22rpx;
		color: #999;
	}
</style>