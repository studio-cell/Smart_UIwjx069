<template>
	<view class="cardstyle" :style="{'background-color': bgColor}">
		<!-- 标题+图片区域（根据mode显示不同布局） -->
		<view class="title-image-container">
			<!-- 单图新闻（mode=2）：图片在标题左侧 -->
			<view class="imgbox" v-if="mode === 2">
				<image :src="showImage" mode="aspectFill" @error="handleImageError(0)"></image>
			</view>

			<!-- 新闻标题（不同mode显示不同样式） -->
			<view class="title-wrap">
				<text v-if="mode === 3" style="color: #aaa;">{{ title }}</text>
				<text v-else class="title-text">{{ title }}</text>
			</view>
		</view>

		<!-- 多图广告区域（mode=3） -->
		<view class="ad-image-box" v-if="mode === 3">
			<image v-for="(img, idx) in images" :key="idx" :src="img" mode="aspectFill" @error="handleImageError(idx)">
			</image>
		</view>

		<!-- 标签区：置顶、广告标识、来源、评论、时间 -->
		<view class="tipsbox">
			<text class="top-tag" v-if="isTop && mode !== 3">置顶</text>
			<text class="ad-tag" v-if="mode === 3">广告</text>
			<text class="author" :style="authorColor">{{ author }}</text>
			<text class="comment" v-if="mode !== 3">{{ comments }}评</text>
			<view class="time-wrap">
				<text class="time">{{ time }}</text>
			</view>
		</view>

		<!-- 具名插槽：底部搜索框（仅showSearch为true时显示） -->
		<slot name="tips" v-if="showSearch"></slot>
	</view>
</template>

<script>
	export default {
		name: "NewsView", // 组件名与文件名一致
		data() {
			return {
				defaultPic: "/static/logo.png", // 图片加载失败时的默认图
				status: "news" // 状态：news-新闻，ad-广告
			};
		},
		computed: {
			// 计算属性：处理单图新闻的图片（容错）
			showImage() {
				if (this.mode === 2) {
					// 有图片则用图片，无则用默认图
					return this.images[0] || this.defaultPic;
				}
				return "";
			},
			// 计算属性：控制作者文字颜色（新闻/广告区分）
			authorColor() {
				const colorMap = {
					news: "#888",
					ad: "#00f"
				};
				return {
					color: colorMap[this.status] || "#888"
				};
			}
		},
		mounted() {
			// 组件挂载后，若为广告模式（mode=3），更新状态
			if (this.mode === 3) {
				this.status = "ad";
			}
		},
		methods: {
			// 图片加载失败处理：替换为默认图
			handleImageError(index) {
				console.log(`图片加载失败：${this.title}`);
				// 用$set更新数组，确保响应式
				this.$set(this.images, index, this.defaultPic);
			}
		},
		props: {
			nid: { // 新闻唯一ID（必填）
				type: String,
				required: true,
				default: "000"
			},
			title: { // 标题
				type: String,
				required: true,
				default: "默认标题"
			},
			isTop: { // 是否置顶（仅新闻模式生效）
				type: Boolean,
				required: true,
				default: false
			},
			author: { // 来源/广告商
				type: String,
				required: true,
				default: "未知来源"
			},
			comments: { // 评论数（仅新闻模式生效）
				type: Number,
				required: true,
				default: 0
			},
			time: { // 发布时间
				type: String,
				required: true,
				default: "2025.10.01"
			},
			mode: { // 显示模式：1-纯文字新闻，2-单图新闻，3-多图广告
				type: Number,
				required: true,
				default: 1
			},
			images: { // 图片数组（单图/多图共用）
				type: Array,
				required: false,
				default: () => []
			},
			showSearch: { // 是否显示底部搜索框
				type: Boolean,
				required: false,
				default: false
			},
			bgColor: { // 卡片背景色（动态配置）
				type: String,
				required: false,
				default: "#fff"
			}
		}
	};
</script>

<style scoped>
	/* 卡片整体样式 */
	.cardstyle {
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		padding: 24rpx;
		margin-bottom: 20rpx;
	}

	/* 标题+图片容器（同行布局） */
	.title-image-container {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		gap: 16rpx;
	}

	/* 单图新闻的图片容器 */
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

	/* 标题容器 */
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

	/* 多图广告的图片容器 */
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

	/* 标签区样式 */
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

	/* 插槽（搜索框）样式 */
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