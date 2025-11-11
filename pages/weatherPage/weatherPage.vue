<template>
	<view class="container">
		<view v-if="weatherData" class="weather-card">
			<view class="title">明天天气预报</view>
			<view>日期：{{ weatherData.date }}</view>
			<view>星期：{{ weatherData.week }}</view>
			<view>最高温：{{ weatherData.high }}°C</view>
			<view>最低温：{{ weatherData.low }}°C</view>
		</view>
		<view v-else>加载中...</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weatherData: null // 存储天气预报数据
			};
		},
		onLoad() {
			this.getWeather();
		},
		methods: {
			getWeather() {
				// 调用uni.request请求天气接口
				uni.request({
					url: 'https://t.weather.sojson.com/api/weather/city/101230501',
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200 && res.data.status === 200) {
							const tomorrow = res.data.data.forecast[1]; // 获取明天的预报（数组第2项）
							this.weatherData = {
								date: tomorrow.date,
								week: tomorrow.week,
								high: tomorrow.high.replace('高温 ', ''),
								low: tomorrow.low.replace('低温 ', '')
							};
						}
					},
					fail: (err) => {
						console.error('请求天气失败：', err);
					}
				});
			}
		}
	};
</script>

<style scoped>
	.container {
		padding: 30rpx;
	}

	.weather-card {
		background-color: #f5f5f5;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
	}
</style>