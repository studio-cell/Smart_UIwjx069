<template>
	<view class="page-container">
		<!-- 页面标题 -->
		<view class="page-title">新闻列表</view>

		<!-- 循环渲染新闻卡片：删除标签内注释，修正语法 -->
		<view class="card-list">
			<cardViewText v-for="(item, index) in datalist" :key="item.nid" 
				:nid="item.nid"
				:title="item.title"
				:isTop="item.isTop"
				:author="item.author"
				:comments="item.comments"
				:time="item.time"
				:showSearch="item.showSearch"
				@title-click="goToDetail"
				>
				
				<template v-slot:search-box v-if="item.showSearch">
					<view class="search-box">
						<text class="search-label">搜索：</text>
						<text class="search-tag" v-for="(tag, idx) in item.searchTags" :key="idx">{{ tag }}</text>
					</view>
				</template>
			</cardViewText>
		</view>
	</view>
</template>

<script>
	
	import cardViewText from "@/components/cardViewText.vue";

	export default {
		components: {
			cardViewText
		}, 
		data() {
			return {
				datalist: [{
						nid: "T15627",
						title: "14个月从100家开到1000家门店，蜜雪冰城为何买下这家精酿啤酒商",
						isTop: true,
						author: "界面新闻",
						comments: 56,
						time: "2025.10.07",
						showSearch: false,
						searchTags: []
					},
					{
						nid: "B4485",
						title: "把握历史大势 共创美好未来（观沧海）",
						isTop: false,
						author: "人民日报",
						comments: 1025,
						time: "2025.10.25",
						showSearch: false,
						searchTags: []
					},
					{
						nid: "F7892",
						title: "黄金还能走多远？卖方高呼“第三浪启动”，230多份研报看多",
						isTop: false,
						author: "财联社",
						comments: 452,
						time: "2025.10.08",
						showSearch: true,
						searchTags: ["今日金价", "黄金行情", "研报解读"]
					},
					{
						nid: "J3456",
						title: "“没有短板”的完美战鹰！歼-16机库独家探访",
						isTop: false,
						author: "红星新闻",
						comments: 56,
						time: "2025.10.07",
						showSearch: false,
						searchTags: []
					}
				]
			};
		},
		methods: {
			goToDetail(nid) {
				uni.showToast({
					title: `点击新闻ID：${nid}`,
					icon: "none"
				});
			}
		}
	};
</script>

<style scoped>
	.page-container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1a1a1a;
		margin-bottom: 20rpx;
		padding-left: 8rpx;
		border-left: 4rpx solid #f00;
	}

	.card-list {
		background-color: #f5f5f5;
	}
</style>