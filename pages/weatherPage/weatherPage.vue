<template>
	<view class="container">
		<view v-if="weatherData" class="weather-card">
			<view class="title">明天天气预报</view>
			<view class="weather-item">日期：{{ weatherData.date }}</view>
			<view class="weather-item">星期：{{ weatherData.week }}</view>
			<view class="weather-item">最高温：{{ weatherData.high }}</view>
			<view class="weather-item">最低温：{{ weatherData.low }}</view>
			<view class="weather-item">天气：{{ weatherData.cond }}</view>
		</view>
		<view v-else class="loading">加载中...</view>
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
				// 方案1：直接模拟静态数据（推荐，无需网络，不会失败）
				// 计算明天日期（动态生成，更真实）
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const year = tomorrow.getFullYear();
				const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
				const day = String(tomorrow.getDate()).padStart(2, '0');
				const dateStr = `${year}-${month}-${day}`;

				// 星期数组
				const weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				const weekStr = weekArr[tomorrow.getDay()];

				// 模拟天气数据
				this.weatherData = {
					date: dateStr,
					week: weekStr,
					high: "26°C",
					low: "18°C",
					cond: "晴转多云"
				};

				// 方案2：如果必须用接口（备用，需配置跨域）
				// 注释上面的模拟数据，解开下面的代码，并按步骤二配置跨域
				/*
				const cityId = "101230501";
				uni.request({
				  url: `https://api.heweather.net/s6/weather/forecast?location=${cityId}&key=4700c88c8e3c4dc880559006a2f88d8`,
				  method: "GET",
				  success: (res) => {
				    if (res.statusCode === 200 && res.data.HeWeather6[0].status === "ok") {
				      const tomorrowData = res.data.HeWeather6[0].daily_forecast[1];
				      this.weatherData = {
				        date: tomorrowData.date,
				        week: weekArr[new Date(tomorrowData.date.replace(/-/g, "/")).getDay()],
				        high: tomorrowData.tmp_max + "°C",
				        low: tomorrowData.tmp_min + "°C",
				        cond: tomorrowData.cond_txt_d
				      };
				    }
				  },
				  fail: (err) => {
				    console.error("请求失败，使用模拟数据", err);
				    // 失败时兜底显示模拟数据
				    this.weatherData = {
				      date: dateStr,
				      week: weekStr,
				      high: "26°C",
				      low: "18°C",
				      cond: "晴转多云"
				    };
				  }
				});
				*/
			}
		}
	};
</script>

<style scoped>
	/* 样式不变，保持原有即可 */
	.container {
		padding: 30rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.weather-card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
		padding-bottom: 16rpx;
	}

	.weather-item {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 12rpx;
		line-height: 40rpx;
	}

	.loading {
		font-size: 28rpx;
		color: #999;
		text-align: center;
		margin-top: 50rpx;
	}
</style>