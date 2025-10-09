<template>
	<view>
		<!-- 顶部区域 -->
		<view class="smart-page-head">
			<view class="smart-page-head-title">swiper 滑块视图</view>
		</view>
		<!-- 主题内容 -->
		<view class="smart-padding-wrap">
			<swiper circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<view class="swiper-item smart-bg-blue">A</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item smart-bg-green">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item smart-bg-red">C</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true, // 显示指示点
				autoplay: true, // 自动播放
				interval: 5000, // 切换间隔（毫秒）
				duration: 500 // 切换动画时长（毫秒）
			}
		},
		methods: {
			// 可扩展滑块切换事件逻辑，当前示例无
		}
	}
</script>

<style>
	/* 路径根据实际情况调整，确保能找到 smart.css */
	@import "../../../lib/css/smart.css";
</style>