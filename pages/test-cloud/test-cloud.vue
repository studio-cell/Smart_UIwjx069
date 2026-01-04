<template>
	<view class="test-container">
		<view class="header">
			<text class="title">🔧 云函数测试工具</text>
		</view>

		<view class="test-section">
			<view class="section-title">1. 测试云函数连接</view>
			<button class="test-btn" @click="testConnection">测试连接</button>
			<view v-if="testResult.connection" class="result-box" :class="testResult.connection.success ? 'success' : 'error'">
				<text>{{ testResult.connection.msg }}</text>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">2. 测试新闻列表</view>
			<button class="test-btn" @click="testNewsList">获取新闻</button>
			<view v-if="testResult.newsList" class="result-box" :class="testResult.newsList.success ? 'success' : 'error'">
				<text>{{ testResult.newsList.msg }}</text>
				<text v-if="testResult.newsList.success" class="detail">共 {{ testResult.newsList.count }} 条新闻</text>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">3. 测试用户登录</view>
			<input class="input-field" placeholder="用户名" v-model="username" />
			<input class="input-field" type="password" placeholder="密码" v-model="password" />
			<button class="test-btn" @click="testLogin">登录测试</button>
			<view v-if="testResult.login" class="result-box" :class="testResult.login.success ? 'success' : 'error'">
				<text>{{ testResult.login.msg }}</text>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">4. 测试数据库查询</view>
			<button class="test-btn" @click="testDatabase">查询数据库</button>
			<view v-if="testResult.database" class="result-box" :class="testResult.database.success ? 'success' : 'error'">
				<text>{{ testResult.database.msg }}</text>
			</view>
		</view>

		<view class="tips">
			<text class="tips-title">💡 使用提示</text>
			<text class="tips-text">1. 确保已关联 uniCloud 云服务空间</text>
			<text class="tips-text">2. 确保云函数已上传部署</text>
			<text class="tips-text">3. 确保数据库表已创建并导入数据</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: 'admin',
			password: '123456',
			testResult: {
				connection: null,
				newsList: null,
				login: null,
				database: null
			}
		};
	},
	methods: {
		// 测试云函数连接
		async testConnection() {
			this.testResult.connection = { success: false, msg: '测试中...' };
			try {
				// 调用一个简单的云函数测试连接
				const res = await uniCloud.callFunction({
					name: 'news-getList',
					data: { page: 1, pageSize: 1 }
				});
				if (res.result.code === 200) {
					this.testResult.connection = {
						success: true,
						msg: '✅ 云函数连接成功'
					};
				} else {
					this.testResult.connection = {
						success: false,
						msg: '❌ 云函数返回错误: ' + res.result.message
					};
				}
			} catch (error) {
				this.testResult.connection = {
					success: false,
					msg: '❌ 连接失败: ' + error.message
				};
			}
		},

		// 测试新闻列表
		async testNewsList() {
			this.testResult.newsList = { success: false, msg: '获取中...' };
			try {
				const res = await uniCloud.callFunction({
					name: 'news-getList',
					data: {
						page: 1,
						pageSize: 10
					}
				});
				if (res.result.code === 200) {
					const count = res.result.data.list.length;
					this.testResult.newsList = {
						success: true,
						msg: '✅ 新闻列表获取成功',
						count: count
					};
					console.log('新闻数据：', res.result.data.list);
				} else {
					this.testResult.newsList = {
						success: false,
						msg: '❌ 获取失败: ' + res.result.message
					};
				}
			} catch (error) {
				this.testResult.newsList = {
					success: false,
					msg: '❌ 请求失败: ' + error.message
				};
			}
		},

		// 测试用户登录
		async testLogin() {
			this.testResult.login = { success: false, msg: '登录中...' };
			try {
				const res = await uniCloud.callFunction({
					name: 'userLogin',
					data: {
						username: this.username,
						password: this.password
					}
				});
				if (res.result.code === 200) {
					this.testResult.login = {
						success: true,
						msg: '✅ 登录成功: ' + res.result.account.username
					};
				} else {
					this.testResult.login = {
						success: false,
						msg: '❌ 登录失败: ' + res.result.message
					};
				}
			} catch (error) {
				this.testResult.login = {
					success: false,
					msg: '❌ 请求失败: ' + error.message
				};
			}
		},

		// 测试数据库查询
		async testDatabase() {
			this.testResult.database = { success: false, msg: '查询中...' };
			try {
				const db = uniCloud.database();
				const res = await db.collection('Accounts').limit(1).get();

				if (res.result && res.result.data) {
					const count = res.result.data.length;
					this.testResult.database = {
						success: true,
						msg: `✅ 数据库查询成功，Accounts 表有数据`
					};
					console.log('数据库数据：', res.result.data);
				} else {
					this.testResult.database = {
						success: false,
						msg: '❌ 查询结果异常'
					};
				}
			} catch (error) {
				this.testResult.database = {
					success: false,
					msg: '❌ 查询失败: ' + error.message
				};
			}
		}
	}
};
</script>

<style scoped>
	.test-container {
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

	.test-section {
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

	.input-field {
		width: 100%;
		height: 60rpx;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		padding: 0 20rpx;
		margin-bottom: 15rpx;
		font-size: 26rpx;
		background-color: #f9f9f9;
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

	.tips {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-top: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.tips-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
		display: block;
	}

	.tips-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.8;
		display: block;
		margin-bottom: 8rpx;
	}
</style>
