<template>
	<view class="test-page">
		<view class="header">
			<text class="title">🧪 评论功能测试</text>
		</view>

		<view class="section">
			<view class="section-title">1. 测试获取评论列表</view>
			<input class="input-field" placeholder="输入新闻ID" v-model="testNewsId" />
			<button class="test-btn" @click="testGetComments">获取评论</button>
			<view v-if="testResult.getList" class="result-box" :class="testResult.getList.success ? 'success' : 'error'">
				<text>{{ testResult.getList.msg }}</text>
				<text v-if="testResult.getList.count" class="detail">共 {{ testResult.getList.count }} 条评论</text>
			</view>
		</view>

		<view class="section">
			<view class="section-title">2. 测试发布评论</view>
			<input class="input-field" placeholder="输入新闻ID" v-model="addCommentNewsId" />
			<textarea class="textarea-field" placeholder="输入评论内容" v-model="addCommentContent"></textarea>
			<button class="test-btn" @click="testAddComment">发布评论</button>
			<view v-if="testResult.addComment" class="result-box" :class="testResult.addComment.success ? 'success' : 'error'">
				<text>{{ testResult.addComment.msg }}</text>
			</view>
		</view>

		<view class="section">
			<view class="section-title">3. 当前登录用户信息</view>
			<view class="user-info-box">
				<text class="info-label">用户ID：</text>
				<text class="info-value">{{ userInfo.userId || '未登录' }}</text>
			</view>
			<view class="user-info-box">
				<text class="info-label">用户名：</text>
				<text class="info-value">{{ userInfo.username || userInfo.nickname || '未登录' }}</text>
			</view>
			<view class="user-info-box">
				<text class="info-label">登录状态：</text>
				<text class="info-value">{{ userInfo.isLogin ? '已登录' : '未登录' }}</text>
			</view>
		</view>

		<view class="tips">
			<text class="tips-text">💡 提示：</text>
			<text class="tips-text">1. 确保已登录（否则无法发布评论）</text>
			<text class="tips-text">2. 确保新闻ID正确</text>
			<text class="tips-text">3. 确保云函数已上传部署</text>
			<text class="tips-text">4. 查看控制台日志获取详细信息</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			testNewsId: '',
			addCommentNewsId: '',
			addCommentContent: '',
			userInfo: {},
			testResult: {
				getList: null,
				addComment: null
			}
		};
	},
	onLoad() {
		// 获取当前用户信息
		this.userInfo = uni.getStorageSync('userInfo') || {};

		// 如果没有测试新闻ID，设置一个默认值
		if (!this.testNewsId) {
			this.testNewsId = 'default_news_id';
		}
		if (!this.addCommentNewsId) {
			this.addCommentNewsId = 'default_news_id';
		}
	},
	methods: {
		// 测试获取评论列表
		async testGetComments() {
			this.testResult.getList = { success: false, msg: '查询中...' };

			if (!this.testNewsId) {
				this.testResult.getList = {
					success: false,
					msg: '❌ 请输入新闻ID'
				};
				return;
			}

			try {
				const res = await uniCloud.callFunction({
					name: 'comment-getList',
					data: {
						newsId: this.testNewsId,
						page: 1,
						pageSize: 10
					}
				});

				console.log('获取评论结果：', res);

				if (res.result.code === 200) {
					const count = res.result.data.list.length;
					this.testResult.getList = {
						success: true,
						msg: '✅ 获取成功',
						count: count
					};
					console.log('评论数据：', res.result.data.list);
				} else {
					this.testResult.getList = {
						success: false,
						msg: '❌ ' + res.result.message
					};
				}
			} catch (error) {
				console.error('获取评论失败：', error);
				this.testResult.getList = {
					success: false,
					msg: '❌ 请求失败: ' + error.message
				};
			}
		},

		// 测试发布评论
		async testAddComment() {
			this.testResult.addComment = { success: false, msg: '发布中...' };

			// 检查是否登录
			if (!this.userInfo || !this.userInfo.isLogin) {
				this.testResult.addComment = {
					success: false,
					msg: '❌ 请先登录'
				};
				return;
			}

			// 检查参数
			if (!this.addCommentNewsId) {
				this.testResult.addComment = {
					success: false,
					msg: '❌ 请输入新闻ID'
				};
				return;
			}
			if (!this.addCommentContent.trim()) {
				this.testResult.addComment = {
					success: false,
					msg: '❌ 请输入评论内容'
				};
				return;
			}

			try {
				const res = await uniCloud.callFunction({
					name: 'comment-add',
					data: {
						newsId: this.addCommentNewsId,
						content: this.addCommentContent,
						userId: this.userInfo.userId,
						username: this.userInfo.username || this.userInfo.nickname
					}
				});

				console.log('发布评论结果：', res);

				if (res.result.code === 200) {
					this.testResult.addComment = {
						success: true,
						msg: '✅ 发布成功'
					};
					this.addCommentContent = ''; // 清空输入框
				} else {
					this.testResult.addComment = {
						success: false,
						msg: '❌ ' + res.result.message
					};
				}
			} catch (error) {
				console.error('发布评论失败：', error);
				this.testResult.addComment = {
					success: false,
					msg: '❌ 请求失败: ' + error.message
				};
			}
		}
	}
};
</script>

<style scoped>
	.test-page {
		padding: 30rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.section {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.input-field,
	.textarea-field {
		width: 100%;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		padding: 15rpx;
		margin-bottom: 15rpx;
		font-size: 26rpx;
		background-color: #f9f9f9;
	}

	.textarea-field {
		height: 150rpx;
		resize: none;
	}

	.test-btn {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #007aff;
		color: #fff;
		font-size: 28rpx;
		border-radius: 8rpx;
		margin-top: 10rpx;
	}

	.result-box {
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		line-height: 1.6;
	}

	.result-box.success {
		background-color: #f0f9ff;
		border: 1px solid #67c23a;
		color: #67c23a;
	}

	.result-box.error {
		background-color: #fef0f0;
		border: 1px solid #f56c6c;
		color: #f56c6c;
	}

	.detail {
		display: block;
		margin-top: 10rpx;
		font-size: 22rpx;
		color: #666;
	}

	.user-info-box {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
		padding: 15rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
	}

	.info-label {
		font-size: 24rpx;
		color: #666;
		width: 150rpx;
	}

	.info-value {
		font-size: 24rpx;
		color: #333;
		flex: 1;
	}

	.tips {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-top: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.tips-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.8;
		display: block;
		margin-bottom: 8rpx;
	}
</style>
