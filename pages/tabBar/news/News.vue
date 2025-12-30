<template>
	<view class="news-container">
		<TabBanner :list="categories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<view class="weather-wrapper">
			<view v-if="weatherData" class="weather-card">
				<view class="weather-left">
					<text class="weather-icon">{{ getWeatherIcon(weatherData.cond) }}</text>
					<view class="temp-group">
						<text class="temp-high">{{ weatherData.high }}</text>
						<text class="temp-divider">/</text>
						<text class="temp-low">{{ weatherData.low }}</text>
					</view>
					<text class="weather-cond">{{ weatherData.cond }}</text>
				</view>
				<view class="weather-right">
					<view class="weather-item">
						<text class="item-label">日期</text>
						<text class="item-value">{{ weatherData.date }}</text>
					</view>
					<view class="weather-item">
						<text class="item-label">星期</text>
						<text class="item-value">{{ weatherData.week }}</text>
					</view>
				</view>
			</view>
			<view v-else class="weather-loading">
				<text class="loading-text">🌤️ 加载天气中...</text>
			</view>
		</view>

		<scroll-view v-if="categories.length > 0" scroll-y class="news-scroll" ref="scrollRef" :refresher-enabled="true"
			:refresher-threshold="100" :refresher-refreshing="isRefreshing" @refresherrefresh="onRefresherRefresh"
			@scrolltolower="onReachBottom">
			<!-- 刷新更新提示 -->
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条内容</view>

			<!-- 骨架屏 -->
			<view v-if="loadingMore && newsList.length === 0" class="skeleton-list">
				<view class="skeleton-item" v-for="i in 5" :key="i">
					<view class="skeleton-img"></view>
					<view class="skeleton-title"></view>
					<view class="skeleton-desc"></view>
				</view>
			</view>

			<!-- 新闻列表 -->
			<view v-else class="news-list">
				<view v-for="news in filteredNews" :key="news.nid || news._id"
					@click="goToDetail(news.nid || news._id)">
					<NewsView :nid="news.nid || news._id" :title="news.title" :is-top="news.isTop" :author="news.author"
						:comments="news.comments" :time="news.time || formatTime(news.createTime)"
						:mode="news.category === '广告' ? 3 : 2" :images="[news.cover]"
						:bgColor="news.category === '广告' ? '#f9f9f9' : '#fff'" :summary="news.summary"
						:showSearch="news.category === '广告'">
						<template v-slot:tips v-if="news.category === '广告'">
							<view class="search-box">
								<text class="search-label">广告说明：</text>
								<text class="search-tag">本内容为商业推广，不代表本平台观点</text>
							</view>
						</template>
					</NewsView>
				</view>

				<!-- 状态提示 -->
				<view v-if="loadingMore" class="loading-tip">加载中...</view>
				<view v-if="noMore && filteredNews.length > 0" class="no-more-tip">没有更多内容了</view>
				<!-- 替换为新的空数据提示 -->
				<view v-if="filteredNews.length === 0 && !loadingMore" class="empty-container">
					<image src="/static/empty.png" class="empty-img"></image>
					<text class="empty-text">暂无{{ categories[currentTab] }}新闻~</text>
					<button class="empty-btn" @click="getNewsList(true)">点击重试</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import TabBanner from "@/components/TabBanner.vue";
	import NewsView from "@/components/NewsView.vue";

	export default {
		components: {
			TabBanner,
			NewsView
		},
		data() {
			return {
				categories: [],
				newsList: [],
				currentTab: 0,
				showUpdateTip: false,
				updateCount: 0,
				isRefreshing: false,
				weatherData: null,
				page: 1,
				pageSize: 10,
				loadingMore: false,
				noMore: false,
				// 防抖标识
				isTabChanging: false
			};
		},
		computed: {
			filteredNews() {
				const category = this.categories[this.currentTab] || "推荐";
				if (category === "推荐") return this.newsList.filter(n => n.category !== '广告');
				if (category === "广告") return this.newsList.filter(n => n.category === '广告');
				return this.newsList.filter(n => n.category === category && n.category !== '广告');
			}
		},
		onLoad() {
			this.getWeather();
			this.getNewsCategories();
			this.getNewsList();
		},
		methods: {
			/**
			 * 格式化时间戳为相对时间（刚刚/分钟前/小时前/天前），超过30天显示年月日
			 */
			formatTime(timestamp) {
				if (!timestamp) return "";
				// 处理时间格式：如果是字符串转Date，是时间戳转毫秒
				const newsTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
				const now = new Date().getTime();
				const diff = now - newsTime; // 时间差（毫秒）

				const minute = 60 * 1000;
				const hour = 60 * minute;
				const day = 24 * hour;

				if (diff < minute) {
					return "刚刚";
				} else if (diff < hour) {
					return `${Math.floor(diff / minute)}分钟前`;
				} else if (diff < day) {
					return `${Math.floor(diff / hour)}小时前`;
				} else if (diff < 30 * day) {
					return `${Math.floor(diff / day)}天前`;
				} else {
					// 超过30天显示原日期
					const date = new Date(newsTime);
					return `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
				}
			},

			/**
			 * 根据天气状况返回对应图标
			 */
			getWeatherIcon(cond) {
				const iconMap = {
					"晴": "☀️",
					"多云": "⛅",
					"晴转多云": "🌤️",
					"阴": "☁️",
					"雨": "🌧️",
					"小雨": "🌦️",
					"中雨": "🌧️",
					"大雨": "⛈️",
					"雪": "❄️",
					"雷阵雨": "🌩️",
					"雾": "🌫️"
				};
				return iconMap[cond] || "🌤️";
			},

			/**
			 * 获取天气数据（模拟）
			 */
			getWeather() {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const year = tomorrow.getFullYear();
				const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
				const day = String(tomorrow.getDate()).padStart(2, '0');
				const dateStr = `${year}-${month}-${day}`;
				const weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				const weekStr = weekArr[tomorrow.getDay()];
				this.weatherData = {
					date: dateStr,
					week: weekStr,
					high: "26°C",
					low: "18°C",
					cond: "晴转多云"
				};
			},

			/**
			 * 获取新闻分类
			 */
			getNewsCategories() {
				this.categories = ["推荐", "时政", "财经", "娱乐", "体育", "科技", "广告"];
			},

			/**
			 * 获取新闻列表
			 * @param {Boolean} isRefresh - 是否为刷新操作
			 */
			async getNewsList(isRefresh = false) {
				// 防止重复请求
				if ((isRefresh && this.isRefreshing) || (!isRefresh && this.loadingMore)) return;

				if (isRefresh) {
					this.page = 1;
					this.noMore = false;
					this.isRefreshing = true;
					this.showUpdateTip = true;
				} else {
					this.loadingMore = true;
				}

				// 模拟新闻数据（可注释掉下面的mock数据，测试空数据提示效果）
				const mockNewsList = [{
						nid: 'n1001',
						title: '2025央行降准0.5个百分点，释放长期资金约1万亿元',
						author: '财经时报',
						comments: 1256,
						createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(), // 2小时前
						category: '财经',
						cover: 'https://picsum.photos/400/200?random=1',
						summary: '央行今日宣布降准，旨在支持实体经济发展，降低企业融资成本...',
						isTop: true
					},
					{
						nid: 'n1002',
						title: '2025亚运会中国队斩获第100枚金牌，创历史新高',
						author: '体育周报',
						comments: 8950,
						createTime: new Date(Date.now() - 5 * 60 * 1000).getTime(), // 5分钟前
						category: '体育',
						cover: 'https://picsum.photos/400/200?random=2',
						summary: '在刚刚结束的亚运会比赛中，中国队在跳水项目再夺一金，金牌总数突破100枚...',
						isTop: false
					},
					{
						nid: 'n1003',
						title: '人工智能大模型迎来重大突破，可自主完成复杂任务',
						author: '科技前沿',
						comments: 3580,
						createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).getTime(), // 1天前
						category: '科技',
						cover: 'https://picsum.photos/400/200?random=3',
						summary: '国内科技企业发布新一代AI大模型，具备自主学习和决策能力，应用场景覆盖多个领域...',
						isTop: false
					},
					{
						nid: 'n1004',
						title: '2025全国两会重点关注民生问题，多领域政策将调整',
						author: '时政新闻',
						comments: 6890,
						createTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).getTime(), // 35天前
						category: '时政',
						cover: 'https://picsum.photos/400/200?random=4',
						summary: '全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点...',
						isTop: true
					},
					{
						nid: 'n1005',
						title: '热门电影票房突破50亿，成年度票房冠军',
						author: '娱乐星探',
						comments: 9870,
						createTime: new Date(Date.now() - 10 * 1000).getTime(), // 10秒前
						category: '娱乐',
						cover: 'https://picsum.photos/400/200?random=5',
						summary: '某国产电影上映10天票房突破50亿，刷新多项票房纪录...',
						isTop: false
					},
					{
						nid: 'ad1001',
						title: '【广告】新款智能手机限时特惠，立减800元',
						author: '品牌官方',
						comments: 0,
						createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(), // 7天前
						category: '广告',
						cover: 'https://picsum.photos/400/200?random=6',
						summary: '新款旗舰手机搭载最新处理器，限时优惠活动进行中...',
						isTop: false
					}
				];

				// 模拟接口请求延迟
				setTimeout(() => {
					if (isRefresh) {
						this.newsList = mockNewsList;
						this.updateCount = mockNewsList.length;
						// 3秒后隐藏更新提示
						setTimeout(() => this.showUpdateTip = false, 3000);
					} else {
						const moreNews = [{
							nid: `n_new_${Date.now()}`,
							title: '新能源汽车补贴政策调整，购车可享更多优惠',
							author: '汽车之家',
							comments: 1200,
							createTime: new Date().getTime(), // 刚刚
							category: '财经',
							cover: 'https://picsum.photos/400/200?random=7',
							summary: '最新新能源汽车补贴政策出台，续航超600km车型补贴提高...',
							isTop: false
						}];
						this.newsList = [...this.newsList, ...moreNews];
						this.noMore = true;
					}
					this.isRefreshing = false;
					this.loadingMore = false;
					this.isTabChanging = false;
				}, 1000);
			},

			/**
			 * 处理标签切换
			 */
			handleTabClick(index) {
				// 防抖处理：避免快速切换重复请求
				if (this.isTabChanging || index === this.currentTab) return;

				this.isTabChanging = true;
				this.currentTab = index;
				this.page = 1;
				this.noMore = false;
				this.getNewsList();

				// 滚动到顶部
				this.$nextTick(() => {
					const scrollView = this.$refs.scrollRef;
					if (scrollView) {
						scrollView.scrollTo({
							scrollTop: 0,
							duration: 300
						});
					}
				});
			},

			/**
			 * 跳转到新闻详情页
			 */
			goToDetail(nid) {
				const news = this.newsList.find(item => (item.nid || item._id) === nid);
				if (news && news.category === '广告') {
					uni.showToast({
						title: "广告内容暂无法查看详情",
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`,
					success: (res) => {
						res.eventChannel.emit('transferNewsData', {
							news: news,
							newsList: this.newsList
						});
					}
				});
			},

			/**
			 * scroll-view 下拉刷新
			 */
			onRefresherRefresh() {
				this.getNewsList(true);
			},

			/**
			 * 上拉加载更多
			 */
			onReachBottom() {
				if (!this.noMore && !this.loadingMore && !this.isRefreshing) {
					this.page += 1;
					this.getNewsList();
				}
			}
		},
		onHide() {
			uni.hideTabBarRedDot({
				index: 0
			});
		},
		onUnmounted() {
			this.isRefreshing = false;
		}
	};
</script>

<style scoped>
	.news-container {
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.weather-wrapper {
		padding: 0 20rpx 16rpx;
	}

	.weather-card {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		border-radius: 12rpx;
		padding: 16rpx 20rpx;
		color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.15);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.weather-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.weather-icon {
		font-size: 36rpx;
	}

	.temp-group {
		display: flex;
		align-items: baseline;
	}

	.temp-high {
		font-size: 32rpx;
		font-weight: bold;
		line-height: 1;
	}

	.temp-divider {
		font-size: 18rpx;
		margin: 0 4rpx;
		opacity: 0.8;
	}

	.temp-low {
		font-size: 20rpx;
		opacity: 0.8;
	}

	.weather-cond {
		font-size: 20rpx;
		margin-left: 8rpx;
	}

	.weather-right {
		display: flex;
		gap: 20rpx;
	}

	.weather-item {
		text-align: center;
	}

	.item-label {
		display: block;
		font-size: 16rpx;
		opacity: 0.7;
		margin-bottom: 2rpx;
	}

	.item-value {
		font-size: 18rpx;
		font-weight: 500;
	}

	.weather-loading {
		text-align: center;
		padding: 16rpx 0;
	}

	.loading-text {
		font-size: 20rpx;
		color: #999;
	}

	.news-scroll {
		height: calc(100vh - 120rpx - 100rpx);
		padding: 0 20rpx 20rpx;
	}

	.update-tip {
		background-color: #d00;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		padding: 12rpx;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 骨架屏样式 */
	.skeleton-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.skeleton-item {
		display: flex;
		gap: 15rpx;
		padding: 10rpx;
	}

	.skeleton-img {
		width: 120rpx;
		height: 120rpx;
		background: #eee;
		border-radius: 8rpx;
		animation: flash 1s infinite alternate;
	}

	.skeleton-title {
		flex: 1;
		height: 30rpx;
		background: #eee;
		border-radius: 4rpx;
		animation: flash 1s infinite alternate;
	}

	.skeleton-desc {
		flex: 1;
		height: 20rpx;
		background: #eee;
		margin-top: 10rpx;
		border-radius: 4rpx;
		animation: flash 1s infinite alternate;
	}

	@keyframes flash {
		from {
			opacity: 0.5;
		}

		to {
			opacity: 1;
		}
	}

	/* 新闻列表样式 */
	.news-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 提示文本样式 */
	.loading-tip,
	.no-more-tip {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}

	/* 新增空数据提示样式 */
	.empty-container {
		text-align: center;
		padding: 50rpx 0;
	}

	.empty-img {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.empty-btn {
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border-radius: 30rpx;
	}

	/* 广告搜索框样式 */
	.search-box {
		padding: 10rpx;
		margin-top: 10rpx;
	}

	.search-label {
		font-size: 22rpx;
		color: #666;
	}

	.search-tag {
		font-size: 20rpx;
		color: #999;
		margin-left: 10rpx;
	}
</style>