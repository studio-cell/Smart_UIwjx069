<template>
	<view class="comp-b-container" style="padding: 30rpx; background: #19ffdd; border-radius: 12rpx;">
		<text
			style="font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 20rpx;">子组件B</text>

		<!-- 展示兄弟组件A传进来的值 -->
		<view class="b-box" style="margin-bottom: 30rpx;">
			<text style="font-size: 24rpx; color: #666;">子A传进来的值：</text>
			<text style="font-weight: bold; color: #007AFF; font-size: 26rpx;">{{ result || "暂无" }}</text>
		</view>

		<!-- 输入回传值：绑定到callbackValue，点击按钮回传给父 -->
		<view class="b-box">
			<text style="font-size: 24rpx; color: #aa5500; margin-right: 16rpx;">回传值：</text>
			<input type="text" v-model="callbackValue"
				style="flex: 1; border: 1rpx solid #ccc; padding: 12rpx; border-radius: 8rpx; color: yellow;"
				placeholder="请输入要回传的值" />
			<button @click="sendOutside()" size="mini" type="warn" style="margin-left: 16rpx;">
				回传父组件
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result: "", // 接收兄弟组件A传的值
				callbackValue: "" // 要回传给父页面的值
			};
		},
		created() {
			// 1. 监听全局事件getIntent，接收兄弟A传的值（组件创建时就监听）
			uni.$on("getIntent", (msg) => {
				console.warn("子B接收子A传值：", msg);
				this.result = msg; // 赋值给result，在模板中展示
			});
		},
		methods: {
			// 2. 给父页面回传值（通过this.$emit触发父组件绑定的事件）
			sendOutside() {
				if (!this.callbackValue) {
					uni.showToast({
						title: "请先输入回传值",
						icon: "none"
					});
					return;
				}
				console.warn("子B给父回传值：", this.callbackValue);
				// 触发父组件绑定的callBackFun事件，将值传给父
				this.$emit("callBackFun", this.callbackValue);
				this.callbackValue = ""; // 清空输入框
				uni.showToast({
					title: "回传成功",
					icon: "success"
				});
			}
		},
		beforeDestroy() {
			// 3. 组件销毁时移除全局事件监听（避免内存泄漏）
			uni.$off("getIntent");
		}
	};
</script>