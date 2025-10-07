<template>
	<view class="tabcom-container">
		<!-- 页面标题 -->
		<view class="page-title">组件说明</view>

		<!-- 1. 容器组件 - view -->
		<view class="component-card">
			<view class="component-title">1. 容器组件 - view</view>
			<view class="component-desc">
				基础容器组件
			</view>
		</view>

		<!-- 2. 基础内容组件 - text -->
		<view class="component-card">
			<view class="component-title">2. 基础内容组件 - text</view>
			<view class="component-desc">
				用于展示文本内容的组件
			</view>
			<view class="component-desc">
				
			</view>
		</view>

		<!-- 3. 表单组件（文字描述） -->
		<view class="component-card">
			<view class="component-title">3. 表单组件</view>
			<view class="component-desc">用于收集用户输入的组件集合</view>
			<view class="component-desc">• input：单行文本输入框</view>
			<view class="component-desc">• checkbox：复选框</view>
			<view class="component-desc">• textarea：多行文本输入框</view>
			<view class="component-desc">• button：按钮组件</view>
			<view class="component-desc">• label：标签组件</view>
			<view class="component-desc">• form：表单容器</view>
		</view>

		<!-- 4. 导航组件 - navigator -->
		<view class="component-card">
			<view class="component-title">4. 导航组件 - navigator</view>
			<view class="component-desc">
				页面跳转组件
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		}
	};
</script>

<style scoped>
	.tabcom-container {
		padding: 15rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
		/* 适配全屏高度 */
	}

	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		padding: 20rpx 0;
		margin-bottom: 10rpx;
	}

	.component-card {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.component-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #222;
		margin-bottom: 15rpx;
		padding-left: 10rpx;
		border-left: 4rpx solid #007aff;
		/* 左侧标记线 */
	}

	.component-desc {
		font-size: 26rpx;
		color: #666;
		line-height: 40rpx;
		margin-bottom: 10rpx;
	}
</style>