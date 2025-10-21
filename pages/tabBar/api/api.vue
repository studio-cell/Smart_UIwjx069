<template>
	<view class="api-container">
		<text class="api-title">API 演示页面</text>
		<text class="api-desc">这里可以写 uni-app API 调用示例，比如网络请求、本地存储等</text>
	</view>
	<view>
		<navigator url="/pages/APIpages/LogPage/Logpage"> 
		<button>打印日志</button></navigator>
		</view>
	<view>
		<navigator url="/pages/APIpages/Timepage/Timepage"> 
		<button>定时器</button></navigator>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				// 可添加 API 演示相关数据
			}
		},
		onLoad() {
			// 页面加载时可调用 API，比如 uni.request
			// this.fetchData();
		},
		methods: {
			// fetchData() {
			//   uni.request({
			//     url: 'https://api.example.com/data',
			//     success: (res) => {
			//       console.log('请求结果：', res);
			//     }
			//   });
			// }
		}
	}
</script>

<style scoped>
	.api-container {
		padding: 20rpx;
	}

	.api-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.api-desc {
		color: #666;
		line-height: 40rpx;
	}
</style>