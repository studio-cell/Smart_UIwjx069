<template>
	<view class="news-container">
		<!-- 分类标签栏 -->
		<TabBanner :list="categories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<!-- 紧凑版天气卡片 -->
		<view class="weather-wrapper">
			<view v-if="weatherData" class="weather-card">
				<!-- 左侧：核心天气信息 -->
				<view class="weather-left">
					<text class="weather-icon">{{ getWeatherIcon(weatherData.cond) }}</text>
					<view class="temp-group">
						<text class="temp-high">{{ weatherData.high }}</text>
						<text class="temp-divider">/</text>
						<text class="temp-low">{{ weatherData.low }}</text>
					</view>
					<text class="weather-cond">{{ weatherData.cond }}</text>
				</view>

				<!-- 右侧：辅助信息 -->
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

		<!-- 新闻列表滚动区域 -->
		<scroll-view v-if="categories.length > 0" scroll-y class="news-scroll" @scrolltoupper="onPullDownRefresh"
			refresher-enabled :refresher-threshold="100" ref="scrollRef">
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条内容</view>
			<view class="news-list">
				<view v-for="news in filteredNews" :key="news.nid" @click="goToDetail(news.nid)">
					<NewsView :nid="news.nid" :title="news.title" :is-top="news.isTop" :author="news.author"
						:comments="news.comments" :time="news.time" :mode="news.category === '广告' ? 3 : 2"
						:images="[news.cover]" :bgColor="news.category === '广告' ? '#f9f9f9' : '#fff'"
						:summary="news.summary" :showSearch="news.category === '广告'">
						<template v-slot:tips v-if="news.category === '广告'">
							<view class="search-box">
								<text class="search-label">广告说明：</text>
								<text class="search-tag">本内容为商业推广，不代表本平台观点</text>
							</view>
						</template>
					</NewsView>
				</view>
				<view v-if="filteredNews.length === 0" class="empty-tip">暂无该分类的新闻内容</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import TabBanner from "@/components/TabBanner.vue";
	import NewsView from "@/components/NewsView.vue";
	import newsData from "@/Data/news.json";

	export default {
		components: {
			TabBanner,
			NewsView
		},
		data() {
			return {
				categories: newsData.categories,
				newsList: newsData.newsList,
				currentTab: 0,
				showUpdateTip: false,
				updateCount: 0,
				scrollRef: null,
				isRefreshing: false,
				weatherData: null
			};
		},
		computed: {
			filteredNews() {
				const category = this.categories[this.currentTab];
				if (category === "推荐") return this.newsList.filter(n => n.category !== '广告');
				if (category === "广告") return this.newsList.filter(n => n.category === '广告');
				return this.newsList.filter(n => n.category === category && n.category !== '广告');
			}
		},
		onLoad() {
			this.getWeather();
		},
		methods: {
			// 根据天气状况返回对应图标
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

			getWeather() {
				// 计算明天日期
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const year = tomorrow.getFullYear();
				const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
				const day = String(tomorrow.getDate()).padStart(2, '0');
				const dateStr = `${year}-${month}-${day}`;

				// 星期数组
				const weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				const weekStr = weekArr[tomorrow.getDay()];

				// 模拟天气数据
				this.weatherData = {
					date: dateStr,
					week: weekStr,
					high: "26°C",
					low: "18°C",
					cond: "晴转多云"
				};
			},

			handleTabClick(index) {
				this.currentTab = index;
				this.$nextTick(() => {
					if (this.scrollRef) this.scrollRef.scrollTop = 0;
				});
			},

			goToDetail(nid) {
				const news = this.newsList.find(item => item.nid === nid);
				if (news && news.category === '广告') {
					uni.showToast({
						title: "广告内容暂无法查看详情",
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
				});
			},

			onPullDownRefresh() {
				if (this.isRefreshing) return;
				this.isRefreshing = true;
				setTimeout(() => {
					const newNews = [{
						nid: `new-${Date.now()}-1`,
						title: "最新：央行降准0.5个百分点，释放长期资金约1万亿元",
						cover: "https://picsum.photos/200/160",
						summary: "央行今日宣布降准，支持实体经济发展，市场流动性将进一步宽松",
						author: "金融时报",
						time: "2025.10.26",
						comments: 328,
						isTop: false,
						category: "财经"
					}, {
						nid: `new-${Date.now()}-2`,
						title: "我国成功发射遥感四十号卫星，用于国土普查等任务",
						cover: "https://picsum.photos/200/160",
						summary: "长征二号丁运载火箭在酒泉卫星发射中心成功将遥感四十号卫星送入预定轨道",
						author: "人民日报",
						time: "2025.10.26",
						comments: 512,
						isTop: true,
						category: "时政"
					}];
					this.newsList = [...newNews, ...this.newsList];
					this.updateCount = newNews.length;
					this.showUpdateTip = true;
					this.$nextTick(() => uni.stopPullDownRefresh());
					setTimeout(() => this.showUpdateTip = false, 3000);
					uni.showTabBarRedDot({
						index: 0
					});
					this.isRefreshing = false;
				}, 1500);
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

	/* 天气卡片 - 紧凑版 */
	.weather-wrapper {
		padding: 0 20rpx 16rpx;
		/* 减少底部内边距 */
	}

	.weather-card {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		border-radius: 12rpx;
		padding: 16rpx 20rpx;
		/* 大幅减少内边距 */
		color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.15);
		display: flex;
		/* 横向布局，节省高度 */
		align-items: center;
		justify-content: space-between;
	}

	/* 左侧核心信息 */
	.weather-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.weather-icon {
		font-size: 36rpx;
		/* 缩小图标 */
	}

	.temp-group {
		display: flex;
		align-items: baseline;
	}

	.temp-high {
		font-size: 32rpx;
		/* 大幅缩小温度字体 */
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
		/* 缩小低温字体 */
		opacity: 0.8;
	}

	.weather-cond {
		font-size: 20rpx;
		/* 缩小天气状况字体 */
		margin-left: 8rpx;
	}

	/* 右侧辅助信息 */
	.weather-right {
		display: flex;
		gap: 20rpx;
		/* 横向排列，节省高度 */
	}

	.weather-item {
		text-align: center;
	}

	.item-label {
		display: block;
		font-size: 16rpx;
		/* 缩小标签字体 */
		opacity: 0.7;
		margin-bottom: 2rpx;
	}

	.item-value {
		font-size: 18rpx;
		/* 缩小数值字体 */
		font-weight: 500;
	}

	/* 加载状态 */
	.weather-loading {
		text-align: center;
		padding: 16rpx 0;
		/* 减少加载状态高度 */
	}

	.loading-text {
		font-size: 20rpx;
		color: #999;
	}

	/* 新闻滚动区域 - 恢复更多高度 */
	.news-scroll {
		height: calc(100vh - 120rpx - 100rpx);
		/* 天气卡片高度大幅降低 */
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

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}
</style>