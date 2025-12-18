<template>
	<view class="topic-detail-container">
		<!-- 话题头部 -->
		<view class="topic-header">
			<view class="topic-tag" :style="{ backgroundColor: '#e53935' }">财经热议</view>
			<view class="topic-title">2025央行降准对普通人有哪些影响？</view>
			<view class="topic-stats">🔥 89.6万热度 | 💬 12580条评论 | ❤️ 86500人关注</view>
		</view>

		<!-- 评论区（占位） -->
		<view class="comment-title">热门评论</view>
		<view class="comment-list">
			<!-- 评论项占位 -->
			<view class="comment-item">
				<image class="user-avatar" src="/static/avatar_default.png" mode="circle"></image>
				<view class="comment-content">
					<text class="user-name">网友123456</text>
					<text class="comment-text">降准后房贷利率会不会降？求解答！</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			console.log('当前话题ID：', options.tid);
			// 可调用云函数获取话题详情
		}
	};
</script>

<style scoped>
	/* 基础样式（可根据需求完善） */
	.topic-detail-container {
		padding: 20rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.topic-header {
		background: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.topic-tag {
		display: inline-block;
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		color: #fff;
		font-size: 20rpx;
		margin-bottom: 15rpx;
	}

	.topic-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.topic-stats {
		font-size: 22rpx;
		color: #666;
	}

	.comment-title {
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 15rpx;
	}

	.comment-list {
		background: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
	}

	.comment-item {
		display: flex;
		margin-bottom: 20rpx;
	}

	.user-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}

	.user-name {
		font-size: 24rpx;
		font-weight: 500;
		margin-bottom: 5rpx;
		display: block;
	}

	.comment-text {
		font-size: 26rpx;
		color: #333;
		line-height: 1.4;
	}
</style>