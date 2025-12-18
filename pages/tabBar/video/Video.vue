<template>
	<view class="video-container">
		<!-- 顶部分类导航（和新闻页TabBanner组件复用） -->
		<TabBanner :list="videoCategories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<!-- 下拉刷新容器 -->
		<scroll-view scroll-y class="video-scroll" @scrolltoupper="onPullDownRefresh" refresher-enabled
			:refresher-threshold="100">
			<!-- 数据更新提醒（3秒后自动消失） -->
			<view v-if="showUpdateTip" class="update-tip">
				为您更新了{{ updateCount }}条视频内容
			</view>

			<!-- 视频列表 -->
			<view class="video-list">
				<view class="video-card" v-for="(video, index) in filteredVideos" :key="video.vid"
					@click="playVideo(video)">
					<!-- 视频封面 -->
					<image class="video-cover" :src="video.cover" mode="aspectFill"></image>
					<!-- 播放时长/播放量 -->
					<view class="video-meta">
						<text class="duration">{{ video.duration }}</text>
						<text class="play-count">{{ video.playCount }}次播放</text>
					</view>
					<!-- 视频标题 -->
					<view class="video-title">{{ video.title }}</view>
					<!-- 作者信息 -->
					<view class="video-author">
						<image class="author-avatar" :src="video.authorAvatar || '/static/avatar_default.png'"
							mode="circle"></image>
						<text class="author-name">{{ video.author }}</text>
					</view>
				</view>
			</view>

			<!-- 空数据提示 -->
			<view v-if="filteredVideos.length === 0" class="empty-tip">
				暂无该分类的视频内容
			</view>
		</scroll-view>

		<!-- 视频播放弹窗（点击视频后显示） -->
		<view v-if="showPlayer" class="video-player-mask" @click="closePlayer">
			<video class="video-player" :src="currentVideo.url" :controls="true" :autoplay="true"
				@ended="closePlayer"></video>
		</view>
	</view>
</template>

<script>
	// 复用新闻页的TabBanner组件
	import TabBanner from "@/components/TabBanner.vue";

	export default {
		components: {
			TabBanner
		},
		data() {
			return {
				// 视频分类（和新闻分类结构一致）
				videoCategories: ['推荐', '时政', '财经', '娱乐', '体育', '科技'],
				// 视频列表数据（模拟真实业务数据结构）
				videoList: [{
						vid: 'v1001',
						title: '央行降准政策解读：对实体经济有哪些影响？',
						cover: '/static/video/finance1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '05:28',
						playCount: '12.5万',
						author: '财经观察室',
						authorAvatar: '/static/avatar/finance.png',
						category: '财经'
					},
					{
						vid: 'v1002',
						title: '2025亚运会中国队夺冠瞬间合集',
						cover: '/static/video/sports1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '08:15',
						playCount: '89.8万',
						author: '体育前线',
						authorAvatar: '/static/avatar/sports.png',
						category: '体育'
					},
					{
						vid: 'v1003',
						title: '最新科技发布会：人工智能新品亮相',
						cover: '/static/video/tech1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '12:40',
						playCount: '56.3万',
						author: '科技前沿',
						authorAvatar: '/static/avatar/tech.png',
						category: '科技'
					},
					{
						vid: 'v1004',
						title: '2025全国两会重点内容解读',
						cover: '/static/video/politics1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '06:50',
						playCount: '78.2万',
						author: '时政新闻',
						authorAvatar: '/static/avatar/politics.png',
						category: '时政'
					},
					{
						vid: 'v1005',
						title: '热门电影幕后花絮：导演独家专访',
						cover: '/static/video/ent1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '09:12',
						playCount: '102.4万',
						author: '娱乐星探',
						authorAvatar: '/static/avatar/ent.png',
						category: '娱乐'
					}
				],
				currentTab: 0, // 当前选中的分类下标
				showUpdateTip: false, // 是否显示更新提醒
				updateCount: 0, // 更新的视频数量
				showPlayer: false, // 是否显示视频播放器
				currentVideo: {} // 当前播放的视频信息
			};
		},
		computed: {
			// 根据选中的分类过滤视频列表
			filteredVideos() {
				const category = this.videoCategories[this.currentTab];
				return category === "推荐" ?
					this.videoList :
					this.videoList.filter(video => video.category === category);
			}
		},
		methods: {
			// 切换分类
			handleTabClick(index) {
				this.currentTab = index;
			},
			// 播放视频（弹出播放弹窗）
			playVideo(video) {
				this.currentVideo = video;
				this.showPlayer = true;
				// 隐藏TabBar，提升播放体验
				uni.hideTabBar();
			},
			// 关闭视频播放器
			closePlayer() {
				this.showPlayer = false;
				this.currentVideo = {};
				// 显示TabBar
				uni.showTabBar();
			},
			// 下拉刷新加载新视频
			onPullDownRefresh() {
				// 模拟请求新视频数据（实际项目对接后端接口）
				setTimeout(() => {
					// 模拟新增2条视频（拼接到数组前面）
					const newVideos = [{
							vid: `v_new_${Date.now()}_1`,
							title: "最新：新能源汽车补贴政策调整解读",
							cover: "/static/video/finance_new.jpg",
							url: "https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4",
							duration: "04:35",
							playCount: "8.2万",
							author: "财经观察室",
							authorAvatar: "/static/avatar/finance.png",
							category: "财经"
						},
						{
							vid: `v_new_${Date.now()}_2`,
							title: "人工智能最新突破：可自主学习的AI模型发布",
							cover: "/static/video/tech_new.jpg",
							url: "https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4",
							duration: "10:18",
							playCount: "32.7万",
							author: "科技前沿",
							authorAvatar: "/static/avatar/tech.png",
							category: "科技"
						}
					];

					// 更新视频列表（新增数据在前）
					this.videoList = [...newVideos, ...this.videoList];
					this.updateCount = newVideos.length;
					this.showUpdateTip = true; // 显示更新提醒

					// 停止下拉刷新动画
					uni.stopPullDownRefresh();

					// 3秒后隐藏更新提醒
					setTimeout(() => {
						this.showUpdateTip = false;
					}, 3000);

					// 显示TabBar红点提示
					uni.showTabBarRedDot({
						index: 1
					}); // 视频Tab（第2项）显示红点
				}, 1500);
			}
		},
		onHide() {
			// 页面隐藏时，隐藏TabBar红点
			uni.hideTabBarRedDot({
				index: 1
			});
			// 关闭视频播放器
			this.closePlayer();
		}
	};
</script>

<style scoped>
	.video-container {
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.video-scroll {
		height: calc(100vh - 120rpx);
		padding: 20rpx;
	}

	/* 数据更新提醒样式（和新闻页保持一致） */
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

	/* 视频列表样式 */
	.video-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 视频卡片样式 */
	.video-card {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	/* 视频封面 */
	.video-cover {
		width: 100%;
		height: 300rpx;
	}

	/* 视频元信息（时长/播放量） */
	.video-meta {
		position: relative;
		top: -40rpx;
		padding: 0 15rpx;
		display: flex;
		justify-content: space-between;
	}

	.duration {
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
	}

	.play-count {
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
	}

	/* 视频标题 */
	.video-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		padding: 0 15rpx 10rpx;
		line-height: 1.4;
	}

	/* 作者信息 */
	.video-author {
		display: flex;
		align-items: center;
		padding: 0 15rpx 15rpx;
	}

	.author-avatar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.author-name {
		font-size: 24rpx;
		color: #999;
	}

	/* 空数据提示 */
	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}

	/* 视频播放弹窗遮罩 */
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

	/* 视频播放器 */
	.video-player {
		width: 90%;
		height: 500rpx;
		border-radius: 12rpx;
	}
</style>