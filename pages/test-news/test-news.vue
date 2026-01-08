<template>
	<view class="test-container">
		<view class="header">
			<text class="title">新闻列表测试</text>
		</view>

		<view class="control-panel">
			<button class="test-btn" @click="loadCloudData">测试云函数数据</button>
			<button class="test-btn primary" @click="loadLocalData">测试本地数据</button>
			<button class="test-btn danger" @click="clearData">清空列表</button>
		</view>

		<view class="info-panel">
			<text class="info-text">当前数据源：{{ dataSource }}</text>
			<text class="info-text">新闻数量：{{ newsList.length }}</text>
			<text class="info-text">当前分类：{{ currentCategory }}</text>
		</view>

		<scroll-view scroll-y class="news-scroll">
			<view class="news-list">
				<view v-for="news in newsList" :key="news.nid" class="news-item" @click="viewDetail(news)">
					<image v-if="news.cover" :src="news.cover" class="news-cover" mode="aspectFill"></image>
					<view class="news-info">
						<text class="news-title">{{ news.title }}</text>
						<text class="news-summary">{{ news.summary }}</text>
						<view class="news-meta">
							<text class="news-author">{{ news.author }}</text>
							<text class="news-category">{{ news.category }}</text>
							<text class="news-time">{{ news.time }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataSource: '无',
				newsList: [],
				currentCategory: '推荐'
			};
		},
		methods: {
			async loadCloudData() {
				uni.showLoading({ title: '加载云函数数据...' });

				try {
					const res = await uniCloud.callFunction({
						name: 'news-getList',
						data: {
							page: 1,
							pageSize: 20
						}
					});

					console.log('云函数返回：', res.result);

					if (res.result.code === 200) {
						this.dataSource = '云函数';
						this.newsList = res.result.data.list.map(item => ({
							nid: item._id,
							title: item.title,
							author: item.author,
							comments: item.comments_count || 0,
							time: this.formatTime(item.publish_time),
							category: item.category,
							cover: item.cover,
							summary: item.summary,
							content: item.content
						}));

						uni.showToast({
							title: `加载成功，共${this.newsList.length}条`,
							icon: 'success'
						});
					} else {
						throw new Error(res.result.message);
					}
				} catch (error) {
					console.error('加载云函数数据失败：', error);
					this.dataSource = '云函数失败';
					uni.showToast({
						title: '云函数加载失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			loadLocalData() {
				uni.showLoading({ title: '加载本地数据...' });

				// 本地模拟数据
				const mockNewsList = [
					{
						nid: 'n1001',
						title: '2025央行降准0.5个百分点，释放长期资金约1万亿元',
						author: '财经时报',
						comments: 1256,
						time: '2小时前',
						category: '财经',
						cover: 'https://picsum.photos/400/200?random=1',
						summary: '央行今日宣布降准，旨在支持实体经济发展，降低企业融资成本...',
						content: '<p>中国人民银行今日宣布，为支持实体经济发展，降低社会融资成本，决定于近期实施降准措施，下调金融机构存款准备金率0.5个百分点。</p><p>此次降准将释放长期资金约1万亿元，为银行体系提供低成本、长期稳定的流动性资金。</p>'
					},
					{
						nid: 'n1002',
						title: '2025亚运会中国队斩获第100枚金牌，创历史新高',
						author: '体育周报',
						comments: 8950,
						time: '5分钟前',
						category: '体育',
						cover: 'https://picsum.photos/400/200?random=2',
						summary: '在刚刚结束的亚运会比赛中，中国队在跳水项目再夺一金，金牌总数突破100枚...',
						content: '<p>在刚刚结束的亚运会跳水女子10米台决赛中，中国选手以完美表现夺得金牌，这是中国代表团在本届亚运会上获得的第100枚金牌，创造了历史新高。</p>'
					},
					{
						nid: 'n1003',
						title: '人工智能大模型迎来重大突破，可自主完成复杂任务',
						author: '科技前沿',
						comments: 3580,
						time: '1天前',
						category: '科技',
						cover: 'https://picsum.photos/400/200?random=3',
						summary: '国内科技企业发布新一代AI大模型，具备自主学习和决策能力，应用场景覆盖多个领域...',
						content: '<p>国内知名科技企业今日发布了新一代人工智能大模型，该模型在自主学习和决策能力方面取得重大突破，引起了业界广泛关注。</p>'
					},
					{
						nid: 'n1004',
						title: '2025全国两会重点关注民生问题，多领域政策将调整',
						author: '时政新闻',
						comments: 6890,
						time: '35天前',
						category: '时政',
						cover: 'https://picsum.photos/400/200?random=4',
						summary: '全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点...',
						content: '<p>全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点，预计将有多个领域的政策进行调整和优化。</p>'
					},
					{
						nid: 'n1005',
						title: '热门电影票房突破50亿，成年度票房冠军',
						author: '娱乐星探',
						comments: 9870,
						time: '刚刚',
						category: '娱乐',
						cover: 'https://picsum.photos/400/200?random=5',
						summary: '某国产电影上映10天票房突破50亿，刷新多项票房纪录...',
						content: '<p>某国产电影上映10天票房突破50亿，刷新多项票房纪录，成为年度票房冠军。</p>'
					}
				];

				this.dataSource = '本地模拟';
				this.newsList = mockNewsList;

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: `加载成功，共${this.newsList.length}条`,
						icon: 'success'
					});
				}, 500);
			},

			clearData() {
				this.dataSource = '无';
				this.newsList = [];
				uni.showToast({
					title: '已清空',
					icon: 'none'
				});
			},

			viewDetail(news) {
				console.log('查看新闻详情：', news);
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${news.nid}`,
					success: (res) => {
						res.eventChannel.emit('transferNewsData', {
							news: news,
							newsList: this.newsList
						});
					}
				});
			},

			formatTime(timestamp) {
				if (!timestamp) return "";
				const newsTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
				const now = new Date().getTime();
				const diff = now - newsTime;

				const minute = 60 * 1000;
				const hour = 60 * minute;
				const day = 24 * hour;

				if (diff < minute) return "刚刚";
				if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
				if (diff < day) return `${Math.floor(diff / hour)}小时前`;
				if (diff < 30 * day) return `${Math.floor(diff / day)}天前`;

				const date = new Date(newsTime);
				return `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
			}
		}
	};
</script>

<style scoped>
	.test-container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		padding: 20rpx;
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.control-panel {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.test-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #fff;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #333;
		border: 1px solid #ddd;
	}

	.test-btn.primary {
		background-color: #409eff;
		color: #fff;
		border-color: #409eff;
	}

	.test-btn.danger {
		background-color: #f56c6c;
		color: #fff;
		border-color: #f56c6c;
	}

	.info-panel {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.info-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
	}

	.news-scroll {
		height: calc(100vh - 400rpx);
	}

	.news-item {
		display: flex;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		gap: 20rpx;
	}

	.news-cover {
		width: 200rpx;
		height: 150rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}

	.news-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.news-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.news-summary {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.news-meta {
		display: flex;
		gap: 15rpx;
		align-items: center;
		font-size: 22rpx;
		color: #999;
	}

	.news-author {
		color: #409eff;
	}
</style>
