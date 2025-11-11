<template>
	<view class="api-container">
		<text class="api-title">API 演示页面</text>
		<text class="api-desc">常用 API 功能演示，点击按钮跳转对应页面</text>

		<!-- 按钮容器：网格布局，2列排列 -->
		<view class="btn-grid">
			<!-- 原有跳转按钮 -->
			<navigator url="/pages/APIpages/LogPage/Logpage" class="btn-item">
				<button class="api-btn">打印日志</button>
			</navigator>
			<navigator url="/pages/APIpages/Timepage/Timepage" class="btn-item">
				<button class="api-btn">定时器</button>
			</navigator>
			<navigator url="/pages/APIpages/StoragePage/StoragePage" class="btn-item">
				<button class="api-btn">存储器</button>
			</navigator>

			<!-- 新增：选择图片预览 跳转 -->
			<navigator url="/pages/chooseImagePage/chooseImagePage" class="btn-item">
				<button class="api-btn">选择图片预览</button>
			</navigator>

			<!-- 新增：天气预报 跳转 -->
			<navigator url="/pages/weatherPage/weatherPage" class="btn-item">
				<button class="api-btn">天气预报</button>
			</navigator>

			<!-- 新增：下载网络图片 跳转 -->
			<navigator url="/pages/downloadImagePage/downloadImagePage" class="btn-item">
				<button class="api-btn">下载网络图片</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 可添加 API 演示相关数据
			}
		},
		onLoad() {
			// 页面加载时可调用 API 示例（可选启用）
			// this.fetchData();
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://api.example.com/data',
					success: (res) => {
						console.log('请求结果：', res);
					}
				});
			}
		}
	};
</script>

<style scoped>
	.api-container {
		padding: 20rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.api-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.api-desc {
		color: #666;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-bottom: 30rpx;
		display: block;
	}

	/* 按钮网格布局：2列，均匀分布 */
	.btn-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		/* 2列等宽 */
		gap: 20rpx;
		/* 按钮间距 */
	}

	.btn-item {
		/* 去除 navigator 默认下划线 */
		text-decoration: none;
	}

	/* 统一按钮样式 */
	.api-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-radius: 12rpx;
	}

	/* 可选：给不同功能按钮设置不同颜色，区分样式 */
	.api-btn:nth-child(4) {
		/* 选择图片 */
		background-color: #007aff;
		color: #fff;
	}

	.api-btn:nth-child(5) {
		/* 天气预报 */
		background-color: #09BB07;
		color: #fff;
	}

	.api-btn:nth-child(6) {
		/* 下载图片 */
		background-color: #FF9500;
		color: #fff;
	}
</style>