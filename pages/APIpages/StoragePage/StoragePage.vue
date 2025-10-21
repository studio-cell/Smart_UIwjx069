<template>
	<view style="padding: 30rpx;">
		<view>异步接口</view>
		<!-- 补充按钮点击事件，区分不同操作 -->
		<button @click="callStorageFun(1)">存储UserName到本地</button>
		<button @click="callStorageFun(2)">从本地读取UserName</button>
		<button @click="callStorageFun(3)" type="warn">清除本地UserName</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: 'zhangsan',
				timer1: null
			}
		},
		methods: {
			callStorageFun(parm) {
				console.log("callStorageFun==> parm " + parm);
				switch (parm) {
					case 1:
						// 存某一个字段到本地 字段名：值
						uni.setStorage({
							key: 'UserName',
							data: 'wjx',
							success() {
								console.log("UserName 存储成功");
								// 新增：显示操作结果提示
								uni.showToast({
									title: '存储成功',
									icon: 'success'
								});
							},
							fail(err) {
								console.log("UserName 存储失败：", err);
								uni.showToast({
									title: '存储失败',
									icon: 'none'
								});
							}
						})
						break;
					case 2:
						uni.getStorage({
							key: 'UserName',
							success(res) {
								// 补充：打印读取到的具体值
								console.log("读取UserName成功，值：", res.data);
								uni.showToast({
									title: `读取成功：${res.data}`,
									icon: 'none'
								});
							},
							fail() {
								console.log("读取UserName失败");
								uni.showToast({
									title: '读取失败',
									icon: 'none'
								});
							}
						});
						break;
						// 新增：清除本地存储的case
					case 3:
						uni.removeStorage({
							key: 'UserName',
							success() {
								console.log("清除UserName成功");
								uni.showToast({
									title: '清除成功',
									icon: 'success'
								});
							},
							fail() {
								console.log("清除UserName失败");
								uni.showToast({
									title: '清除失败',
									icon: 'none'
								});
							}
						})
						break;
				}
			}
		}
	}
</script>

<style>
	button {
		margin: 20rpx;
		padding: 15rpx;
		font-size: 28rpx;
	}
</style>