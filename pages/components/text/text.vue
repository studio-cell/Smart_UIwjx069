<template>
	<view>
		<!-- 顶部区域 -->
		<view class="smart-page-head">
			<view class="smart-page-head-title">text 文本组件</view>
		</view>
		<view class="smart-padding-wrap">
			<view class="text-box" scroll-y="true">
				<text>{{ text }}</text>
			</view>
			<!-- 绑定点击事件 -->
			<button type="primary" :disabled="!canAdd" @click="add">add line</button>
			<button type="warn" :disabled="!canRemove" @click="remove">remove line</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				texts: [
					'HBuilder, 400万开发者选择的IDE',
					'HBuilderX, 轻巧、极速, 极客编辑器',
					'uni - app, 终极跨平台方案',
					'HBuilder, 400万开发者选择的IDE',
					'HBuilderX, 轻巧、极速, 极客编辑器',
					'uni - app, 终极跨平台方案',
					'HBuilder, 400万开发者选择的IDE',
					'HBuilderX, 轻巧、极速, 极客编辑器',
					'uni - app, 终极跨平台方案',
					'......'
				],
				text: '',
				canAdd: true,
				canRemove: false,
				extraLine: []
			};
		},
		methods: {
			add(e) {
				this.extraLine.push(this.texts[this.extraLine.length % 12]);
				this.text = this.extraLine.join('\n');
				this.canAdd = this.extraLine.length < 12;
				this.canRemove = this.extraLine.length > 0;
			},
			remove(e) {
				if (this.extraLine.length > 0) {
					this.extraLine.pop();
					this.text = this.extraLine.join('\n');
					this.canAdd = this.extraLine.length < 12;
					this.canRemove = this.extraLine.length > 0;
				}
			}
		}
	};
</script>

<style>
	.text-box {
		margin-bottom: 40rpx;
		padding: 40rpx 0;
		display: flex;
		min-height: 300rpx;
		background-color: #d8d8d8;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		color: #353535;
		line-height: 1.8;
	}
</style>