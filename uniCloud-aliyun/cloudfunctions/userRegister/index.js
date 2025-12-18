// 云函数：userRegister（适配阿里云服务空间）
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const {
		username,
		password,
		userInfo
	} = event; // 接收前端传递的参数

	// 新增：参数校验（缺少则直接返回失败）
	if (!username || !password || !userInfo) {
		return {
			code: 400,
			message: "缺少必填参数"
		};
	}

	try {
		// 1. 先创建UserInfo记录
		const userRes = await db.collection('UserInfo').add(userInfo);
		const userId = userRes.id; // 获取新增用户的_id

		// 2. 再创建Accounts记录（关联UserInfo的_id）
		// 关键修复：用new Date()替换db.serverDate()（适配阿里云）
		await db.collection('Accounts').add({
			username,
			password, // 测试阶段明文，后续替换为uniCloud.encrypt(password)
			register_time: new Date(), // 阿里云支持的服务器时间格式
			last_login_time: new Date(),
			user_id: userId // 关联用户ID
		});

		return {
			code: 200,
			message: "注册成功",
			userId
		};
	} catch (err) {
		// 新增：详细打印错误信息，方便排查
		console.error('注册云函数执行错误：', err);
		return {
			code: 500,
			message: "注册失败",
			errMsg: err.message // 返回具体错误原因给前端
		};
	}
};