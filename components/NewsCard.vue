<template>
	<view class="news-card" @click="$emit('card-click', nid)">
		<!-- 新闻封面图 -->
		<image :src="cover" mode="aspectFill" class="card-cover"></image>
		<!-- 新闻内容 -->
		<view class="card-content">
			<text class="top-tag" v-if="isTop">置顶</text>
			<text class="card-title">{{ title }}</text>
			<text class="card-summary">{{ summary }}</text>
			<view class="card-footer">
				<text class="card-author">{{ author }}</text>
				<text class="card-time">{{ time }}</text>
				<text class="card-comments">{{ comments }}评</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "NewsCard",
		props: {
			nid: {
				type: String,
				required: true
			},
			title: {
				type: String,
				required: true
			},
			cover: {
				type: String,
				required: true
			},
			summary: {
				type: String,
				required: true
			},
			author: {
				type: String,
				required: true
			},
			time: {
				type: String,
				required: true
			},
			comments: {
				type: Number,
				required: true
			},
			isTop: {
				type: Boolean,
				required: true,
				default: false
			}
		}
	};
</script>

<style scoped>
	.news-card {
		display: flex;
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		margin-bottom: 20rpx;
	}

	.card-cover {
		width: 200rpx;
		height: 160rpx;
		flex-shrink: 0;
	}

	.card-content {
		flex: 1;
		padding: 16rpx;
		position: relative;
	}

	.top-tag {
		position: absolute;
		top: 16rpx;
		left: 16rpx;
		background: #d00;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		z-index: 1;
	}

	.card-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 40rpx;
		margin-bottom: 8rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		padding-left: 80rpx;
		/* 给置顶标签留空间 */
	}

	.card-summary {
		font-size: 22rpx;
		color: #666;
		line-height: 32rpx;
		margin-bottom: 12rpx;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		display: flex;
		align-items: center;
		font-size: 20rpx;
		color: #999;
		justify-content: space-between;
	}
</style>