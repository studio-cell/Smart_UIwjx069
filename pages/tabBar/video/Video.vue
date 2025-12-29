<template>
	<view class="video-container">
		<TabBanner :list="videoCategories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<scroll-view scroll-y class="video-scroll" refresher-enabled :refresher-threshold="100"
			:refresher-triggered="refreshing" @refresherrefresh="onPullDownRefresh">
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条视频内容</view>

			<view class="video-list">
				<view class="video-card" v-for="(video, index) in filteredVideos" :key="video.vid"
					@click="playVideo(video)">
					<image class="video-cover" :src="video.cover" mode="aspectFill"></image>
					<view class="video-meta">
						<text class="duration">{{ video.duration }}</text>
						<text class="play-count">{{ video.playCount }}次播放</text>
					</view>
					<view class="video-title">{{ video.title }}</view>
					<view class="video-author">
						<image class="author-avatar" :src="video.authorAvatar || '/static/avatar_default.png'"
							mode="circle"></image>
						<text class="author-name">{{ video.author }}</text>
					</view>
					<view class="video-actions" @click.stop>
						<view class="action-item" @click="toggleLike(video)">
							<text class="action-icon" :style="{ color: video.isLiked ? '#d00' : '#999' }">❤️</text>
							<text class="action-text">{{ video.likeCount || 0 }}</text>
						</view>
						<view class="action-item" @click="toggleCollect(video)">
							<text class="action-icon"
								:style="{ color: video.isCollected ? '#ff9500' : '#999' }">⭐</text>
							<text class="action-text">{{ video.collectCount || 0 }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="filteredVideos.length === 0" class="empty-tip">暂无该分类的视频内容</view>
		</scroll-view>

		<view v-if="showPlayer" class="video-player-mask" @click="closePlayer">
			<video class="video-player" :src="currentVideo.url" :controls="true" :autoplay="true" @ended="closePlayer"
				@click.stop></video>
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
				videoCategories: ['推荐', '时政', '财经', '娱乐', '体育', '科技'],
				videoList: [{
						vid: 'v1001',
						title: '央行降准政策解读：对实体经济有哪些影响？',
						cover: '/static/video/finance1.jpg',
						url: 'https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4',
						duration: '05:28',
						playCount: '12.5万',
						author: '财经观察室',
						authorAvatar: '/static/avatar/finance.png',
						category: '财经',
						likeCount: 1256,
						collectCount: 890,
						isLiked: false,
						isCollected: false
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
						category: '体育',
						likeCount: 8950,
						collectCount: 5620,
						isLiked: false,
						isCollected: false
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
						category: '科技',
						likeCount: 3580,
						collectCount: 2150,
						isLiked: false,
						isCollected: false
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
						category: '时政',
						likeCount: 6890,
						collectCount: 4210,
						isLiked: false,
						isCollected: false
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
						category: '娱乐',
						likeCount: 9870,
						collectCount: 6540,
						isLiked: false,
						isCollected: false
					}
				],
				currentTab: 0,
				showUpdateTip: false,
				updateCount: 0,
				showPlayer: false,
				currentVideo: {},
				refreshing: false // 新增：scroll-view刷新状态控制
			};
		},
		computed: {
			filteredVideos() {
				const category = this.videoCategories[this.currentTab];
				return category === "推荐" ?
					this.videoList :
					this.videoList.filter(video => video.category === category);
			}
		},
		methods: {
			handleTabClick(index) {
				this.currentTab = index;
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
				// 开启刷新状态
				this.refreshing = true;

				setTimeout(() => {
					const newVideos = [{
							vid: `v_new_${Date.now()}_1`,
							title: "最新：新能源汽车补贴政策调整解读",
							cover: "/static/video/finance_new.jpg",
							url: "https://vd3.bdstatic.com/mda-ni63n3f8f82c8f8g/cae_h264/171478900059041070/mda-ni63n3f8f82c8f8g.mp4",
							duration: "04:35",
							playCount: "8.2万",
							author: "财经观察室",
							authorAvatar: "/static/avatar/finance.png",
							category: "财经",
							likeCount: 1200,
							collectCount: 850,
							isLiked: false,
							isCollected: false
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
							category: "科技",
							likeCount: 2800,
							collectCount: 1500,
							isLiked: false,
							isCollected: false
						}
					];

					// 更新视频列表
					this.videoList = [...newVideos, ...this.videoList];
					this.updateCount = newVideos.length;
					this.showUpdateTip = true;

					// 停止刷新（使用scroll-view的刷新控制）
					this.refreshing = false;

					setTimeout(() => {
						this.showUpdateTip = false;
					}, 3000);

					// 显示红点提示
					uni.showTabBarRedDot({
						index: 1
					});
				}, 1500);
			},
			async toggleLike(video) {
				const userId = uni.getStorageSync('userInfo').userId;
				if (!userId) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: 'video-like',
						data: {
							videoId: video.vid,
							userId,
							isCancel: video.isLiked
						}
					});

					if (res.result.code === 200) {
						const idx = this.videoList.findIndex(v => v.vid === video.vid);
						if (idx > -1) {
							this.videoList[idx].isLiked = !video.isLiked;
							this.videoList[idx].likeCount = video.isLiked ? Math.max(0, video.likeCount - 1) : (video
								.likeCount || 0) + 1;
						}
					}
				} catch (error) {
					console.error('点赞失败：', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			},
			async toggleCollect(video) {
				const userId = uni.getStorageSync('userInfo').userId;
				if (!userId) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}

				try {
					const res = await uniCloud.callFunction({
						name: 'video-collect',
						data: {
							videoId: video.vid,
							userId,
							isCancel: video.isCollected
						}
					});

					if (res.result.code === 200) {
						const idx = this.videoList.findIndex(v => v.vid === video.vid);
						if (idx > -1) {
							this.videoList[idx].isCollected = !video.isCollected;
							this.videoList[idx].collectCount = video.isCollected ? Math.max(0, video.collectCount -
								1) : (video.collectCount || 0) + 1;
						}
					}
				} catch (error) {
					console.error('收藏失败：', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			}
		},
		onHide() {
			uni.hideTabBarRedDot({
				index: 1
			});
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

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.video-card {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.video-cover {
		width: 100%;
		height: 300rpx;
	}

	.video-meta {
		position: relative;
		top: -40rpx;
		padding: 0 15rpx;
		display: flex;
		justify-content: space-between;
	}

	.duration,
	.play-count {
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
	}

	.video-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		padding: 0 15rpx 10rpx;
		line-height: 1.4;
	}

	.video-author {
		display: flex;
		align-items: center;
		padding: 0 15rpx 10rpx;
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

	.video-actions {
		display: flex;
		justify-content: flex-end;
		padding: 10rpx 15rpx 15rpx;
		gap: 30rpx;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.action-icon {
		font-size: 24rpx;
	}

	.action-text {
		font-size: 22rpx;
		color: #666;
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
		height: calc(90vw * 9 / 16);
		/* 修改：自适应高度，保持16:9比例 */
		border-radius: 12rpx;
	}
</style>