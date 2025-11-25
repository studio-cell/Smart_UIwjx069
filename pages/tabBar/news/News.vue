<template>
	<view class="tabcom-container">
		<!-- 页面标题 -->
		<view class="page-title">组件说明</view>

		<!-- 1. 容器组件 - view（点击跳转） -->
		<view class="component-card" @click="gotoViewPage">
			<view class="component-title">1. 容器组件 - view</view>
			<view class="component-desc">
				基础容器组件，用于包裹其他组件（如 text、button），可通过 style 控制布局，类似 HTML 的 div 标签。
			</view>
			<view class="jump-tip">点击卡片 → 查看 view 组件示例</view>
		</view>

		<!-- 2. 基础内容组件 - text（点击跳转） -->
		<view class="component-card" @click="gotoTextPage">
			<view class="component-title">2. 基础内容组件 - text</view>
			<view class="component-desc">
				用于展示文本内容的组件，支持文本可选性、空格显示等属性。
			</view>
			<view class="jump-tip">点击卡片 → 查看 text 组件示例</view>
		</view>

		<!-- 3. 基础内容组件 - progress（点击跳转） -->
		<view class="component-card" @click="gotoProgressPage">
			<view class="component-title">3. 基础内容组件 - progress</view>
			<view class="component-desc">
				进度条组件，用于展示任务进度，支持自定义颜色、显示百分比。
			</view>
			<view class="jump-tip">点击卡片 → 查看 progress 组件示例</view>
		</view>

		<!-- 4. 表单组件 -->
		<view class="component-card">
			<view class="component-title">4. 表单组件</view>
			<view class="component-desc">用于收集用户输入的组件集合</view>
			<view class="component-desc">• input：单行文本输入框（账号、密码等）</view>
			<view class="component-desc">• checkbox：复选框（多选场景）</view>
			<view class="component-desc">• textarea：多行文本输入框（意见反馈等）</view>
			<view class="component-desc">• button：按钮组件（提交、重置等操作）</view>
			<view class="component-desc">• label：标签组件（描述表单元素作用）</view>
			<view class="component-desc">• form：表单容器（整体验证、提交）</view>
		</view>

		<!-- 5. 导航组件 - navigator -->
		<view class="component-card">
			<view class="component-title">5. 导航组件 - navigator</view>
			<view class="component-desc">
				页面跳转组件，支持跳转到普通页面、tabBar 页面，类似 HTML 的 a 标签。
			</view>
			<!-- navigator 跳转按钮 -->
			<navigator url="/pages/components/view/view" open-type="navigate" class="navigator-btn">
				跳 view 页面
			</navigator>
			<navigator url="/pages/components/text/text" open-type="navigate" class="navigator-btn"
				style="margin-left: 15rpx;">
				跳 text 页面
			</navigator>
			<navigator url="/pages/components/progress/progress" open-type="navigate" class="navigator-btn"
				style="margin-left: 15rpx;">
				跳 progress 页面
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			// 跳 view 页面
			gotoViewPage() {
				uni.navigateTo({
					url: "/pages/components/view/view",
					fail: (err) => console.log("跳 view 失败：", err)
				});
			},
			// 跳 text 页面
			gotoTextPage() {
				uni.navigateTo({
					url: "/pages/components/text/text",
					fail: (err) => console.log("跳 text 失败：", err)
				});
			},
			// 跳 progress 页面
			gotoProgressPage() {
				uni.navigateTo({
					url: "/pages/components/progress/progress",
					fail: (err) => console.log("跳 progress 失败：", err)
				});
			}
		}
	};
</script>

<style scoped>
	.tabcom-container {
		padding: 15rpx;
		background-color: #f7f7f7;
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

	.component-card {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		transition: background-color 0.2s;
		cursor: pointer;
	}

	.component-card:hover {
		background-color: #f0f7ff;
	}

	.component-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #222;
		margin-bottom: 15rpx;
		padding-left: 10rpx;
		border-left: 4rpx solid #007aff;
	}

	.component-desc {
		font-size: 26rpx;
		color: #666;
		line-height: 40rpx;
		margin-bottom: 10rpx;
	}

	.jump-tip {
		margin-top: 15rpx;
		font-size: 24rpx;
		color: #007aff;
		text-align: right;
		padding-right: 5rpx;
	}

	.navigator-btn {
		display: inline-block;
		margin-top: 15rpx;
		padding: 12rpx 24rpx;
		background-color: #007aff;
		color: #fff;
		font-size: 24rpx;
		border-radius: 6rpx;
		text-decoration: none;
	}
</style>