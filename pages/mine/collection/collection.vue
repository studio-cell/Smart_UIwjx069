<template>
	<view class="collection-container">
		<view class="page-title">我的收藏</view>
		<!-- 空状态 -->
		<view v-if="collectionList.length === 0" class="empty-container">
			<text class="empty-text">暂无收藏内容</text>
		</view>
		<!-- 收藏列表 -->
		<view v-else class="collection-list">
			<view class="collection-item" v-for="(item, index) in collectionList" :key="index"
				@click="goToNewsDetail(item.newsId)">
				<image :src="item.newsInfo.cover || '/static/default.png'" class="item-cover"></image>
				<view class="item-content">
					<text class="item-title">{{ item.newsInfo.title }}</text>
					<text class="item-time">收藏时间：{{ formatTime(item.collectTime) }}</text>
				</view>
				<!-- 取消收藏按钮 -->
				<view class="delete-btn" @click.stop="cancelCollection(item._id)">
					<text>取消</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectionList: [],
				userId: ''
			};
		},
		onLoad() {
			// 获取登录用户ID
			const user = uni.getStorageSync("userInfo");
			if (user && user.userId) {
				this.userId = user.userId;
				this.getCollectionList();
			} else {
				uni.showToast({
					title: "请先登录",
					icon: "none"
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			}
		},
		methods: {
			// 获取收藏列表
			async getCollectionList() {
				uni.showLoading({
					title: "加载中"
				});
				try {
					const res = await uniCloud.callFunction({
						name: "collection-getList",
						data: {
							userId: this.userId,
							page: 1,
							pageSize: 20
						}
					});
					if (res.result.code === 200) {
						this.collectionList = res.result.data.list;
					}
				} catch (error) {
					console.error("获取收藏失败：", error);
					uni.showToast({
						title: "加载失败",
						icon: "none"
					});
				} finally {
					uni.hideLoading();
				}
			},
			// 取消收藏
			async cancelCollection(collectionId) {
				uni.showModal({
					title: "提示",
					content: "确定取消收藏吗？",
					success: async (res) => {
						if (res.confirm) {
							try {
								const res = await uniCloud.callFunction({
									name: "collection-remove",
									data: {
										userId: this.userId,
										collectionId: collectionId
									}
								});
								if (res.result.code === 200) {
									uni.showToast({
										title: "取消成功"
									});
									this.getCollectionList(); // 刷新列表
								}
							} catch (error) {
								console.error("取消收藏失败：", error);
								uni.showToast({
									title: "操作失败",
									icon: "none"
								});
							}
						}
					}
				});
			},
			// 跳转到新闻详情
			goToNewsDetail(newsId) {
				uni.navigateTo({
					url: `/pages/news/detail/detail?newsId=${newsId}`
				});
			},
			// 格式化时间
			formatTime(time) {
				if (!time) return "";
				const date = new Date(time);
				return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
			}
		}
	};
</script>

<style scoped>
	.collection-container {
		padding: 20rpx;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.page-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.empty-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.collection-list {
		background-color: #fff;
		border-radius: 12rpx;
	}

	.collection-item {
		display: flex;
		padding: 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.item-cover {
		width: 120rpx;
		height: 100rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item-title {
		font-size: 26rpx;
		color: #333;
		line-height: 1.4;
	}

	.item-time {
		font-size: 20rpx;
		color: #999;
	}

	.delete-btn {
		width: 80rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		background-color: #f5f5f5;
		color: #d00;
		border-radius: 20rpx;
		font-size: 22rpx;
		align-self: center;
	}
</style>