<template>
	<view class="news-container">
		<!-- 顶部分类导航 -->
		<TabBanner :list="categories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<!-- 下拉刷新容器 -->
		<scroll-view scroll-y class="news-scroll" @scrolltoupper="onPullDownRefresh" refresher-enabled
			refresher-threshold="100">
			<!-- 数据更新提醒（3秒后自动消失） -->
			<view v-if="showUpdateTip" class="update-tip">
				为您更新了{{ updateCount }}条内容
			</view>

			<!-- 新闻列表 -->
			<view class="news-list">
				<NewsCard v-for="news in filteredNews" :key="news.nid" :nid="news.nid" :title="news.title"
					:cover="news.cover" :summary="news.summary" :author="news.author" :time="news.time"
					:comments="news.comments" :is-top="news.isTop" @card-click="goToDetail(news.nid)"></NewsCard>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import TabBanner from "@/components/TabBanner.vue";
	import NewsCard from "@/components/NewsCard.vue";
	import newsData from "@/Data/news.json";

	export default {
		components: {
			TabBanner,
			NewsCard
		},
		data() {
			return {
				categories: newsData.categories,
				newsList: newsData.newsList,
				currentTab: 0,
				showUpdateTip: false, // 是否显示更新提醒
				updateCount: 0 // 更新的新闻数量
			};
		},
		computed: {
			filteredNews() {
				const category = this.categories[this.currentTab];
				return category === "推荐" ?
					this.newsList :
					this.newsList.filter(news => news.category === category);
			}
		},
		methods: {
			handleTabClick(index) {
				this.currentTab = index;
			},
			goToDetail(nid) {
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`
				});
			},
			// 下拉刷新触发
			onPullDownRefresh() {
				// 1. 模拟请求新数据（实际项目对接后端接口）
				setTimeout(() => {
					// 模拟新增2条新闻（拼接到数组前面）
					const newNews = [{
							nid: `new-${Date.now()}-1`,
							title: "最新：央行降准0.5个百分点，释放长期资金约1万亿元",
							cover: "/static/news/money.jpg",
							summary: "央行今日宣布降准，支持实体经济发展，市场流动性将进一步宽松",
							author: "金融时报",
							time: "2025.10.26",
							comments: 328,
							isTop: false,
							category: "财经"
						},
						{
							nid: `new-${Date.now()}-2`,
							title: "我国成功发射遥感四十号卫星，用于国土普查等任务",
							cover: "/static/news/satellite.jpg",
							summary: "长征二号丁运载火箭在酒泉卫星发射中心成功将遥感四十号卫星送入预定轨道",
							author: "人民日报",
							time: "2025.10.26",
							comments: 512,
							isTop: true,
							category: "时政"
						}
					];

					// 2. 更新新闻列表（新增数据在前）
					this.newsList = [...newNews, ...this.newsList];
					this.updateCount = newNews.length;
					this.showUpdateTip = true; // 显示更新提醒

					// 3. 停止下拉刷新动画
					uni.stopPullDownRefresh();

					// 4. 3秒后隐藏更新提醒
					setTimeout(() => {
						this.showUpdateTip = false;
					}, 3000);

					// 5. 显示TabBar红点提示（可选，提醒用户有新内容）
					uni.showTabBarRedDot({
						index: 0
					}); // 新闻Tab（第1项）显示红点
				}, 1500);
			}
		},
		onHide() {
			// 页面隐藏时，隐藏TabBar红点
			uni.hideTabBarRedDot({
				index: 0
			});
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

	/* 数据更新提醒样式 */
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
</style>