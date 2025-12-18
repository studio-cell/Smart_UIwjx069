<template>
	<view class="news-container">
		<TabBanner :list="categories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>
		<scroll-view v-if="categories.length > 0" scroll-y class="news-scroll" @scrolltoupper="onPullDownRefresh"
			refresher-enabled :refresher-threshold="100" ref="scrollRef">
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条内容</view>
			<view class="news-list">
				<!-- 核心修复：将 NewsView 所有属性写在一行，避免换行解析异常 -->
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
				isRefreshing: false
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
		methods: {
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

	.news-scroll {
		height: calc(100vh - 120rpx);
		padding: 20rpx;
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