<template>
	<view class="grammar-container">
		<view class="page-title">语法</view>
		<!-- 展示简单文本 -->
		<view class="text-item">Hello UniAPP</view>
		<view class="text-item">4</view>
		<view class="text-item">NO</view>
		<view class="text-item">!euV olleH</view>
		<view class="text-item">今天天气真好</view>
		<!-- 展示状态相关文本，可结合数据绑定 -->
		<view class="text-item">State的值是{{ stateValue }}</view>
		<view class="text-item">State的值是{{ stateValue }}</view>
		<view class="text-item">State is {{ stateValueEn }}</view>
		<!-- 展示对象数据 -->
		<view class="object-item">{{ object1 }}</view>
		<view class="object-item">{{ object2 }}</view>
		<!-- 展示列表数据 -->
		<view class="list-item" v-for="(item, index) in listData" :key="index">
			{{ item }}
		</view>
		<!-- 展示带键值对的文本 -->
		<view class="key-value-item">0.title:how to lists in Vue?</view>
		<view>
			<!-- 引用 static 目录下的 logo.png -->
			<image src="/static/logo.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stateValue: 'Vue', // 状态值
				stateValueEn: 'vue', // 英文状态值
				object1: {
					id: 1,
					name: 'uni-app'
				}, // 第一个对象
				object2: {
					id: 2,
					name: 'HTML'
				}, // 第二个对象
				listData: [0, 1, 0, 1, 0, 1, 0, 1] // 列表数据
			};
		}
	};
</script>

<style scoped>
	.grammar-container {
		padding: 15rpx;
		background-color: #fff;
		min-height: 100vh;
	}

	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		padding: 20rpx 0;
		margin-bottom: 10rpx;
	}

	.text-item,
	.object-item,
	.key-value-item {
		font-size: 26rpx;
		color: #333;
		line-height: 40rpx;
		margin-bottom: 10rpx;
		text-align: center;
	}

	.object-item {
		color: #007AFF;
		/*让对象文本显示为蓝色，与示例类似*/
	}

	.list-item {
		font-size: 26rpx;
		color: green;
		/*让列表项显示为绿色，与示例类似*/
		line-height: 40rpx;
		margin-bottom: 5rpx;
		text-align: center;
	}

	.key-value-item {
		font-size: 26rpx;
		color: purple;
		/*让键值对文本显示为紫色，与示例类似*/
		line-height: 40rpx;
		margin-top: 20rpx;
		text-align: center;
	}
</style>