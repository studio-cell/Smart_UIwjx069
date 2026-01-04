<template>
	<view class="news-container">
		<TabBanner :list="categories" :current="currentTab" @tab-click="handleTabClick"></TabBanner>

		<view class="weather-wrapper">
			<view v-if="weatherData" class="weather-card">
				<view class="weather-left">
					<text class="weather-icon">{{ getWeatherIcon(weatherData.cond) }}</text>
					<view class="temp-group">
						<text class="temp-high">{{ weatherData.high }}</text>
						<text class="temp-divider">/</text>
						<text class="temp-low">{{ weatherData.low }}</text>
					</view>
					<text class="weather-cond">{{ weatherData.cond }}</text>
				</view>
				<view class="weather-right">
					<view class="weather-item">
						<text class="item-label">日期</text>
						<text class="item-value">{{ weatherData.date }}</text>
					</view>
					<view class="weather-item">
						<text class="item-label">星期</text>
						<text class="item-value">{{ weatherData.week }}</text>
					</view>
				</view>
			</view>
			<view v-else class="weather-loading">
				<text class="loading-text">🌤️ 加载天气中...</text>
			</view>
		</view>

		<scroll-view v-if="categories.length > 0" scroll-y class="news-scroll" ref="scrollRef" :refresher-enabled="true"
			:refresher-threshold="100" :refresher-refreshing="isRefreshing" @refresherrefresh="onRefresherRefresh"
			@scrolltolower="onReachBottom">
			<!-- 刷新更新提示 -->
			<view v-if="showUpdateTip" class="update-tip">为您更新了{{ updateCount }}条内容</view>

			<!-- 骨架屏 -->
			<view v-if="loadingMore && newsList.length === 0" class="skeleton-list">
				<view class="skeleton-item" v-for="i in 5" :key="i">
					<view class="skeleton-img"></view>
					<view class="skeleton-title"></view>
					<view class="skeleton-desc"></view>
				</view>
			</view>

			<!-- 新闻列表 -->
			<view v-else class="news-list">
				<view v-for="news in filteredNews" :key="news.nid || news._id"
					@click="goToDetail(news)">
					<NewsView :nid="news.nid || news._id" :title="news.title" :is-top="news.isTop" :author="news.author"
						:comments="news.comments" :time="news.time || formatTime(news.createTime)"
						:mode="news.category === '广告' ? 3 : 2" :images="[news.cover]"
						:bgColor="news.category === '广告' ? '#f9f9f9' : '#fff'" :summary="news.summary"
						:showSearch="news.category === '广告'">
						<template v-slot:tips v-if="news.category === '广告'">
							<view class="search-box">
								<text class="search-label">广告说明：</text>
								<text class="search-tag">本内容为商业推广，不代表本平台观点</text>
							</view>
						</template>
					</NewsView>
				</view>

				<!-- 状态提示 -->
				<view v-if="loadingMore" class="loading-tip">加载中...</view>
				<view v-if="noMore && filteredNews.length > 0" class="no-more-tip">没有更多内容了</view>
				<!-- 替换为新的空数据提示 -->
				<view v-if="filteredNews.length === 0 && !loadingMore" class="empty-container">
					<image src="/static/empty.png" class="empty-img"></image>
					<text class="empty-text">暂无{{ categories[currentTab] }}新闻~</text>
					<button class="empty-btn" @click="getNewsList(true)">点击重试</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import TabBanner from "@/components/TabBanner.vue";
	import NewsView from "@/components/NewsView.vue";

	export default {
		components: {
			TabBanner,
			NewsView
		},
		data() {
			return {
				categories: [],
				newsList: [],
				currentTab: 0,
				showUpdateTip: false,
				updateCount: 0,
				isRefreshing: false,
				weatherData: null,
				page: 1,
				pageSize: 10,
				loadingMore: false,
				noMore: false,
				// 防抖标识
				isTabChanging: false
			};
		},
		computed: {
			filteredNews() {
				const category = this.categories[this.currentTab] || "推荐";
				if (category === "推荐") return this.newsList.filter(n => n.category !== '广告');
				if (category === "广告") return this.newsList.filter(n => n.category === '广告');
				return this.newsList.filter(n => n.category === category && n.category !== '广告');
			}
		},
		onLoad() {
			this.getWeather();
			this.getNewsCategories();
			this.getNewsList(true, false); // 初始加载时传入 true, false（不显示刷新提示）
		},
		onShow() {
			// 每次显示页面时打印调试信息
			console.log('当前新闻列表数量:', this.newsList.length);
			console.log('当前分类:', this.categories[this.currentTab]);
			console.log('过滤后新闻数量:', this.filteredNews.length);
		},
		methods: {
			/**
			 * 格式化时间戳为相对时间（刚刚/分钟前/小时前/天前），超过30天显示年月日
			 */
			formatTime(timestamp) {
				if (!timestamp) return "";
				// 处理时间格式：如果是字符串转Date，是时间戳转毫秒
				const newsTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
				const now = new Date().getTime();
				const diff = now - newsTime; // 时间差（毫秒）

				const minute = 60 * 1000;
				const hour = 60 * minute;
				const day = 24 * hour;

				if (diff < minute) {
					return "刚刚";
				} else if (diff < hour) {
					return `${Math.floor(diff / minute)}分钟前`;
				} else if (diff < day) {
					return `${Math.floor(diff / hour)}小时前`;
				} else if (diff < 30 * day) {
					return `${Math.floor(diff / day)}天前`;
				} else {
					// 超过30天显示原日期
					const date = new Date(newsTime);
					return `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
				}
			},

			/**
			 * 根据天气状况返回对应图标
			 */
			getWeatherIcon(cond) {
				const iconMap = {
					"晴": "☀️",
					"多云": "⛅",
					"晴转多云": "🌤️",
					"阴": "☁️",
					"雨": "🌧️",
					"小雨": "🌦️",
					"中雨": "🌧️",
					"大雨": "⛈️",
					"雪": "❄️",
					"雷阵雨": "🌩️",
					"雾": "🌫️"
				};
				return iconMap[cond] || "🌤️";
			},

			/**
			 * 获取天气数据（模拟）
			 */
			getWeather() {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				const year = tomorrow.getFullYear();
				const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
				const day = String(tomorrow.getDate()).padStart(2, '0');
				const dateStr = `${year}-${month}-${day}`;
				const weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				const weekStr = weekArr[tomorrow.getDay()];
				this.weatherData = {
					date: dateStr,
					week: weekStr,
					high: "26°C",
					low: "18°C",
					cond: "晴转多云"
				};
			},

			/**
			 * 获取新闻分类
			 */
			getNewsCategories() {
				this.categories = ["推荐", "时政", "财经", "娱乐", "体育", "科技", "广告"];
			},

			/**
			 * 获取新闻列表
			 * @param {Boolean} isRefresh - 是否为刷新操作
			 * @param {Boolean} showTip - 是否显示更新提示（初始加载时不显示）
			 */
			async getNewsList(isRefresh = false, showTip = true) {
				// 防止重复请求
				if ((isRefresh && this.isRefreshing) || (!isRefresh && this.loadingMore)) return;

				if (isRefresh) {
					this.page = 1;
					this.noMore = false;
					this.isRefreshing = true;
					this.showUpdateTip = showTip; // 根据参数决定是否显示提示
				} else {
					this.loadingMore = true;
				}

				try {
					// 获取当前分类
					const category = this.categories[this.currentTab] || "推荐";
					// 构建查询参数
					const queryData = {
						page: this.page,
						pageSize: this.pageSize,
					};

					// 非推荐分类才传category参数
					if (category !== "推荐") {
						queryData.category = category;
					}

					// 调用云函数获取新闻列表
					console.log('调用云函数，参数：', queryData);
					const res = await uniCloud.callFunction({
						name: 'news-getList',
						data: queryData
					});

					console.log('云函数返回结果：', res.result);

					if (res.result.code === 200) {
						const newsData = res.result.data.list.map(item => ({
							nid: item._id,
							title: item.title,
							author: item.author,
							comments: item.comments_count || 0,
							time: this.formatTime(item.publish_time),
							createTime: item.publish_time,
							category: item.category,
							cover: item.cover,
							summary: item.summary,
							content: item.content, // 添加content字段
							isTop: item.is_top
						}));

						console.log('解析后的新闻数据数量：', newsData.length);
						console.log('解析后的新闻数据：', newsData);

						// 如果返回的数据太少（少于3条），可能有问题，使用本地数据
						if (newsData.length < 3 && res.result.data.total < 3) {
							console.warn('云数据库数据量不足，使用本地模拟数据');
							throw new Error('数据量不足');
						}

						if (isRefresh) {
							this.newsList = newsData;
							this.updateCount = newsData.length;
							setTimeout(() => this.showUpdateTip = false, 3000);
						} else {
							this.newsList = [...this.newsList, ...newsData];
						}

						// 判断是否还有更多数据
						this.noMore = this.newsList.length >= res.result.data.total;
					} else {
						throw new Error(res.result.message || '获取新闻失败');
					}
				} catch (error) {
					console.error('获取新闻列表失败，使用本地模拟数据：', error);
					// 云函数失败时，使用本地模拟数据
					const category = this.categories[this.currentTab] || "推荐";
					this.getMockNewsList(isRefresh, category);
				} finally {
					this.isRefreshing = false;
					this.loadingMore = false;
					this.isTabChanging = false;
				}
			},

			/**
			 * 获取本地模拟新闻数据
			 */
			getMockNewsList(isRefresh, category) {
				// 模拟新闻数据
				const mockNewsList = [
					{
						nid: 'n1001',
						title: '2025央行降准0.5个百分点，释放长期资金约1万亿元',
						author: '财经时报',
						comments: 1256,
						time: this.formatTime(new Date(Date.now() - 2 * 60 * 60 * 1000).getTime()),
						createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(),
						category: '财经',
						cover: 'https://picsum.photos/400/200?random=1',
						summary: '央行今日宣布降准，旨在支持实体经济发展，降低企业融资成本...',
						content: '<p>中国人民银行今日宣布，为支持实体经济发展，降低社会融资成本，决定于近期实施降准措施，下调金融机构存款准备金率0.5个百分点。</p><p>此次降准将释放长期资金约1万亿元，为银行体系提供低成本、长期稳定的流动性资金。</p><p>分析人士指出，降准有助于保持银行体系流动性合理充裕，引导货币信贷平稳适度增长，为经济高质量发展营造适宜的货币金融环境。</p><p>同时，降准也体现了国家稳健货币政策灵活适度的特点，有助于稳定市场预期，提振市场信心。</p><p>业内专家表示，此次降准对小微企业和个体工商户等实体经济主体将产生积极影响，有利于降低企业融资成本，激发市场主体活力。</p>',
						isTop: true
					},
					{
						nid: 'n1002',
						title: '2025亚运会中国队斩获第100枚金牌，创历史新高',
						author: '体育周报',
						comments: 8950,
						time: this.formatTime(new Date(Date.now() - 5 * 60 * 1000).getTime()),
						createTime: new Date(Date.now() - 5 * 60 * 1000).getTime(),
						category: '体育',
						cover: 'https://picsum.photos/400/200?random=2',
						summary: '在刚刚结束的亚运会比赛中，中国队在跳水项目再夺一金，金牌总数突破100枚...',
						content: '<p>在刚刚结束的亚运会跳水女子10米台决赛中，中国选手以完美表现夺得金牌，这是中国代表团在本届亚运会上获得的第100枚金牌，创造了历史新高。</p><p>比赛中，中国选手从第一跳开始就展现出了强大的实力，每一跳都得到了裁判的高度认可，最终以总分领先第二名的巨大优势夺冠。</p><p>截至目前，中国代表团在亚运会金牌榜上遥遥领先，展现了体育强国的雄厚实力。</p><p>中国体育代表团的优秀表现，不仅为国争光，也激励着全国人民为实现体育强国梦而努力奋斗。</p><p>亚运会作为亚洲最高水平的综合性运动会，各国选手在这里切磋技艺，增进友谊，共同推动亚洲体育事业的发展。</p>',
						isTop: false
					},
					{
						nid: 'n1003',
						title: '人工智能大模型迎来重大突破，可自主完成复杂任务',
						author: '科技前沿',
						comments: 3580,
						time: this.formatTime(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).getTime()),
						createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).getTime(),
						category: '科技',
						cover: 'https://picsum.photos/400/200?random=3',
						summary: '国内科技企业发布新一代AI大模型，具备自主学习和决策能力，应用场景覆盖多个领域...',
						content: '<p>国内知名科技企业今日发布了新一代人工智能大模型，该模型在自主学习和决策能力方面取得重大突破，引起了业界广泛关注。</p><p>据介绍，这款AI大模型采用最新的深度学习技术，能够理解和处理自然语言，具备强大的推理和创造能力。</p><p>在实际应用中，该模型可以自主完成包括文档撰写、代码生成、数据分析等在内的复杂任务，大大提升了工作效率。</p><p>专家表示，这一突破标志着人工智能技术进入了新的发展阶段，将在教育、医疗、金融等多个领域产生深远影响。</p><p>同时，企业也强调将坚持技术向善的理念，确保AI技术的安全和可控，为社会发展提供助力。</p>',
						isTop: false
					},
					{
						nid: 'n1004',
						title: '2025全国两会重点关注民生问题，多领域政策将调整',
						author: '时政新闻',
						comments: 6890,
						time: this.formatTime(new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).getTime()),
						createTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).getTime(),
						category: '时政',
						cover: 'https://picsum.photos/400/200?random=4',
						summary: '全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点...',
						content: '<p>全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点，预计将有多个领域的政策进行调整和优化。</p><p>教育方面，有望出台措施减轻学生课业负担，推进教育公平；医疗方面，将进一步完善医保体系，提升基层医疗服务能力。</p><p>养老方面，将加大养老服务供给，完善养老保障体系，让老年人安享晚年。</p><p>此外，住房保障、就业促进、食品安全等民生问题也将得到重点关注和解决。</p><p>这些政策的调整和完善，将切实改善人民群众的生活质量，提升人民群众的获得感、幸福感、安全感。</p>',
						isTop: true
					},
					{
						nid: 'n1005',
						title: '热门电影票房突破50亿，成年度票房冠军',
						author: '娱乐星探',
						comments: 9870,
						time: this.formatTime(new Date(Date.now() - 10 * 1000).getTime()),
						createTime: new Date(Date.now() - 10 * 1000).getTime(),
						category: '娱乐',
						cover: 'https://picsum.photos/400/200?random=5',
						summary: '某国产电影上映10天票房突破50亿，刷新多项票房纪录...',
						content: '<p>某国产电影上映10天票房突破50亿，刷新多项票房纪录，成为年度票房冠军。</p><p>该片以精彩的剧情、精湛的制作和深刻的主题，赢得了观众和影评人的广泛好评。</p><p>影片讲述了一个关于梦想、奋斗和成长的故事，触动了无数观众的心弦，引发了社会各界的深入思考。</p><p>业内人士表示，这部电影的成功标志着中国电影产业的成熟和发展，也展现了国产电影的市场潜力和文化影响力。</p><p>随着电影市场的不断壮大，未来将会有更多优秀的国产电影涌现，为观众带来更多精彩的作品。</p>',
						isTop: false
					},
					{
						nid: 'ad1001',
						title: '【广告】新款智能手机限时特惠，立减800元',
						author: '品牌官方',
						comments: 0,
						time: this.formatTime(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()),
						createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
						category: '广告',
						cover: 'https://picsum.photos/400/200?random=6',
						summary: '新款旗舰手机搭载最新处理器，限时优惠活动进行中...',
						content: '<p>新款旗舰手机搭载最新处理器，限时优惠活动进行中，立减800元。</p><p>该手机采用全新设计语言，配备高清全面屏，拍照效果惊艳，续航能力出色。</p><p>现在购买即可享受超值优惠，数量有限，先到先得。</p>',
						isTop: false
					}
				];

				// 根据分类筛选
				let filteredList = mockNewsList;
				if (category === "推荐") {
					filteredList = mockNewsList.filter(n => n.category !== '广告');
				} else if (category !== "广告") {
					filteredList = mockNewsList.filter(n => n.category === category);
				}

				// 更新新闻列表
				if (isRefresh) {
					this.newsList = filteredList;
					this.updateCount = filteredList.length;
					setTimeout(() => this.showUpdateTip = false, 3000);
					uni.showToast({
						title: '已加载本地数据',
						icon: 'none'
					});
				} else {
					// 初始加载或加载更多时也要更新列表
					if (this.page === 1) {
						this.newsList = filteredList;
					} else {
						this.newsList = [...this.newsList, ...filteredList];
					}
					this.noMore = true; // 模拟数据只有一页
				}
			},

			/**
			 * 处理标签切换
			 */
			handleTabClick(index) {
				// 防抖处理：避免快速切换重复请求
				if (this.isTabChanging || index === this.currentTab) return;

				this.isTabChanging = true;
				this.currentTab = index;
				this.page = 1;
				this.noMore = false;
				this.getNewsList();

				// 滚动到顶部
				this.$nextTick(() => {
					const scrollView = this.$refs.scrollRef;
					if (scrollView) {
						scrollView.scrollTo({
							scrollTop: 0,
							duration: 300
						});
					}
				});
			},

				/**
				 * 跳转到新闻详情页
				 */
			goToDetail(newsItem) {
				// 兼容两种参数：传对象或传nid字符串
				let news;
				if (typeof newsItem === 'object') {
					news = newsItem;
				} else {
					news = this.newsList.find(item => (item.nid || item._id) === newsItem);
				}

				if (!news) {
					uni.showToast({
						title: "新闻数据异常",
						icon: "none"
					});
					return;
				}

				if (news.category === '广告') {
					uni.showToast({
						title: "广告内容暂无法查看详情",
						icon: "none"
					});
					return;
				}

				const nid = news.nid || news._id;
				uni.navigateTo({
					url: `/pages/newsDetail/NewsDetail?nid=${nid}`,
					success: (res) => {
						res.eventChannel.emit('transferNewsData', {
							news: news,
							newsList: this.newsList
						});
					}
				});
			},

			/**
			 * scroll-view 下拉刷新
			 */
			onRefresherRefresh() {
				this.getNewsList(true);
			},

			/**
			 * 上拉加载更多
			 */
			onReachBottom() {
				if (!this.noMore && !this.loadingMore && !this.isRefreshing) {
					this.page += 1;
					this.getNewsList();
				}
			}
		},
		onHide() {
			uni.hideTabBarRedDot({
				index: 0
			});
		},
		onUnmounted() {
			this.isRefreshing = false;
		}
	};
</script>

<style scoped>
	.news-container {
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.weather-wrapper {
		padding: 0 20rpx 16rpx;
	}

	.weather-card {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		border-radius: 12rpx;
		padding: 16rpx 20rpx;
		color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.15);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.weather-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.weather-icon {
		font-size: 36rpx;
	}

	.temp-group {
		display: flex;
		align-items: baseline;
	}

	.temp-high {
		font-size: 32rpx;
		font-weight: bold;
		line-height: 1;
	}

	.temp-divider {
		font-size: 18rpx;
		margin: 0 4rpx;
		opacity: 0.8;
	}

	.temp-low {
		font-size: 20rpx;
		opacity: 0.8;
	}

	.weather-cond {
		font-size: 20rpx;
		margin-left: 8rpx;
	}

	.weather-right {
		display: flex;
		gap: 20rpx;
	}

	.weather-item {
		text-align: center;
	}

	.item-label {
		display: block;
		font-size: 16rpx;
		opacity: 0.7;
		margin-bottom: 2rpx;
	}

	.item-value {
		font-size: 18rpx;
		font-weight: 500;
	}

	.weather-loading {
		text-align: center;
		padding: 16rpx 0;
	}

	.loading-text {
		font-size: 20rpx;
		color: #999;
	}

	.news-scroll {
		height: calc(100vh - 120rpx - 100rpx);
		padding: 0 20rpx 20rpx;
	}

	.update-tip {
		background-color: #d00;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		padding: 12rpx;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 骨架屏样式 */
	.skeleton-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.skeleton-item {
		display: flex;
		gap: 15rpx;
		padding: 10rpx;
	}

	.skeleton-img {
		width: 120rpx;
		height: 120rpx;
		background: #eee;
		border-radius: 8rpx;
		animation: flash 1s infinite alternate;
	}

	.skeleton-title {
		flex: 1;
		height: 30rpx;
		background: #eee;
		border-radius: 4rpx;
		animation: flash 1s infinite alternate;
	}

	.skeleton-desc {
		flex: 1;
		height: 20rpx;
		background: #eee;
		margin-top: 10rpx;
		border-radius: 4rpx;
		animation: flash 1s infinite alternate;
	}

	@keyframes flash {
		from {
			opacity: 0.5;
		}

		to {
			opacity: 1;
		}
	}

	/* 新闻列表样式 */
	.news-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 提示文本样式 */
	.loading-tip,
	.no-more-tip {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}

	/* 新增空数据提示样式 */
	.empty-container {
		text-align: center;
		padding: 50rpx 0;
	}

	.empty-img {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.empty-btn {
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border-radius: 30rpx;
	}

	/* 广告搜索框样式 */
	.search-box {
		padding: 10rpx;
		margin-top: 10rpx;
	}

	.search-label {
		font-size: 22rpx;
		color: #666;
	}

	.search-tag {
		font-size: 20rpx;
		color: #999;
		margin-left: 10rpx;
	}
</style>