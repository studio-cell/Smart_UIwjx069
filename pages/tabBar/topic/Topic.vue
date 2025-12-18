<template>
	<view class="topic-container">
		<!-- 顶部分类导航（复用TabBanner组件） -->
		<TabBanner :list="topicCategories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<!-- 下拉刷新容器 -->
		<scroll-view scroll-y class="topic-scroll" @scrolltoupper="onPullDownRefresh" refresher-enabled
			:refresher-threshold="100">
			<!-- 数据更新提醒 -->
			<view v-if="showUpdateTip" class="update-tip">
				为您更新了{{ updateCount }}个热门话题
			</view>

			<!-- 话题列表 -->
			<view class="topic-list">
				<view class="topic-card" v-for="(topic, index) in filteredTopics" :key="topic.tid"
					@click="goToTopicDetail(topic.tid)">
					<!-- 话题标签 -->
					<view class="topic-tag" :style="{ backgroundColor: tagColorList[index % tagColorList.length] }">
						{{ topic.tag }}
					</view>
					<!-- 话题标题 -->
					<view class="topic-title">{{ topic.title }}</view>
					<!-- 话题数据统计 -->
					<view class="topic-stats">
						<text class="stat-item">🔥 {{ topic.hotValue }}热度</text>
						<text class="stat-item">💬 {{ topic.commentCount }}条评论</text>
						<text class="stat-item">❤️ {{ topic.likeCount }}人关注</text>
					</view>
					<!-- 话题最后更新时间 -->
					<view class="topic-time">最后更新：{{ topic.updateTime }}</view>
				</view>
			</view>

			<!-- 空数据提示 -->
			<view v-if="filteredTopics.length === 0" class="empty-tip">
				暂无该分类的话题内容
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// 复用TabBanner组件（和新闻/视频页保持一致）
	import TabBanner from "@/components/TabBanner.vue";

	export default {
		components: {
			TabBanner
		},
		data() {
			return {
				// 话题分类
				topicCategories: ['推荐', '时政', '财经', '娱乐', '体育', '科技', '民生'],
				// 话题列表数据（模拟真实业务结构）
				topicList: [{
						tid: 't1001',
						title: '2025央行降准对普通人有哪些影响？',
						tag: '财经热议',
						hotValue: '89.6万',
						commentCount: 12580,
						likeCount: 86500,
						updateTime: '2025-10-26 18:30',
						category: '财经'
					},
					{
						tid: 't1002',
						title: '2025亚运会中国队金牌数创新高',
						tag: '体育热点',
						hotValue: '156.8万',
						commentCount: 28960,
						likeCount: 198700,
						updateTime: '2025-10-26 20:15',
						category: '体育'
					},
					{
						tid: 't1003',
						title: '人工智能能否替代人类完成创意工作？',
						tag: '科技讨论',
						hotValue: '123.5万',
						commentCount: 35680,
						likeCount: 156300,
						updateTime: '2025-10-26 19:40',
						category: '科技'
					},
					{
						tid: 't1004',
						title: '2025全国两会民生政策解读',
						tag: '时政聚焦',
						hotValue: '210.3万',
						commentCount: 42580,
						likeCount: 289500,
						updateTime: '2025-10-26 17:20',
						category: '时政'
					},
					{
						tid: 't1005',
						title: '某顶流明星疑似塌房，工作室紧急回应',
						tag: '娱乐八卦',
						hotValue: '358.9万',
						commentCount: 89650,
						likeCount: 458200,
						updateTime: '2025-10-26 21:05',
						category: '娱乐'
					},
					{
						tid: 't1006',
						title: '多地出台租房新规，保障租客权益',
						tag: '民生关注',
						hotValue: '98.7万',
						commentCount: 18560,
						likeCount: 96800,
						updateTime: '2025-10-26 16:45',
						category: '民生'
					}
				],
				currentTab: 0, // 当前选中分类下标
				showUpdateTip: false, // 更新提醒显示状态
				updateCount: 0, // 更新的话题数量
				// 话题标签颜色列表（循环使用）
				tagColorList: ['#e53935', '#1e88e5', '#43a047', '#f57c00', '#8e24aa', '#00acc1']
			};
		},
		computed: {
			// 根据分类过滤话题列表
			filteredTopics() {
				const category = this.topicCategories[this.currentTab];
				return category === "推荐" ?
					this.topicList :
					this.topicList.filter(topic => topic.category === category);
			}
		},
		methods: {
			// 切换话题分类
			handleTabClick(index) {
				this.currentTab = index;
			},
			// 跳转到话题详情页
			goToTopicDetail(tid) {
				uni.navigateTo({
					url: `/pages/topicDetail/TopicDetail?tid=${tid}`
				});
			},
			// 下拉刷新加载新话题
			onPullDownRefresh() {
				// 模拟请求新话题数据
				setTimeout(() => {
					// 新增2个热门话题
					const newTopics = [{
							tid: `t_new_${Date.now()}_1`,
							title: "新能源汽车购置税减免政策延长，买车更划算？",
							tag: "财经热议",
							hotValue: "78.5万",
							commentCount: 9850,
							likeCount: 76300,
							updateTime: '2025-10-26 22:10',
							category: "财经"
						},
						{
							tid: `t_new_${Date.now()}_2`,
							title: "国产大模型再次突破，可支持千亿级参数训练",
							tag: "科技前沿",
							hotValue: "189.2万",
							commentCount: 25680,
							likeCount: 168900,
							updateTime: '2025-10-26 22:05',
							category: "科技"
						}
					];

					// 更新话题列表（新增数据在前）
					this.topicList = [...newTopics, ...this.topicList];
					this.updateCount = newTopics.length;
					this.showUpdateTip = true;

					// 停止下拉刷新动画
					uni.stopPullDownRefresh();

					// 3秒后隐藏更新提醒
					setTimeout(() => {
						this.showUpdateTip = false;
					}, 3000);

					// 显示TabBar红点提示
					uni.showTabBarRedDot({
						index: 2
					}); // 话题Tab（第3项）显示红点
				}, 1500);
			}
		},
		onHide() {
			// 页面隐藏时隐藏TabBar红点
			uni.hideTabBarRedDot({
				index: 2
			});
		}
	};
</script>

<style scoped>
	.topic-container {
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.topic-scroll {
		height: calc(100vh - 120rpx);
		padding: 20rpx;
	}

	/* 更新提醒样式（和新闻/视频页保持一致） */
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

	/* 话题列表样式 */
	.topic-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 话题卡片样式 */
	.topic-card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	/* 话题标签 */
	.topic-tag {
		display: inline-block;
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		color: #fff;
		font-size: 20rpx;
		margin-bottom: 15rpx;
	}

	/* 话题标题 */
	.topic-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.4;
		margin-bottom: 15rpx;
	}

	/* 话题数据统计 */
	.topic-stats {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 10rpx;
	}

	.stat-item {
		font-size: 22rpx;
		color: #666;
		margin-right: 15rpx;
		margin-bottom: 5rpx;
	}

	/* 话题更新时间 */
	.topic-time {
		font-size: 20rpx;
		color: #999;
		text-align: right;
	}

	/* 空数据提示 */
	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}
</style>