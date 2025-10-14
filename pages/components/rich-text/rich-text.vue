<template>
	<view>
		<!-- 删除 <page-head> 标签，用自定义标题替代 -->
		<view class="smart-page-head">
			<view class="smart-page-head-title">rich-text 富文本</view>
		</view>
		<view class="smart-padding-wrap">
			<view><rich-text :nodes="nodes"></rich-text></view>
			<view><rich-text :nodes="strings"></rich-text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nodes: [{
					name: 'div',
					attrs: {
						class: 'div-class', // 修复类名空格
						style: 'line-height: 60px; color: red; text-align: center;background-color: #09BB07;' // 修复属性空格
					},
					children: [{
						type: 'text',
						text: 'Hello&nbsp;uni-app!'
					}]
				}],
				strings: '<div style="text-align: center;margin-top:50px;"><img src="/static/logo.png"/></div>' // 修复属性空格
			};
		}
	};
</script>

<style>
	/* 引入 smart.css（路径根据实际调整） */
	@import "../../../lib/css/smart.css";
</style>