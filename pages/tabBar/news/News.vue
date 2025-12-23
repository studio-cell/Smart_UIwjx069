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

		<scroll-view v-if="categories.length > 0" scroll-y class="news-scroll" @scrolltoupper="onPullDownRefresh"
			@scrolltolower="onReachBottom" refresher-enabled :refresher-threshold="100" ref="scrollRef"
			:refresher-refreshing="isRefreshing">
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条内容</view>
			<view class="news-list">
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
				<view v-if="loadingMore" class="loading-tip">加载中...</view>
				<view v-if="noMore && filteredNews.length > 0" class="no-more-tip">没有更多内容了</view>
				<view v-if="filteredNews.length === 0 && !loadingMore" class="empty-tip">暂无该分类的新闻内容</view>
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
				scrollRef: null,
				isRefreshing: false,
				weatherData: null,
				page: 1,
				pageSize: 10,
				loadingMore: false,
				noMore: false
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
			formatTime(timestamp) {
				if (!timestamp) return "";
				const date = new Date(timestamp);
				return `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
			},
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
			getNewsCategories() {
				this.categories = ["推荐", "时政", "财经", "娱乐", "体育", "科技", "广告"];
			},
			async getNewsList(isRefresh = false) {
				if (isRefresh) {
					this.page = 1;
					this.noMore = false;
					this.isRefreshing = true;
				} else {
					this.loadingMore = true;
				}

				try {
					const category = this.categories[this.currentTab] || "推荐";
					const res = await uniCloud.callFunction({
						name: 'news-getList',
						data: {
							category: category === "推荐" ? "" : category,
							page: this.page,
							pageSize: this.pageSize,
							isAd: category === "广告" ? true : null
						}
					});

					if (res.result.code === 200) {
						const {
							list,
							total
						} = res.result.data;
						if (isRefresh) {
							this.newsList = list;
							this.updateCount = list.length;
							this.showUpdateTip = true;
							setTimeout(() => this.showUpdateTip = false, 3000);
						} else {
							this.newsList = [...this.newsList, ...list];
						}
						this.noMore = this.newsList.length >= total;
					} else {
						uni.showToast({
							title: res.result.message || '加载失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取新闻失败：', error);
					uni.showToast({
						title: '网络异常，加载失败',
						icon: 'none'
					});
				} finally {
					this.isRefreshing = false;
					this.loadingMore = false;
				}
			},
			handleTabClick(index) {
				this.currentTab = index;
				this.page = 1;
				this.noMore = false;
				this.getNewsList();
				this.$nextTick(() => {
					if (this.scrollRef) this.scrollRef.scrollTop = 0;
				});
			},
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
			onPullDownRefresh() {
				this.getNewsList(true);
				setTimeout(() => uni.stopPullDownRefresh(), 1500);
			},
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

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.loading-tip,
	.no-more-tip {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}

	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}
</style>