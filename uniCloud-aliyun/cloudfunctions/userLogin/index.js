// cloudfunctions/userLogin/index.js
'use strict';
const db = uniCloud.database();
// 👇 集合名改为数据库实际的 Accounts
const userCollection = db.collection('Accounts');

exports.main = async (event, context) => {
	// 👇 接收前端传的 username（和数据库字段一致）
	const {
		username,
		password
	} = event;

	try {
		// 👇 查询条件：数据库的 username 字段 = 前端输入的 username
		const userRes = await userCollection.where({
			username: username
		}).get();

		// 1. 检查用户是否存在
		if (userRes.data.length === 0) {
			return {
				code: 401,
				message: '用户名不存在'
			};
		}

		const user = userRes.data[0];
		// 2. 比对明文密码（和数据库一致）
		if (user.password !== password) {
			return {
				code: 401,
				message: '密码错误'
			};
		}

		// 3. 登录成功返回数据
		return {
			code: 200,
			message: '登录成功',
			account: {
				username: user.username, // 用户名
				userId: user._id, // 数据库唯一ID
				nickname: user.nickname || user.username,
				avatar: user.avatar || ''
			},
			userInfo: user
		};
	} catch (error) {
		console.error('登录失败：', error);
		return {
			code: 500,
			message: '服务器错误'
		};
	}
};