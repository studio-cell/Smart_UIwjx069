<template>
	<view class="topic-container">
		<TabBanner :list="topicCategories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<view class="search-bar">
			<input class="search-input" v-model="searchKeyword" placeholder="搜索话题..." @confirm="handleSearch" />
			<text class="search-btn" @click="handleSearch">🔍</text>
		</view>

		<scroll-view scroll-y class="topic-scroll" @scrolltoupper="onPullDownRefresh" refresher-enabled
			:refresher-threshold="100">
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}个热门话题</view>

			<view v-if="loading" class="loading-tip">加载中...</view>

			<view class="topic-list">
				<view class="topic-card" v-for="(topic, index) in displayTopics" :key="topic._id"
					@click="loadTopicVideos(topic)">
					<view class="topic-tag" :style="{ backgroundColor: tagColorList[index % tagColorList.length] }">
						{{ topic.tag }}
					</view>
					<view class="topic-title">{{ topic.title }}</view>
					<view class="topic-stats">
						<text class="stat-item">🔥 {{ topic.hotValue }}热度</text>
						<text class="stat-item">💬 {{ topic.commentCount }}条评论</text>
						<text class="stat-item">❤️ {{ topic.likeCount }}人关注</text>
					</view>
					<view class="topic-time">最后更新：{{ formatTime(topic.updateTime) }}</view>
				</view>
			</view>

			<view v-if="currentTopic" class="topic-video-section">
				<view class="section-title">
					{{ currentTopic.title }} · 相关视频
					<text class="video-count">({{ topicVideos.length }}个)</text>
				</view>
				<view class="video-list">
					<view class="video-card" v-for="video in topicVideos" :key="video.vid" @click="playVideo(video)">
						<image class="video-cover" :src="video.cover" mode="aspectFill"></image>
						<view class="video-meta">
							<text class="duration">{{ video.duration }}</text>
							<text class="play-count">{{ video.playCount }}次播放</text>
						</view>
						<view class="video-title">{{ video.title }}</view>
					</view>
				</view>
			</view>

			<view v-if="displayTopics.length === 0 && !loading" class="empty-tip">{{ searchKeyword ? '未找到相关话题' : '暂无该分类的话题内容' }}</view>
		</scroll-view>

		<view v-if="showPlayer" class="video-player-mask" @click="closePlayer">
			<video class="video-player" :src="currentVideo.url" :controls="true" :autoplay="true"
				@ended="closePlayer"></video>
		</view>
	</view>
</template>

<script>
	import TabBanner from "@/components/TabBanner.vue";

	export default {
		components: {
			TabBanner
		},
		data() {
			return {
				topicCategories: ['推荐', '时政', '财经', '娱乐', '体育', '科技', '民生'],
				topicList: [],
				currentTab: 0,
				showUpdateTip: false,
				updateCount: 0,
				tagColorList: ['#e53935', '#1e88e5', '#43a047', '#f57c00', '#8e24aa', '#00acc1'],
				currentTopic: null,
				topicVideos: [],
				loading: false,
				loadingMore: false,
				showPlayer: false,
				currentVideo: {},
				searchKeyword: '',
				searchResults: []
			};
		},
		computed: {
			displayTopics() {
				console.log('当前话题列表数量:', this.topicList.length);
				console.log('当前分类:', this.topicCategories[this.currentTab]);
				console.log('显示的话题数量:', this.searchKeyword ? this.searchResults.length : this.topicList.length);

				if (this.searchKeyword) {
					return this.searchResults;
				}
				return this.topicList;
			}
		},
		methods: {
			async loadTopics(refresh = false) {
				this.loading = true;
				const category = this.topicCategories[this.currentTab];

				try {
					const res = await uniCloud.callFunction({
						name: 'topic-getList',
						data: {
							category,
							page: 1,
							pageSize: 20
						}
					});

					console.log('话题云函数返回结果：', res.result);

					if (res.result.code === 200) {
						console.log('解析后的话题数据数量：', res.result.data.list.length);
						console.log('解析后的话题数据：', res.result.data.list);

						if (!res.result.data.list || res.result.data.list.length === 0) {
							console.log('云数据库数据量不足，使用本地模拟数据');
							throw new Error('数据量不足');
						}

						this.topicList = res.result.data.list.map(topic => ({
							...topic,
							topicId: topic._id
						}));
					} else {
						uni.showToast({
							title: res.result.message || '加载失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取话题列表失败，使用本地模拟数据：', error);

					const mockTopics = [
						{
							_id: 't1001',
							title: '2025央行降准对普通人有哪些影响？',
							tag: '财经热议',
							hotValue: '89.6万',
							commentCount: 12580,
							likeCount: 86500,
							updateTime: new Date('2025-10-26 18:30').getTime(),
							category: '财经'
						},
						{
							_id: 't1002',
							title: '2025亚运会中国队金牌数创新高',
							tag: '体育热点',
							hotValue: '156.8万',
							commentCount: 28960,
							likeCount: 198700,
							updateTime: new Date('2025-10-26 20:15').getTime(),
							category: '体育'
						},
						{
							_id: 't1003',
							title: '人工智能能否替代人类完成创意工作？',
							tag: '科技讨论',
							hotValue: '123.5万',
							commentCount: 35680,
							likeCount: 156300,
							updateTime: new Date('2025-10-26 19:40').getTime(),
							category: '科技'
						},
						{
							_id: 't1004',
							title: '2025全国两会民生政策解读',
							tag: '时政聚焦',
							hotValue: '210.3万',
							commentCount: 42580,
							likeCount: 289500,
							updateTime: new Date('2025-10-26 17:20').getTime(),
							category: '时政'
						},
						{
							_id: 't1005',
							title: '某顶流明星疑似塌房，工作室紧急回应',
							tag: '娱乐八卦',
							hotValue: '358.9万',
							commentCount: 89650,
							likeCount: 458200,
							updateTime: new Date('2025-10-26 21:05').getTime(),
							category: '娱乐'
						},
						{
							_id: 't1006',
							title: '多地出台租房新规，保障租客权益',
							tag: '民生关注',
							hotValue: '98.7万',
							commentCount: 18560,
							likeCount: 96800,
							updateTime: new Date('2025-10-26 16:45').getTime(),
							category: '民生'
						}
					];

					this.topicList = mockTopics.map(topic => ({
						...topic,
						topicId: topic._id
					}));
				} finally {
					this.loading = false;
				}
			},
			handleTabClick(index) {
				if (this.currentTab !== index) {
					this.currentTab = index;
					this.searchKeyword = '';
					this.searchResults = [];
					this.loadTopics();
				}
			},
			async handleSearch() {
				if (!this.searchKeyword.trim()) {
					this.searchResults = [];
					return;
				}

				this.loading = true;

				try {
					const res = await uniCloud.callFunction({
						name: 'topic-getList',
						data: {
							keyword: this.searchKeyword.trim(),
							page: 1,
							pageSize: 20
						}
					});

					console.log('搜索云函数返回结果：', res.result);

					if (res.result.code === 200) {
						if (!res.result.data.list || res.result.data.list.length === 0) {
							throw new Error('搜索结果为空');
						}

						this.searchResults = res.result.data.list.map(topic => ({
							...topic,
							topicId: topic._id
						}));
					} else {
						uni.showToast({
							title: res.result.message || '搜索失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('搜索话题失败，使用本地过滤：', error);

					const keyword = this.searchKeyword.trim().toLowerCase();

					this.searchResults = this.topicList.filter(topic =>
						topic.title.toLowerCase().includes(keyword) ||
						topic.tag.toLowerCase().includes(keyword)
					);
				} finally {
					this.loading = false;
				}
			},
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hour = String(date.getHours()).padStart(2, '0');
				const minute = String(date.getMinutes()).padStart(2, '0');
				return `${year}-${month}-${day} ${hour}:${minute}`;
			},
			async loadTopicVideos(topic) {
				this.currentTopic = topic;
				this.loadingMore = true;

				try {
					const res = await uniCloud.callFunction({
						name: 'topic-getVideoList',
						data: {
							topicId: topic.topicId || topic._id,
							page: 1,
							pageSize: 10
						}
					});

					console.log('话题视频云函数返回结果：', res.result);

					if (res.result.code === 200) {
						if (!res.result.data.list || res.result.data.list.length === 0) {
							throw new Error('视频数据为空');
						}
						this.topicVideos = res.result.data.list;
					} else {
						uni.showToast({
							title: res.result.message,
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取话题视频失败，使用本地模拟数据：', error);

					const mockVideos = [
						{
							_id: 'v1001',
							vid: 'v1001',
							title: '话题相关视频1',
							cover: 'https://img.ixintu.com/download/jpg/202308/15/64dc482230082.jpg!fd250',
							duration: '05:28',
							playCount: '12.5万'
						},
						{
							_id: 'v1002',
							vid: 'v1002',
							title: '话题相关视频2',
							cover: 'https://img.ixintu.com/download/jpg/202308/15/64dc482230082.jpg!fd250',
							duration: '08:15',
							playCount: '89.8万'
						}
					];

					this.topicVideos = mockVideos;
				} finally {
					this.loadingMore = false;
				}
			},
			playVideo(video) {
				this.currentVideo = video;
				this.showPlayer = true;
				uni.hideTabBar();
			},
			closePlayer() {
				this.showPlayer = false;
				this.currentVideo = {};
				uni.showTabBar();
			},
			onPullDownRefresh() {
				this.loadTopics(true);
			}
		},
		onLoad() {
			this.loadTopics();
		},
		onHide() {
			// TabBar页面不支持 hideTabBarRedDot，注释掉
			// uni.hideTabBarRedDot({
			// 	index: 2
			// });
		}
	};
</script>

<style scoped>
	.topic-container {
		background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
		min-height: 100vh;
	}

	.search-bar {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background: #fff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.search-input {
		flex: 1;
		height: 70rpx;
		background: #f5f5f5;
		border-radius: 35rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
	}

	.search-btn {
		margin-left: 20rpx;
		font-size: 32rpx;
		padding: 10rpx;
	}

	.loading-tip {
		text-align: center;
		padding: 40rpx;
		color: #999;
		font-size: 28rpx;
	}

	.topic-scroll {
		height: calc(100vh - 200rpx);
		padding: 0 20rpx 20rpx;
	}

	.update-tip {
		background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		padding: 16rpx 24rpx;
		border-radius: 16rpx;
		margin: 0 20rpx 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.25);
		animation: slideDown 0.4s ease;
		font-weight: 500;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-30rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.topic-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.topic-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.topic-card:active {
		transform: translateY(-2rpx);
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	}

	.topic-tag {
		display: inline-block;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		color: #fff;
		font-size: 22rpx;
		margin-bottom: 16rpx;
		font-weight: 500;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
	}

	.topic-title {
		font-size: 32rpx;
		color: #2c3e50;
		font-weight: 600;
		line-height: 1.4;
		margin-bottom: 16rpx;
	}

	.topic-stats {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 12rpx;
		gap: 16rpx;
	}

	.stat-item {
		font-size: 22rpx;
		color: #666;
		display: flex;
		align-items: center;
	}

	.topic-time {
		font-size: 20rpx;
		color: #999;
		text-align: right;
	}

	.topic-video-section {
		margin-top: 30rpx;
		padding: 0 10rpx;
	}

	.section-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.video-count {
		font-size: 24rpx;
		color: #999;
		font-weight: normal;
		margin-left: 10rpx;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.video-card {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
	}

	.video-card:active {
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	}

	.video-cover {
		width: 100%;
		height: 220rpx;
	}

	.video-meta {
		position: relative;
		top: -30rpx;
		padding: 0 15rpx;
		display: flex;
		justify-content: space-between;
	}

	.duration,
	.play-count {
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 18rpx;
		padding: 2rpx 6rpx;
		border-radius: 4rpx;
	}

	.video-title {
		font-size: 24rpx;
		color: #333;
		padding: 0 15rpx 15rpx;
	}

	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}

	.video-player-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.video-player {
		width: 90%;
		height: 500rpx;
		border-radius: 12rpx;
	}
</style>