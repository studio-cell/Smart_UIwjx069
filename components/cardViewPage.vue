<template>
	<view class="container">
		<view v-for="index in 10" style="margin: 10rpx;">
			<CustomTextView></CustomTextView>
		</view>
		<text>卡片页面（可自行补充内容）</text>
	</view>
</template>

<script>
	export default {
		name: "cardViewPage",
		data() {
			return {
				// 可添加页面数据
			};
		}
	};
</script>

<style scoped>
	.container {
		padding: 20rpx;
		min-height: 100vh;
	}
</style>