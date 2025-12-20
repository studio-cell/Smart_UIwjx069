<template>
	<view class="collection-container">
		<view class="page-title">我的收藏</view>
		<!-- 空状态 -->
		<view v-if="collectionList.length === 0" class="empty-container">
			<text class="empty-text">暂无收藏内容</text>
		</view>
		<!-- 收藏列表 -->
		<view v-else class="collection-list">
			<!-- 彻底修复：使用item作为循环变量，确保作用域正确 -->
			<view class="collection-item" v-for="(item, index) in collectionList" :key="index"
				@click="goToNewsDetail(item.newsId)">

				<!-- 多层判空 + 默认图兜底 -->
				<image :src="item?.newsInfo?.cover || 'https://picsum.photos/120/100'" class="item-cover"
					@error="handleCoverError(index)" v-if="item?.newsInfo">
				</image>

				<view class="item-content" v-if="item?.newsInfo">
					<!-- 标题增加默认值 -->
					<text class="item-title">{{ item.newsInfo.title || '暂无标题' }}</text>
					<text class="item-time">收藏时间：{{ formatTime(item.collectTime) }}</text>
				</view>

				<!-- 取消收藏按钮 -->
				<view class="delete-btn" @click.stop="cancelCollection(item)" v-if="item">
					<text>取消</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Collection",
		data() {
			return {
				collectionList: [],
				userId: ''
			};
		},
		onLoad() {
			// 获取登录用户ID
			const user = uni.getStorageSync("userInfo") || {};
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
			// 封面加载失败兜底
			handleCoverError(index) {
				if (this.collectionList[index] && this.collectionList[index].newsInfo) {
					this.$set(this.collectionList[index].newsInfo, 'cover', 'https://picsum.photos/120/100');
				}
			},

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
					if (res.result && res.result.code === 200) {
						// 过滤掉无效数据
						this.collectionList = res.result.data.list.filter(item => {
							return item && item._id && item.newsId;
						});
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

			// 取消收藏 - 完整修复版
			async cancelCollection(item) {
				// 参数校验
				if (!item || !item._id || !item.newsId || !this.userId) {
					uni.showToast({
						title: "参数错误",
						icon: "none"
					});
					return;
				}

				uni.showModal({
					title: "提示",
					content: "确定取消收藏吗？",
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "取消中..."
							});
							try {
								const res = await uniCloud.callFunction({
									name: "collection-remove",
									data: {
										userId: this.userId,
										newsId: item.newsId
									}
								});

								uni.hideLoading();

								if (res.result && res.result.code === 200) {
									uni.showToast({
										title: "取消成功",
										icon: "success"
									});
									// 本地移除该条数据，避免重新请求
									this.collectionList = this.collectionList.filter(col => col._id !==
										item._id);
								} else {
									uni.showToast({
										title: res.result?.message || "取消失败",
										icon: "none"
									});
								}
							} catch (error) {
								uni.hideLoading();
								console.error("取消收藏失败：", error);
								uni.showToast({
									title: "操作异常",
									icon: "none"
								});
							}
						}
					}
				});
			},

			// 跳转到新闻详情
			goToNewsDetail(newsId) {
				// 增加newsId判空
				if (!newsId) {
					uni.showToast({
						title: "新闻不存在",
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?newsId=${newsId}`
				});
			},

			// 格式化时间
			formatTime(time) {
				if (!time) return "未知时间";
				try {
					const date = new Date(time);
					return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
				} catch (e) {
					return "未知时间";
				}
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
		align-items: center;
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
		justify-content: center;
	}

	.item-title {
		font-size: 26rpx;
		color: #333;
		line-height: 1.4;
		margin-bottom: 8rpx;
		display: block;
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
	}
</style>