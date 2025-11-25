<template>
	<view class="video-card">
		<view class="video-cover">
			<image :src="cover" mode="aspectFill" class="cover-img"></image>
			<text class="video-duration">{{ duration }}</text>
		</view>
		<view class="video-info">
			<text class="video-title">{{ title }}</text>
			<view class="video-footer">
				<text class="video-author">{{ author }}</text>
				<text class="video-playcount">{{ playCount }}次播放</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "VideoCard",
		props: {
			cover: {
				type: String,
				required: true
			},
			title: {
				type: String,
				required: true
			},
			author: {
				type: String,
				required: true
			},
			duration: {
				type: String,
				required: true
			},
			playCount: {
				type: Number,
				required: true
			}
		}
	};
</script>

<style scoped>
	.video-card {
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		margin-bottom: 20rpx;
	}

	.video-cover {
		position: relative;
	}

	.cover-img {
		width: 100%;
		height: 300rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 12rpx;
		right: 12rpx;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
	}

	.video-info {
		padding: 16rpx;
	}

	.video-title {
		font-size: 26rpx;
		color: #1a1a1a;
		line-height: 36rpx;
		margin-bottom: 12rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.video-footer {
		display: flex;
		justify-content: space-between;
		font-size: 2