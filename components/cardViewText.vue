<template>
	<view class="cardstyle">
		<!-- 只保留动态标题（通过props传递的title），删除多余固定文本 -->
		<text class="titlebox" @click.stop="$emit('title-click', nid)">{{ title }}</text>

		<!-- 标签区：置顶、来源、评论、时间 -->
		<view class="tipsbox">
			<text class="top-tag" v-if="isTop">置顶</text>
			<text class="source">{{ author }}</text>
			<text class="comment">{{ comments }}评</text>
			<view class="time-wrap">
				<text class="time">{{ time }}</text>
			</view>
		</view>

		<!-- 具名插槽：底部搜索框 -->
		<slot name="search-box"></slot>
	</view>
</template>

<script>
	export default {
		name: "cardViewText",
		props: {
			nid: {
				type: String,
				required: true
			},
			title: {
				type: String,
				required: true,
				default: "乘势而上，续写中国奇迹新篇章--党的二十届四中全会侧记" // 修正“二十界”为“二十届”
			},
			isTop: {
				type: Boolean,
				required: true,
				default: false
			},
			author: {
				type: String,
				required: true,
				default: "新华社"
			},
			comments: {
				type: Number,
				required: true,
				default: 0
			},
			time: {
				type: String,
				required: true,
				default: "2025.10.25"
			},
			showSearch: {
				type: Boolean,
				required: false,
				default: false
			}
		}
	};
</script>

<style scoped>
	.cardstyle {
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		padding: 24rpx;
		margin-bottom: 20rpx;
	}

	.titlebox {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 48rpx;
		display: block;
		margin-bottom: 16rpx;
	}

	.tipsbox {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #888;
		gap: 20rpx;
	}

	.top-tag {
		background-color: #f00;
		color: #fff !important;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		font-size: 22rpx;
	}

	.time-wrap {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	/* 插槽样式 */
	::v-deep .search-box {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #eee;
	}

	::v-deep .search-label {
		font-size: 24rpx;
		color: #666;
		margin-right: 12rpx;
	}

	::v-deep .search-tag {
		display: inline-block;
		padding: 8rpx 16rpx;
		background-color: #f5f5f5;
		border-radius: 20rpx;
		margin-right: 12rpx;
		margin-bottom: 12rpx;
		font-size: 22rpx;
		color: #666;
	}
</style>