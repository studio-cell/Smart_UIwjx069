'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts');

exports.main = async (event, context) => {
	const {
		username,
		password
	} = event;

	// 1. 校验参数
	if (!username || typeof username !== 'string') {
		return {
			code: 400,
			message: '用户名无效'
		};
	}
	if (!password || typeof password !== 'string') {
		return {
			code: 400,
			message: '密码无效'
		};
	}

	try {
		// 2. 先查询用户名是否存在
		const result = await userDB.where({
			username
		}).get();

		if (result.data.length === 0) {
			return {
				code: 401,
				message: '用户名不存在'
			};
		}

		// 3. 校验密码（实际项目需解密后对比）
		const user = result.data[0];
		if (user.password !== password) {
			return {
				code: 401,
				message: '密码错误'
			};
		}

		// 4. 校验通过，返回用户信息（隐藏密码）
		const userInfo = {
			userId: user._id,
			username: user.username,
			nickname: user.nickname,
			mobile: user.mobile,
			email: user.email
		};

		return {
			code: 200,
			message: '登录成功',
			data: userInfo
		};
	} catch (error) {
		console.error('登录失败：', error);
		return {
			code: 500,
			message: '登录失败'
		};
	}
};