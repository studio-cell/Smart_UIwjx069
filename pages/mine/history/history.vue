<template>
	<view class="history-container">
		<view class="page-title">浏览历史</view>
		<!-- 空状态 -->
		<view v-if="historyList.length === 0" class="empty-container">
			<text class="empty-text">暂无浏览历史</text>
		</view>
		<!-- 历史列表 -->
		<view v-else class="history-list">
			<view class="history-item" v-for="(item, index) in historyList" :key="index"
				@click="goToNewsDetail(item.newsId)">
				<image :src="item.cover || '/static/default.png'" class="item-cover"></image>
				<view class="item-content">
					<text class="item-title">{{ item.title }}</text>
					<text class="item-time">浏览时间：{{ formatTime(item.viewTime) }}</text>
				</view>
				<!-- 删除单条历史 -->
				<view class="delete-btn" @click.stop="deleteHistory(index)">
					<text>删除</text>
				</view>
			</view>
			<!-- 清空全部 -->
			<view class="clear-all" @click="clearAllHistory">
				<text>清空全部历史</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				historyList: []
			};
		},
		onLoad() {
			// 从本地存储读取浏览历史
			this.historyList = uni.getStorageSync("newsHistory") || [];
		},
		methods: {
			// 跳转到新闻详情
			goToNewsDetail(newsId) {
				uni.navigateTo({
					url: `/pages/news/detail/detail?newsId=${newsId}`
				});
			},
			// 删除单条历史
			deleteHistory(index) {
				this.historyList.splice(index, 1);
				uni.setStorageSync("newsHistory", this.historyList);
				uni.showToast({
					title: "删除成功"
				});
			},
			// 清空全部历史
			clearAllHistory() {
				uni.showModal({
					title: "提示",
					content: "确定清空所有浏览历史吗？",
					success: (res) => {
						if (res.confirm) {
							this.historyList = [];
							uni.removeStorageSync("newsHistory");
							uni.showToast({
								title: "已清空"
							});
						}
					}
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
	/* 样式和收藏页基本一致，仅修改类名 */
	.history-container {
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

	.history-list {
		background-color: #fff;
		border-radius: 12rpx;
	}

	.history-item {
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

	.clear-all {
		padding: 20rpx;
		text-align: center;
		font-size: 26rpx;
		color: #d00;
	}
</style>