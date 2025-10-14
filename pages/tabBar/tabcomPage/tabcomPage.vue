<template>
	<view class="tabcom-container">
		<!-- 页面标题 -->
		<view class="page-title">组件说明</view>

		<!-- 1. 容器组件 - view -->
		<view class="component-card">
			<view class="component-title">1. 容器组件 - view</view>
			<view class="component-desc">
				基础容器组件，用于包裹其他组件，可通过设置样式来控制布局，是 uni - app 中最基础的视图容器，类似于 HTML 中的 div 标签。
			</view>
		</view>

		<!-- 2. 基础内容组件 - text（点击跳转） -->
		<view class="component-card" @click="gotoTextPage">
			<view class="component-title">2. 基础内容组件 - text</view>
			<view class="component-desc">
				用于展示文本内容的组件，支持设置文本的可选性、空格显示、解码等属性，能满足基本的文本展示需求。
			</view>
			<view class="jump-tip">点击卡片 → 查看 text 组件示例</view>
		</view>

		<!-- 3. 基础内容组件 - progress（新增：点击跳转） -->
		<view class="component-card" @click="gotoProgressPage">
			<view class="component-title">3. 基础内容组件 - progress</view>
			<view class="component-desc">
				进度条组件，用于展示任务完成进度，支持自定义进度颜色、进度值、是否显示百分比等属性，常见于加载、任务进度展示场景。
			</view>
			<view class="jump-tip">点击卡片 → 查看 progress 组件示例</view>
		</view>

		<!-- 4. 表单组件 -->
		<view class="component-card">
			<view class="component-title">4. 表单组件</view>
			<view class="component-desc">用于收集用户输入的组件集合</view>
			<view class="component-desc">• input：单行文本输入框，可用于用户输入账号、密码等简单文本内容。</view>
			<view class="component-desc">• checkbox：复选框，允许用户从多个选项中选择一个或多个。</view>
			<view class="component-desc">• textarea：多行文本输入框，适用于用户输入较长的文本，如意见反馈等。</view>
			<view class="component-desc">• button：按钮组件，可触发点击事件，用于提交表单、执行操作等。</view>
			<view class="component-desc">• label：标签组件，常与表单元素配合使用，用于描述表单元素的作用。</view>
			<view class="component-desc">• form：表单容器，用于包裹表单组件，方便对表单进行整体操作，如验证、提交等。</view>
		</view>

		<!-- 5. 导航组件 - navigator（演示两种跳转） -->
		<view class="component-card">
			<view class="component-title">5. 导航组件 - navigator</view>
			<view class="component-desc">
				页面跳转组件，可实现不同页面之间的导航，支持多种跳转方式，如跳转到普通页面、tabBar 页面等，能方便地在应用内不同页面间切换。
			</view>
			<!-- 跳转 text 页面 -->
			<navigator url="/pages/components/text/text" open-type="navigate" class="navigator-btn">
				navigator 组件 → 跳 text 页面
			</navigator>
			<!-- 新增：跳转 progress 页面 -->
			<navigator url="/pages/components/progress/progress" open-type="navigate" class="navigator-btn"
				style="margin-left: 15rpx;">
				navigator 组件 → 跳 progress 页面
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
			// 跳 text 页面
			gotoTextPage() {
				uni.navigateTo({
					url: "/pages/components/text/text",
					fail: (err) => {
						console.log("跳转 text 页面失败：", err);
					}
				});
			},
			// 新增：跳 progress 页面
			gotoProgressPage() {
				uni.navigateTo({
					// 路径匹配 pages.json 中 progress 页面的配置
					url: "/pages/components/progress/progress",
					fail: (err) => {
						console.log("跳转 progress 页面失败：", err);
					}
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
	}

	/* 可点击卡片的交互反馈 */
	.component-card[@click] {
		cursor: pointer;
	}

	.component-card[@click]:hover {
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

	/* 跳转提示文字 */
	.jump-tip {
		margin-top: 15rpx;
		font-size: 24rpx;
		color: #007aff;
		text-align: right;
		padding-right: 5rpx;
	}

	/* navigator 组件按钮 */
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