<template>
	<view class="edit-user-container">
		<!-- 页面标题 -->
		<view class="page-title">编辑用户信息</view>

		<!-- 编辑表单 -->
		<view class="edit-form">
			<view class="form-item">
				<label class="form-label">用户名：</label>
				<input class="form-input" v-model="username" placeholder="请输入用户名" disabled <!-- 用户名建议禁用修改，避免冲突 -->
				/>
			</view>

			<view class="form-item">
				<label class="form-label">密码：</label>
				<input class="form-input" v-model="password" placeholder="密码（不填则不修改）" type="password" />
			</view>

			<view class="form-item">
				<label class="form-label">昵称：</label>
				<input class="form-input" v-model="nickname" placeholder="请输入昵称" />
			</view>

			<view class="form-item">
				<label class="form-label">手机号：</label>
				<input class="form-input" v-model="mobile" placeholder="请输入手机号" type="number" />
			</view>

			<view class="form-item">
				<label class="form-label">邮箱：</label>
				<input class="form-input" v-model="email" placeholder="请输入邮箱" />
			</view>

			<!-- 保存按钮 -->
			<button class="submit-btn" @click="submitEdit">保存修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "editUser",
		data() {
			return {
				id: '', // 接收的用户ID
				username: '', // 用户名
				password: '', // 密码（可选修改）
				nickname: '', // 昵称
				mobile: '', // 手机号
				email: '' // 邮箱
			};
		},
		// 页面加载时接收参数并查询用户信息
		onLoad(options) {
			if (!options.id) { // 校验是否传入ID
				uni.showToast({
					title: '用户ID缺失',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack(); // 返回上一页
				}, 1500);
				return;
			}
			this.id = options.id; // 接收列表页传入的用户ID
			this.getUserInfo(); // 查询该用户的原有信息
		},
		methods: {
			// 1. 查询单个用户的原有信息
			getUserInfo() {
				uni.showLoading({
					title: '加载中...'
				});
				uniCloud.callFunction({
					name: 'getUserById', // 需部署对应的查询单用户云函数
					data: {
						id: this.id
					},
					success: (res) => {
						uni.hideLoading();
						console.log('用户详情：', res);
						if (res.result.code === 200 && res.result.data) {
							const user = res.result.data;
							// 赋值到表单，回显原有信息
							this.username = user.username || '';
							this.nickname = user.nickname || '';
							this.mobile = user.mobile || '';
							this.email = user.email || '';
						} else {
							uni.showToast({
								title: res.result.message || '查询用户信息失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('查询用户失败：', err);
						uni.showToast({
							title: '网络异常，加载失败',
							icon: 'none'
						});
					}
				});
			},
			// 2. 提交修改（保存编辑）
			submitEdit() {
				// 基础校验：昵称/手机号/邮箱至少填一项（密码可选）
				if (!this.nickname && !this.mobile && !this.email && !this.password) {
					uni.showToast({
						title: '请填写至少一项修改内容',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '保存中...'
				});
				uniCloud.callFunction({
					name: 'editUser', // 需部署对应的编辑云函数
					data: {
						id: this.id,
						username: this.username,
						password: this.password, // 不填则云函数忽略该字段
						nickname: this.nickname,
						mobile: this.mobile,
						email: this.email
					},
					success: (res) => {
						uni.hideLoading();
						if (res.result.code === 200) {
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack(); // 返回用户列表页
							}, 1500);
						} else {
							uni.showToast({
								title: res.result.message || '修改失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('保存修改失败：', err);
						uni.showToast({
							title: '网络异常，保存失败',
							icon: 'none'
						});
					}
				});
			}
		}
	};
</script>

<style scoped>
	.edit-user-container {
		padding: 20rpx;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.page-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		color: #333;
	}

	.edit-form {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.form-label {
		width: 120rpx;
		font-size: 28rpx;
		color: #333;
	}

	.form-input {
		flex: 1;
		height: 60rpx;
		border: 1px solid #eee;
		border-radius: 6rpx;
		padding: 0 15rpx;
		font-size: 26rpx;
	}

	.submit-btn {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 6rpx;
		font-size: 30rpx;
		margin-top: 20rpx;
	}
</style>