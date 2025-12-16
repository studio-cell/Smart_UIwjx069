// 云函数：用户注册（同时创建Accounts和UserInfo记录）
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const {
		username,
		password,
		userInfo
	} = event; // 接收前端传递的参数

	try {
		// 1. 先创建UserInfo记录
		const userRes = await db.collection('UserInfo').add(userInfo);
		const userId = userRes.id; // 获取新增用户的_id

		// 2. 再创建Accounts记录（关联UserInfo的_id）
		await db.collection('Accounts').add({
			username,
			password, // 实际项目需用uniCloud.encrypt加密密码
			register_time: db.serverDate(), // 服务器当前时间
			last_login_time: db.serverDate(),
			user_id: userId // 关联用户ID
		});

		return {
			code: 200,
			message: "注册成功",
			userId
		};
	} catch (err) {
		return {
			code: 500,
			message: "注册失败",
			errMsg: err.message
		};
	}
};