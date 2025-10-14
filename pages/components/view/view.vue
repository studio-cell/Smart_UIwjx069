<template>
	<view>
		<!-- 顶部标题 -->
		<view class="smart-page-head">
			<view class="smart-page-head-title">view 容器组件演示</view>
		</view>

		<view class="smart-padding-wrap">
			<!-- 横向布局 -->
			<view class="demo-title">1. flex-direction: row 横向布局</view>
			<view class="smart-flex smart-row">
				<view class="flex-item smart-bg-blue">A</view>
				<view class="flex-item smart-bg-green">B</view>
				<view class="flex-item smart-bg-red">C</view>
			</view>

			<!-- 纵向布局 -->
			<view class="demo-title">2. flex-direction: column 纵向布局</view>
			<view class="smart-flex smart-column">
				<view class="flex-item-100 smart-bg-blue">A</view>
				<view class="flex-item-100 smart-bg-green">B</view>
				<view class="flex-item-100 smart-bg-red">C</view>
			</view>

			<!-- 纵向滚动 -->
			<view class="demo-title">3. scroll-view 纵向滚动</view>
			<view class="scroll-container">
				<scroll-view class="scroll-y" scroll-y="true">
					<view class="scroll-view-item smart-bg-red">A</view>
					<view class="scroll-view-item smart-bg-blue">B</view>
					<view class="scroll-view-item smart-bg-green">C</view>
					<view class="scroll-view-item smart-bg-yellow">D</view>
				</scroll-view>
			</view>

			<!-- 横向滚动 -->
			<view class="demo-title">4. scroll-view 横向滚动</view>
			<view class="scroll-container-x">
				<scroll-view class="scroll-x" scroll-x="true" scroll-left="120">
					<view class="scroll-view-item-h smart-bg-red">A</view>
					<view class="scroll-view-item-h smart-bg-blue">B</view>
					<view class="scroll-view-item-h smart-bg-green">C</view>
					<view class="scroll-view-item-h smart-bg-yellow">D</view>
				</scroll-view>
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

<style>
	@import "../../../lib/css/smart.css";

	/* 补充演示样式 */
	.demo-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin: 30rpx 0 15rpx 0;
		padding-left: 10rpx;
		border-left: 3rpx solid #007aff;
	}

	.scroll-container {
		height: 300rpx;
		border: 1rpx solid #eee;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.scroll-container-x {
		height: 150rpx;
		border: 1rpx solid #eee;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.smart-bg-yellow {
		background-color: #FFCC00;
	}

	.scroll-view-item {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		margin: 5rpx 0;
	}

	.scroll-view-item-h {
		width: 200rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		float: left;
		margin: 0 5rpx;
	}
</style>