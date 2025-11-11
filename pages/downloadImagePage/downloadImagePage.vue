<template>
	<view class="container">
		<button @click="downloadImage">下载网络图片</button>
		<image v-if="imagePath" :src="imagePath" mode="widthFix" style="width: 100%; margin-top: 20rpx;"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imagePath: '', // 存储下载的图片路径
				imageUrl: 'https://cdn.pixabay.com/photo/2025/11/05/20/57/monastery-9939590_1280.jpg' // 目标图片地址
			};
		},
		methods: {
			downloadImage() {
				// 调用uni.downloadFile下载图片
				uni.downloadFile({
					url: this.imageUrl,
					success: (downloadRes) => {
						if (downloadRes.statusCode === 200) {
							this.imagePath = downloadRes.tempFilePath; // 存储临时路径
							console.log('图片下载成功，路径：', downloadRes.tempFilePath);
						}
					},
					progress: (progressRes) => {
						// 打印下载进度
						console.log('下载进度：' + progressRes.progress + '%');
					},
					fail: (err) => {
						console.error('图片下载失败：', err);
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