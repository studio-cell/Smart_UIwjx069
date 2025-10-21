<template>
	<scroll-view scroll-y="true" class="container">
		<!-- 1. 顶部轮播图 -->
		<swiper class="swiper" autoplay interval="3000" circular indicator-dots>
			<swiper-item>
				<image src="/static/city4.jpg" mode="widthFix"></image>
			</swiper-item>
			<swiper-item>
				<image src="/static/city2.jpg" mode="widthFix"></image>
			</swiper-item>
			<swiper-item>
				<image src="/static/city5.jpg" mode="widthFix"></image>
			</swiper-item>
		</swiper>

		<!-- 2. 城市介绍（富文本，含加粗、换行、颜色格式） -->
		<view class="section">
			<rich-text :nodes="cityIntro"></rich-text>
		</view>

		<!-- 3. 探索进度 -->
		<view class="section">
			<progress percent="60" show-info stroke-width="6" activeColor="#007AFF"></progress>
		</view>

		<!-- 4. 省市区三级联动选择器（点击区域弹出面板） -->
		<view class="section">
			<!-- picker mode="region" 原生支持三级联动 -->
			<picker mode="region" @change="onRegionChange" :value="region" class="picker-container">
				<!-- 点击此区域触发选择面板 -->
				<view class="picker-view">
					选择城市：{{ region[0] }}-{{ region[1] }}-{{ region[2] }}
				</view>
			</picker>
		</view>

		<!-- 5. 偏好设置 -->
		<view class="section">
			<view class="preference-title">偏好设置</view>
			<view class="radio-group">
				<label class="radio-item" v-for="(item, index) in travelModes" :key="index">
					<radio :value="item.value" v-model="selectedMode"></radio>
					<text>{{ item.label }}</text>
				</label>
			</view>
			<view class="switch-item">
				<text>显示推荐景点</text>
				<switch v-model="showRecommend"></switch>
			</view>
			<view class="slider-item">
				<text>探索半径：{{ radius }}km</text>
				<slider v-model="radius" min="1" max="20" step="1"></slider>
			</view>
		</view>

		<!-- 6. 媒体展示 -->
		<view class="section">
			<video class="video" src="/static/city-video.mp4" controls poster="/static/video_poster.jpg"
				@error="handleVideoError"></video>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				// 富文本城市介绍（增加加粗、换行、颜色格式）
				cityIntro: [{
					name: 'div',
					attrs: {
						style: 'padding: 15rpx; line-height: 40rpx;' // 行高确保换行生效
					},
					children: [{
							name: 'h3',
							attrs: {
								style: 'color: #333; margin-bottom: 10rpx;'
							},
							children: [{
								type: 'text',
								text: '泉州市介绍'
							}]
						},
						{
							name: 'p',
							children: [{
									type: 'text',
									text: '泉州是福建省下辖的地级市，'
								},
								{
									name: 'strong',
									children: [{
										type: 'text',
										text: '首批国家历史文化名城'
									}]
								},
								{
									type: 'text',
									text: '，也是著名的侨乡。'
								}
							]
						},
						{
							name: 'p',
							attrs: {
								style: 'margin-top: 15rpx; color: #666;' // 段落间距+颜色
							},
							children: [{
									type: 'text',
									text: '这里拥有'
								},
								{
									name: 'strong',
									attrs: {
										style: 'color: #E63946;'
									},
									children: [{
										type: 'text',
										text: '开元寺、清净寺、清源山'
									}]
								},
								{
									type: 'text',
									text: '等众多名胜古迹，'
								},
								{
									name: 'br'
								}, // 手动换行
								{
									type: 'text',
									text: '其中泉州宋元中国的世界海洋商贸中心被列入世界文化遗产。'
								}
							]
						}
					]
				}],
				// 省市区三级联动数据（初始值为福建省-泉州市-鲤城区）
				region: ['福建省', '泉州市', '鲤城区'],
				travelModes: [{
						label: '公交',
						value: 'bus'
					},
					{
						label: '自驾',
						value: 'self_driving'
					},
					{
						label: '步行',
						value: 'walking'
					}
				],
				selectedMode: 'bus',
				showRecommend: true,
				radius: 5
			};
		},
		methods: {
			// 省市区选择变化回调（三级联动核心）
			onRegionChange(e) {
				// e.detail.value 为数组：[省份, 城市, 区县]
				this.region = e.detail.value;
				console.log('当前选择：', this.region); // 可用于后续业务处理
			},
			// 视频错误监听
			handleVideoError(e) {
				console.log('视频错误：', e.detail);
			}
		}
	};
</script>

<style scoped>
	.container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}

	.section {
		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
	}

	/* 富文本样式优化 */
	rich-text strong {
		font-weight: bold;
	}

	rich-text br {
		display: block;
		height: 20rpx;
	}

	/* 城市选择器样式（增强点击区域） */
	.picker-container {
		width: 100%;
	}

	.picker-view {
		padding: 20rpx;
		background-color: #f9f9f9;
		border-radius: 6rpx;
		font-size: 28rpx;
		color: #333;
		/* 增加点击反馈 */
		touch-action: manipulation;
	}

	.picker-view:active {
		background-color: #f0f0f0;
	}

	.radio-group {
		display: flex;
		flex-direction: row;
		margin: 10rpx 0;
	}

	.radio-item {
		margin-right: 30rpx;
		display: flex;
		align-items: center;
	}

	.switch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx 0;
	}

	.slider-item {
		margin: 10rpx 0;
	}

	.video {
		width: 100%;
		height: 400rpx;
	}

	.video:hover {
		cursor: pointer;
	}

	.preference-title {
		font-weight: bold;
		margin-bottom: 10rpx;
	}
</style>