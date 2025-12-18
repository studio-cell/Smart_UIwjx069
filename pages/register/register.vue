<template>
	<view class="register-container">
		<view class="register-box">
			<view class="title">注册</view>
			<!-- 用户名输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入用户名（3-12位）" v-model="username" />
				<text class="error-tip" v-if="usernameError">{{ usernameError }}</text>
			</view>
			<!-- 昵称输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入昵称（2-10位）" v-model="nickname" />
				<text class="error-tip" v-if="nicknameError">{{ nicknameError }}</text>
			</view>
			<!-- 手机号输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入手机号" v-model="mobile" type="number" />
				<text class="error-tip" v-if="mobileError">{{ mobileError }}</text>
			</view>
			<!-- 邮箱输入框 + 错误提示 -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入邮箱" v-model="email" />
				<text class="error-tip" v-if="emailError">{{ emailError }}</text>
			</view>
			<!-- 新增：出生年份（云函数必填） -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入出生年份（1950-2020）" v-model="birthYear" type="number" />
				<text class="error-tip" v-if="birthYearError">{{ birthYearError }}</text>
			</view>
			<!-- 新增：城市（address.city 云函数必填） -->
			<view class="input-group">
				<input class="input-field" placeholder="请输入城市" v-model="city" />
				<text class="error-tip" v-if="cityError">{{ cityError }}</text>
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
				nickname: '', // 昵称（对应UserInfo.name）
				mobile: '',
				email: '',
				birthYear: '', // 新增：出生年份
				city: '', // 新增：城市（address.city）
				password: '',
				confirmPassword: '',
				// 错误提示文本
				usernameError: '',
				nicknameError: '',
				mobileError: '',
				emailError: '',
				birthYearError: '', // 新增：出生年份错误提示
				cityError: '', // 新增：城市错误提示
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
			nickname() {
				this.validateNickname();
				this.checkFormValid();
			},
			mobile() {
				this.validateMobile();
				this.checkFormValid();
			},
			email() {
				this.validateEmail();
				this.checkFormValid();
			},
			birthYear() { // 新增：监听出生年份
				this.validateBirthYear();
				this.checkFormValid();
			},
			city() { // 新增：监听城市
				this.validateCity();
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
			// 校验昵称（2-10位，支持中文、字母、数字）
			validateNickname() {
				const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/;
				if (!this.nickname) {
					this.nicknameError = '昵称不能为空';
				} else if (!reg.test(this.nickname)) {
					this.nicknameError = '昵称需为2-10位中文、字母或数字';
				} else {
					this.nicknameError = '';
				}
			},
			// 校验手机号（11位有效手机号）
			validateMobile() {
				const reg = /^1[3-9]\d{9}$/;
				if (!this.mobile) {
					this.mobileError = '手机号不能为空';
				} else if (!reg.test(this.mobile)) {
					this.mobileError = '请输入有效的11位手机号';
				} else {
					this.mobileError = '';
				}
			},
			// 校验邮箱格式
			validateEmail() {
				const reg = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
				if (!this.email) {
					this.emailError = '邮箱不能为空';
				} else if (!reg.test(this.email)) {
					this.emailError = '请输入有效的邮箱地址';
				} else {
					this.emailError = '';
				}
			},
			// 新增：校验出生年份
			validateBirthYear() {
				const year = Number(this.birthYear);
				if (!this.birthYear) {
					this.birthYearError = '出生年份不能为空';
				} else if (year < 1950 || year > 2020) {
					this.birthYearError = '出生年份需在1950-2020之间';
				} else {
					this.birthYearError = '';
				}
			},
			// 新增：校验城市
			validateCity() {
				if (!this.city) {
					this.cityError = '城市不能为空';
				} else {
					this.cityError = '';
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
			// 检查表单是否全部有效（包含新增字段）
			checkFormValid() {
				this.isFormValid = !this.usernameError && !this.nicknameError && !this.mobileError &&
					!this.emailError && !this.birthYearError && !this.cityError && !this.passwordError &&
					!this.confirmPwdError && this.username && this.nickname && this.mobile && this.email &&
					this.birthYear && this.city && this.password && this.confirmPassword;
			},
			// 注册核心逻辑（合并 submitAddUser 逻辑，保留原有校验）
			handleRegister() {
				// 再次校验（防止绕过实时监听）
				this.validateUsername();
				this.validateNickname();
				this.validateMobile();
				this.validateEmail();
				this.validateBirthYear();
				this.validateCity();
				this.validatePassword();
				this.checkConfirmPwd();
				this.checkFormValid();

				if (!this.isFormValid) return;

				// 构造提交给云函数的参数（整合 submitAddUser 的 formData 逻辑）
				const formData = {
					username: this.username,
					password: this.password,
					nickname: this.nickname,
					mobile: this.mobile,
					email: this.email,
					userInfo: {
						name: this.nickname,
						birth_year: Number(this.birthYear),
						mobile: this.mobile,
						email: this.email,
						address: {
							city: this.city,
							street: ''
						},
						intro: ''
					}
				};

				// 调用注册云函数（优化错误提示和日志）
				uniCloud.callFunction({
					name: 'userRegister', // 若使用 addUser 云函数，可改为 'addUser'
					data: formData,
					success: (res) => {
						console.log('云函数返回：', res); // 调试关键
						if (res.result.code === 200) {
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							});
							// 清空表单（新增：优化用户体验）
							this.username = '';
							this.nickname = '';
							this.mobile = '';
							this.email = '';
							this.birthYear = '';
							this.city = '';
							this.password = '';
							this.confirmPassword = '';
							// 跳转登录页
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}, 1500);
						} else {
							uni.showToast({
								title: res.result.message || '注册失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '调用云函数失败',
							icon: 'none'
						});
						console.error('云函数调用失败：', err);
					}
				});
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