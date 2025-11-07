<template>
	<view class="page-container">
		<view class="page-title">新闻综合实战</view>
		<view class="card-list">
			<!-- 组件标签：NewsView（与注册名一致） -->
			<NewsView v-for="(item, idx) in datalist" :key="item.nid" :nid="item.nid" :title="item.title"
				:isTop="item.isTop" :author="item.author" :comments="item.comments" :time="item.time" :mode="item.mode"
				:images="item.images" :showSearch="item.showSearch" :bgColor="item.bgColor">
				<!-- 具名插槽：底部搜索框 -->
				<template #tips v-if="item.showSearch">
					<view class="search-box">
						<text class="search-label">搜索：</text>
						<text class="search-tag" v-for="(tag, tIdx) in item.searchTags" :key="tIdx">{{ tag }}</text>
					</view>
				</template>
			</NewsView>
		</view>
	</view>
</template>

<script>
	// 1. 导入组件：路径和文件名必须是 NewsView.vue
	import NewsView from "@/components/NewsView.vue";

	export default {
		// 2. 注册组件：名称与导入名一致（NewsView）
		components: {
			NewsView
		},
		data() {
			return {
				datalist: [
					// 1. 纯文字置顶新闻（mode=1，isTop=true）
					{
						nid: "T15627",
						title: "14个月从100家开到1000家门店，蜜雪冰城为何买下这家精酿啤酒商",
						isTop: true,
						author: "界面新闻",
						comments: 56,
						time: "2025.10.07",
						mode: 1,
						images: [],
						showSearch: false,
						searchTags: [],
						bgColor: "#fff"
					},
					// 2. 单图非置顶新闻（mode=2，isTop=false）
					{
						nid: "B4485",
						title: "把握历史大势 共创美好未来（观沧海）",
						isTop: false,
						author: "人民日报",
						comments: 1025,
						time: "2025.10.25",
						mode: 2,
						images: ["/static/news1.jpg"], 
						showSearch: false,
						searchTags: [],
						bgColor: "#fff"
					},
					// 3. 带搜索框的纯文字新闻（mode=1，showSearch=true）
					{
						nid: "F7892",
						title: "黄金还能走多远？卖方高呼“第三浪启动”，230多份研报看多",
						isTop: false,
						author: "财联社",
						comments: 452,
						time: "2025.10.08",
						mode: 2,
						images: ["/static/news3.jpg"],
						showSearch: true,
						searchTags: ["今日金价", "黄金行情", "研报解读"],
						bgColor: "#fff"
					},
					// 4. 多图广告（mode=3，无评论数）
					{
						nid: "A9876",
						title: "加微信交友群，喜欢就聊，找喜欢的人",
						isTop: false,
						author: "我主良缘文化",
						comments: 0,
						time: "2025.10.08 09:50",
						mode: 3,
						images: ["/static/city4.jpg", "/static/city5.jpg", "/static/news4.jpg"], 
						showSearch: false,
						searchTags: [],
						bgColor: "#f9f9f9"
					},
					// 5. 单图非置顶新闻（补充示例）
					{
						nid: "J3456",
						title: "“没有短板”的完美战鹰！歼-16机库独家探访",
						isTop: false,
						author: "红星新闻",
						comments: 56,
						time: "2025.10.07",
						mode: 2,
						images: ["/static/news2.jpg"], 
						showSearch: false,
						searchTags: [],
						bgColor: "#fff"
					}
				]
			};
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

	/* 搜索框样式（页面内定义也可，或通过::v-deep继承组件样式） */
	.search-box {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #eee;
	}

	.search-label {
		font-size: 24rpx;
		color: #666;
		margin-right: 12rpx;
	}

	.search-tag {
		display: inline-block;
		padding: 8rpx 16rpx;
		background-color: #f5f5f5;
		border-radius: 20rpx;
		margin-right: 12rpx;
		margin-bottom: 12rpx;
		font-size: 22rpx;
		color: #666;
	}
</style>