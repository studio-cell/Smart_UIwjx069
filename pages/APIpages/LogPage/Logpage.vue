<template>
	<view style="padding: 30rpx; display: flex; flex-direction: column; gap: 20rpx;">
		<!-- 按钮打印日志（修正注释格式和事件绑定） -->
		<button @click="onLog">Console.log</button>
		<button @click="onDebug">Console.debug</button>
		<button @click="onInfo">Console.info</button>
		<button @click="onWarn">Console.warn</button>
		<button @click="onError">Console.error</button>
	</view>
</template>

<script>
	// 移除未使用的导入（避免编译警告）
	// import { createWeakRefSentry } from 'XrFrame/kanata/lib/frontend';

	export default {
		data() {
			return {
				myname: "wjx",
				title: "APIs"
			};
		},
		onLoad() {
			console.log("页面加载完成（onLoad）");
			// if 语句示例（可补充逻辑）
			// if (this.myname) {
			// 	console.log("用户名：", this.myname);
			// }
		},
		methods: {
			onLog() {
				// 修正变量名拼写错误（mayname → myname）
				console.log("onLog()--> Name:", this.myname);
				console.log("当前标题：", this.title);
			},
			onDebug() {
				console.debug("onDebug：调试信息");
			},
			onInfo() {
				console.info("onInfo：普通信息");
			},
			onWarn() {
				console.warn("onWarn：警告信息");
				if (true) {
					console.log("条件为真时的日志");
				} else {
					console.warn("快出错了...");
				}
			},
			onError() {
				console.error("onError：错误信息");
				try {
					// 模拟一个错误（例如调用不存在的函数）
					nonExistentFunction();
				} catch (e) {
					console.error("捕获到错误：", e);
				}
			}
		}
	};
</script>

<style>
	button {
		padding: 20rpx;
		background-color: #000000;
		color: white;
		border: none;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
</style>