<template>
	<view class="register-container">
		<view class="register-box">
			<view class="title">注册</view>
			<!-- 用户名输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入用户名（3-12位）" v-model="username" />
				<text class="error-tip" v-if="usernameError">{{ usernameError }}</text>
			</view>
			<!-- 密码输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" type="password" placeholder="请输入密码（6-16位）" v-model="password" />
				<text class="error-tip" v-if="passwordError">{{ passwordError }}</text>
			</view>
			<!-- 确认密码输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" type="password" placeholder="确认密码" v-model="confirmPassword" />
				<text class="error-tip" v-if="confirmPwdError">{{ confirmPwdError }}</text>
			</view>
			<!-- 注册按钮（表单无效时禁用） -->
			<button class="register-btn" @click="handleRegister" :disabled="!isFormValid">注册</button>
			<view class="navigate-text">
				已有账号？<navigator url="/pages/login/login">去登录</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: '',
				// 错误提示文本
				usernameError: '',
				passwordError: '',
				confirmPwdError: '',
				// 表单是否有效（控制按钮禁用状态）
				isFormValid: false
			};
		},
		watch: {
			// 实时监听输入变化，校验表单
			username() {
				this.validateUsername();
				this.checkFormValid();
			},
			password() {
				this.validatePassword();
				this.checkConfirmPwd();
				this.checkFormValid();
			},
			confirmPassword() {
				this.checkConfirmPwd();
				this.checkFormValid();
			}
		},
		methods: {
			// 校验用户名：3-12位，支持字母、数字、下划线
			validateUsername() {
				const reg = /^[a-zA-Z0-9_]{3,12}$/;
				if (!this.username) {
					this.usernameError = '用户名不能为空';
				} else if (!reg.test(this.username)) {
					this.usernameError = '用户名需为3-12位字母、数字或下划线';
				} else {
					this.usernameError = '';
				}
			},
			// 校验密码：6-16位，需包含字母+数字（增强安全性）
			validatePassword() {
				const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;
				if (!this.password) {
					this.passwordError = '密码不能为空';
				} else if (!reg.test(this.password)) {
					this.passwordError = '密码需为6-16位，含字母和数字';
				} else {
					this.passwordError = '';
				}
			},
			// 校验确认密码：与密码一致
			checkConfirmPwd() {
				if (!this.confirmPassword) {
					this.confirmPwdError = '请确认密码';
				} else if (this.confirmPassword !== this.password) {
					this.confirmPwdError = '两次密码输入不一致';
				} else {
					this.confirmPwdError = '';
				}
			},
			// 检查表单是否全部有效（无错误提示+输入不为空）
			checkFormValid() {
				this.isFormValid = !this.usernameError && !this.passwordError && !this.confirmPwdError &&
					this.username && this.password && this.confirmPassword;
			},
			// 注册核心逻辑
			handleRegister() {
				// 再次校验（防止绕过实时监听直接点击按钮）
				this.validateUsername();
				this.validatePassword();
				this.checkConfirmPwd();
				this.checkFormValid();

				if (!this.isFormValid) return; // 表单无效则终止

				// 模拟注册请求（实际项目替换为 uni.request 调用后端接口）
				uni.showLoading({
					title: '注册中...'
				});

				setTimeout(() => {
					uni.hideLoading();

					// 模拟注册成功：将用户信息存入本地存储（供登录页校验）
					uni.setStorageSync('registeredUsers', [
						...(uni.getStorageSync('registeredUsers') || []), // 保留已有注册用户
						{
							username: this.username,
							password: this.password
						} // 新增当前注册用户
					]);

					// 提示+跳转登录页
					uni.showToast({
						title: '注册成功！',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1500);

					// 清空表单
					this.username = '';
					this.password = '';
					this.confirmPassword = '';
				}, 1200);
			}
		}
	};
</script>

<style scoped>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f7f7f7;
	}

	.register-box {
		width: 80%;
		max-width: 500rpx;
		background-color: #fff;
		padding: 40rpx;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 30rpx;
	}

	/* 输入框组（包含输入框+错误提示） */
	.input-group {
		margin-bottom: 20rpx;
	}

	.input-field {
		width: 100%;
		height: 60rpx;
		border: 1px solid #ccc;
		border-radius: 6rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
	}

	/* 错误提示文本 */
	.error-tip {
		font-size: 22rpx;
		color: #ff3333;
		margin-top: 8rpx;
		display: block;
	}

	.register-btn {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 6rpx;
	}

	/* 按钮禁用状态样式 */
	.register-btn:disabled {
		background-color: #ccc;
		color: #fff;
	}

	.navigate-text {
		text-align: center;
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #666;
	}
</style>