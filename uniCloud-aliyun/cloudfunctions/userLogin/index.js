// cloudfunctions/userLogin/index.js
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const userCollection = db.collection('User'); // 你的用户集合名

	try {
		const {
			username,
			password
		} = event;

		// 1. 校验参数
		if (!username || !password) {
			return {
				code: 400,
				message: '用户名/密码不能为空'
			};
		}

		// 2. 查询用户
		const userRes = await userCollection.where({
			username: username,
			password: password // 注意：正式环境要加密，这里仅测试
		}).get();

		// 3. 验证用户是否存在
		if (userRes.data.length === 0) {
			return {
				code: 401,
				message: '用户名或密码错误'
			};
		}

		// 4. 返回用户信息（和前端存储的字段匹配）
		const user = userRes.data[0];
		return {
			code: 200,
			message: '登录成功',
			account: {
				username: user.username,
				user_id: user._id, // 用户ID用数据库的_id
				nickname: user.nickname || '',
				avatar: user.avatar || ''
			},
			userInfo: user
		};
	} catch (error) {
		console.error('登录失败：', error);
		return {
			code: 500,
			message: '服务器错误',
			error: error.message
		};
	}
};