<template>
	<view class="user-list-container">
		<!-- 页面标题 -->
		<view class="page-title">用户列表</view>

		<!-- 空数据提示 -->
		<view class="empty-tip" v-if="userList.length === 0">
			暂无用户数据
		</view>

		<!-- 用户列表（添加点击/长按事件触发操作菜单） -->
		<view class="user-list" v-else>
			<view class="list-item" v-for="(item, i) in userList" :key="i" @longpress="optUser(item._id)" <!-- 长按弹出操作菜单
				-->
				@click="optUser(item._id)" <!-- 点击也可触发（可选） -->
				>
				<view class="item-index">序号：{{i+1}}</view>
				<view class="item-info">用户名：{{item.username || '未填写'}}</view>
				<view class="item-info">手机号：{{item.mobile || '无'}}</view>
				<view class="item-info">邮箱：{{item.email || '无'}}</view>
				<view class="item-info">昵称：{{item.nickname || '未填写'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "userList",
		data() {
			return {
				userList: []
			};
		},
		onLoad() {
			this.getData();
		},
		methods: {
			// 1. 查询所有用户（原有逻辑）
			getData() {
				uni.showLoading({
					title: '加载中...'
				});
				uniCloud.callFunction({
					name: 'getUsers',
					success: (res) => {
						uni.hideLoading();
						console.log('用户列表查询结果：', res);
						if (res.result.code === 200) {
							this.userList = res.result.data;
						} else {
							uni.showToast({
								title: res.result.message || '查询失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('云函数调用失败：', err);
						uni.showToast({
							title: '网络异常，查询失败',
							icon: 'none'
						});
					}
				});
			},

			// 2. 新增：弹出操作菜单（编辑/删除）
			optUser(id) {
				uni.showActionSheet({
					itemList: ['编辑', '删除'], // 操作选项
					success: (res) => {
						if (res.tapIndex === 1) { // 下标1对应“删除”选项
							this.removeUser(id);
						} else if (res.tapIndex === 0) { // 下标0对应“编辑”选项
							// 后续可添加跳转到编辑页的逻辑
							uni.navigateTo({
								url: `/pages/editUser/editUser?id=${id}` // 传用户ID到编辑页
							});
						}
					},
					fail: (err) => {
						console.error('操作菜单取消：', err);
					}
				});
			},

			// 3. 新增：删除用户
			removeUser(id) {
				// 二次确认（防止误删）
				uni.showModal({
					title: '确认删除',
					content: '是否确定删除该用户？删除后不可恢复',
					success: (modalRes) => {
						if (modalRes.confirm) { // 用户点击“确定”
							uniCloud.callFunction({
								name: 'removeUser', // 需部署对应的删除云函数
								data: {
									id
								}, // 传入要删除的用户ID
								success: (res) => {
									if (res.result.code === 200) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});
										this.getData(); // 删除后重新查询列表，刷新页面
									} else {
										uni.showToast({
											title: res.result.message || '删除失败',
											icon: 'none'
										});
									}
								},
								fail: (err) => {
									console.error('删除用户失败：', err);
									uni.showToast({
										title: '网络异常，删除失败',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			}
		}
	};
</script>

<style scoped>
	.user-list-container {
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

	.empty-tip {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}

	.user-list {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.list-item {
		padding: 20rpx 0;
		border-bottom: 1px solid #eee;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.item-index {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.item-info {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 8rpx;
	}
</style>