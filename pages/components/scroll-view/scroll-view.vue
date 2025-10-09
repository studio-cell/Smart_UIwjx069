<template>
	<view>
		<!-- 顶部区域 -->
		<view class="smart-page-head">
			<view class="smart-page-head-title">scroll-view区域滚动视图</view>
		</view>
		<!-- 主题内容 -->
		<view class="smart-padding-wrap">
			<view class="smart-text">可滚动视图区域。</view>
			<view>vertical scroll 纵向滚动</view>
			<view>
				<scroll-view class="scroll-y" scroll-y="true">
					<view class="scroll-view-item smart-bg-red">A</view>
					<view class="scroll-view-item smart-bg-blue">B</view>
					<view class="scroll-view-item smart-bg-green">C</view>
				</scroll-view>
			</view>
			<view>horizontal scroll 横向滚动</view>
			<view>
				<scroll-view class="scroll-x" scroll-x="true" scroll-left="120">
					<view class="scroll-view-item-h smart-bg-red">A</view>
					<view class="scroll-view-item-h smart-bg-blue">B</view>
					<view class="scroll-view-item-h smart-bg-green">C</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 若有动态数据可在此定义，当前示例无额外逻辑
			}
		},
		methods: {
			// 可扩展滚动相关事件逻辑（如滚动监听），当前示例无
		}
	}
</script>

<style>
	/* 路径根据实际情况调整，确保能找到 smart.css */
	@import "../../../lib/css/smart.css";
</style>