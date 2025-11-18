<template>
	<view class="comp-a-container"
		style="margin-bottom: 50rpx; padding: 30rpx; background: #ff9d13; border-radius: 12rpx;">
		<text
			style="font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 20rpx;">子组件A</text>

		<!-- 展示父页面传进来的值 -->
		<view class="coma_box" style="margin-bottom: 20rpx;">
			<text style="font-size: 24rpx; color: #666;">父组件传进来的值：</text>
			<text style="font-weight: bold; color: red; font-size: 26rpx;">{{ intent || "暂无" }}</text>
		</view>

		<!-- 点击按钮：给兄弟组件B传值（通过uni.$emit触发全局事件） -->
		<button type="primary" @click="sendData()" style="width: 100%;">
			传值给子组件B
		</button>
	</view>
</template>

<script>
	export default {
		// 1. 通过props接收父页面传值（props名和父组件绑定的属性名一致：intent）
		props: ["intent"],
		methods: {
			sendData() {
				if (!this.intent) {
					uni.showToast({
						title: "请先在父页面输入值",
						icon: "none"
					});
					return;
				}
				console.warn("子A给子B传值：", this.intent);
				// 2. 触发全局事件getIntent，将父传的值传给兄弟B
				uni.$emit("getIntent", this.intent);
				uni.showToast({
					title: "已传给子组件B",
					icon: "success"
				});
			}
		}
	};
</script>