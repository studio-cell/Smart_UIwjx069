<template>
	<view class="cardstyle" :style="{'background-color': bgColor}">
		<!-- 标题+图片区域 -->
		<view class="title-image-container">
			<view class="imgbox" v-if="mode === 2">
				<image :src="showImage" mode="aspectFill" @error="handleImageError(0)"></image>
			</view>
			<view class="title-wrap">
				<text v-if="mode === 3" style="color: #aaa;">{{ title }}</text>
				<text v-else class="title-text">{{ title }}</text>
			</view>
		</view>
		<!-- 新闻摘要 -->
		<text v-if="mode !== 3 && summary" class="card-summary">{{ summary }}</text>
		<!-- 多图广告区域 -->
		<view class="ad-image-box" v-if="mode === 3">
			<image v-for="(img, idx) in images" :key="idx" :src="img" mode="aspectFill" @error="handleImageError(idx)">
			</image>
		</view>
		<!-- 标签区 -->
		<view class="tipsbox">
			<text class="top-tag" v-if="isTop && mode !== 3">置顶</text>
			<text class="ad-tag" v-if="mode === 3">广告</text>
			<text class="author" :style="authorColor">{{ author }}</text>
			<text class="comment" v-if="mode !== 3">{{ comments }}评</text>
			<view class="time-wrap">
				<text class="time">{{ time }}</text>
			</view>
		</view>
		<!-- 具名插槽 -->
		<slot name="tips" v-if="showSearch"></slot>
	</view>
</template>

<script>
	export default {
		name: "NewsView",
		emits: ['card-click'], // 声明自定义事件，解决事件绑定问题
		data() {
			return {
				defaultPic: "https://picsum.photos/200/160",
				status: "news"
			};
		},
		computed: {
			showImage() {
				return this.mode === 2 ? (this.images[0] || this.defaultPic) : "";
			},
			authorColor() {
				return {
					color: this.status === 'ad' ? '#00f' : '#888'
				};
			}
		},
		mounted() {
			this.status = this.mode === 3 ? 'ad' : 'news';
		},
		methods: {
			handleImageError(index) {
				this.$set(this.images, index, this.defaultPic);
			}
		},
		props: {
			nid: {
				type: String,
				required: true,
				default: "000"
			},
			title: {
				type: String,
				required: true,
				default: "默认标题"
			},
			isTop: {
				type: Boolean,
				required: true,
				default: false
			},
			author: {
				type: String,
				required: true,
				default: "未知来源"
			},
			comments: {
				type: Number,
				required: true,
				default: 0
			},
			time: {
				type: String,
				required: true,
				default: "2025.10.01"
			},
			mode: {
				type: Number,
				required: true,
				default: 1
			},
			images: {
				type: Array,
				default: () => []
			},
			showSearch: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: "#fff"
			},
			summary: {
				type: String,
				default: ""
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

	.title-image-container {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		gap: 16rpx;
	}

	.imgbox {
		width: 120rpx;
		height: 120rpx;
		overflow: hidden;
		border-radius: 8rpx;
	}

	.imgbox image {
		width: 100%;
		height: 100%;
	}

	.title-wrap {
		flex: 1;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 48rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-summary {
		font-size: 22rpx;
		color: #666;
		line-height: 32rpx;
		margin: 12rpx 0;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.ad-image-box {
		display: flex;
		gap: 8rpx;
		margin-bottom: 16rpx;
	}

	.ad-image-box image {
		flex: 1;
		height: 180rpx;
		border-radius: 8rpx;
	}

	.tipsbox {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #888;
		gap: 20rpx;
		flex-wrap: wrap;
	}

	.top-tag {
		background-color: #f00;
		color: #fff !important;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		font-size: 22rpx;
	}

	.ad-tag {
		background-color: #00f;
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