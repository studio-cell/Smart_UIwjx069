// 云函数：userLogin（适配阿里云服务空间）
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const {
		username,
		password
	} = event;

	try {
		// 1. 查询账户是否存在
		const accountRes = await db.collection('Accounts')
			.where({
				username,
				password
			})
			.get();

		if (accountRes.data.length === 0) {
			return {
				code: 401,
				message: "账号或密码错误"
			};
		}

		const account = accountRes.data[0];

		// 2. 更新最后登录时间（修复：替换db.serverDate()为new Date()）
		await db.collection('Accounts')
			.doc(account._id)
			.update({
				last_login_time: new Date() // 适配阿里云
			});

		// 3. 查询关联的用户信息
		const userRes = await db.collection('UserInfo')
			.doc(account.user_id)
			.get();

		return {
			code: 200,
			message: "登录成功",
			account: {
				username: account.username,
				user_id: account.user_id
			},
			userInfo: userRes.data[0]
		};
	} catch (err) {
		return {
			code: 500,
			message: "登录失败",
			errMsg: err.message
		};
	}
};