<template>
	<view>
		<view style="padding:30rpx; display: flex; flex-direction: column;">
			<!-- 启动基础定时器 -->
			<button @click="onsetTimeout()" type="primary">启动单次计时器</button>

			<!-- 启动带参数的定时器 -->
			<button @click="onsetTimeout()" type="default">启动带参定时器</button>

			<!-- 取消定时器 -->
			<button @click="onclearTimeout()" type="warn">取消计时器</button>
		</view>

		<!-- 显示定时器状态 -->
		<view style="padding: 0 30rpx; margin-top: 20rpx;">
			<text>{{ timerStatus }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null, // 用于存储定时器ID，以便取消
				timerStatus: '未启动定时器' // 显示当前状态
			};
		},
		methods: {
			// 基础定时器：3秒后执行
			onsetTimeout() {
				// 先清除已有定时器，避免重复创建
				if (this.timer) {
					clearTimeout(this.timer);
				}

				this.timerStatus = '定时器已启动，3秒后执行...';

				// 创建定时器，3000ms后执行回调
				this.timer = setTimeout(() => {
					this.timerStatus = '基础定时器执行完成！';
					console.log('基础定时器触发');
					this.timer = null; // 执行后清空ID
				}, 3000);
			},

			// 带参数的定时器
			onsetTimeout() {
				if (this.timer) {
					clearTimeout(this.timer);
				}

				const name = 'wjx';
				const num = '069';
				this.timerStatus = `带参定时器已启动，2秒后执行（参数：${name}, ${num}）...`;

				// 传递参数给回调函数
				this.timer = setTimeout((param1, param2) => {
					this.timerStatus = `带参定时器执行完成！参数：${param1}, ${param2}`;
					console.log('带参定时器触发，参数：', param1, param2);
					this.timer = null;
				}, 2000, name, num); // 最后两个参数会传递给回调
			},

			// 取消定时器
			onclearTimeout() {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
					this.timerStatus = '定时器已取消';
					console.log('定时器已取消');
				} else {
					this.timerStatus = '没有正在运行的定时器';
				}
			}
		},
		// 页面卸载时确保清除定时器，避免内存泄漏
		onUnload() {
			if (this.timer) {
				clearTimeout(this.timer);
			}
		}
	};
</script>

<style>
	button {
		margin: 10rpx 0;
		/* 垂直方向间距 */
		padding: 20rpx;
		font-size: 30rpx;
	}

	text {
		font-size: 28rpx;
		color: #666;
	}
</style>