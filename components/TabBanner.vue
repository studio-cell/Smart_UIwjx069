<template>
	<view class="tab-banner">
		<scroll-view class="tab-scroll" scroll-x="true" show-scrollbar="false" scroll-with-animation>
			<view class="tab-list">
				<view class="tab-item" v-for="(item, index) in list" :key="index" @click="onTabClick(index)">
					<text :style="current === index ? activeStyle : normalStyle">{{ item }}</text>
					<view class="tab-indicator" v-if="current === index"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "TabBanner",
		props: {
			list: {
				type: Array,
				required: true
			}, // 分类列表
			current: {
				type: Number,
				required: true,
				default: 0
			} // 当前选中索引
		},
		computed: {
			// 选中样式
			activeStyle() {
				return {
					color: "#d00",
					fontSize: "32rpx",
					fontWeight: "bold"
				};
			},
			// 普通样式
			normalStyle() {
				return {
					color: "#333",
					fontSize: "28rpx",
					fontWeight: "normal"
				};
			}
		},
		methods: {
			// 点击分类，触发父组件事件
			onTabClick(index) {
				this.$emit("tab-click", index);
			}
		}
	};
</script>

<style scoped>
	.tab-banner {
		background: #fff;
		padding: 16rpx 0;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}

	.tab-scroll {
		white-space: nowrap;
		padding: 0 20rpx;
	}

	.tab-list {
		display: inline-flex;
		gap: 40rpx;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tab-indicator {
		width: 40rpx;
		height: 6rpx;
		background: #d00;
		border-radius: 3rpx;
		margin-top: 8rpx;
	}
</style>