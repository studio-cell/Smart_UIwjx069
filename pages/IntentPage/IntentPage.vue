<template>
	<view style="padding: 50rpx 20rpx;">
		<!-- 父页面输入框：值绑定到title，传给子组件A -->
		<view class="text-area" style="margin-bottom: 30rpx;">
			<text class="label">输入值：</text>
			<input type="text" v-model="title"
				style="border: 1rpx solid #ccc; padding: 12rpx; border-radius: 8rpx; color: red;"
				placeholder="请输入要传给子组件A的值" />
		</view>

		<!-- 父页面接收子组件B的回传值 -->
		<view class="text-area" style="margin-bottom: 50rpx;">
			<text class="label">回传值：</text>
			<input type="text" :value="callBackValue"
				style="border: 1rpx solid #ccc; padding: 12rpx; border-radius: 8rpx; color: yellow;" readonly />
		</view>

		<!-- 引入子组件A：通过:intent绑定父值传给子A -->
		<compA :intent="title"></compA>

		<!-- 引入子组件B：通过@callBackFun监听子B的回传事件 -->
		<compB @callBackFun="callBack"></compB>
	</view>
</template>

<script>
	// 1. 导入两个子组件
	import compA from "@/components/compA.vue";
	import compB from "@/components/compB.vue";

	export default {
		// 2. 注册子组件
		components: {
			compA,
			compB
		},
		data() {
			return {
				title: "", // 父页面输入的值，传给子组件A
				callBackValue: "" // 接收子组件B的回传值
			};
		},
		methods: {
			// 3. 接收子组件B的回传值（子B触发callBackFun时执行）
			callBack(msg) {
				console.warn("父页面接收子B回传值：", msg);
				this.callBackValue = msg; // 赋值给父页面的回传值输入框
			}
		}
	};
</script>

<style scoped>
	.text-area {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.label {
		font-size: 28rpx;
		color: #333;
		width: 120rpx;
	}
</style>