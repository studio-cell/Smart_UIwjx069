<template>
	<view class="container">
		<button @click="chooseImage">选择本机图片</button>
		<image v-if="imagePath" :src="imagePath" mode="widthFix" style="width: 100%; margin-top: 20rpx;"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imagePath: '' // 存储选择的图片路径
			};
		},
		methods: {
			chooseImage() {
				// 调用uni.chooseImage选择图片
				uni.chooseImage({
					count: 1, // 选择1张图片
					sourceType: ['album', 'camera'], // 从相册或相机选择
					success: (res) => {
						this.imagePath = res.tempFilePaths[0]; // 存储图片临时路径
						// 调用uni.previewImage预览图片
						uni.previewImage({
							current: res.tempFilePaths[0],
							urls: res.tempFilePaths
						});
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

	button {
		margin-bottom: 20rpx;
	}
</style>