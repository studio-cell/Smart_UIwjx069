'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts'); // 操作Accounts表

exports.main = async (event, context) => {
	console.log('添加用户参数：', event);

	// 1. 验证必要字段（用户名、密码必填）
	if (!event.username || !event.password) {
		return {
			code: 400,
			message: '缺少用户名或密码'
		};
	}

	// 2. 只提取需要的字段（避免冗余参数）
	const userData = {
		username: event.username.trim(),
		password: event.password, // 实际项目需用uniCloud.encrypt加密
		nickname: event.nickname || '',
		mobile: event.mobile || '',
		email: event.email || '',
		createTime: new Date() // 阿里云支持的时间格式
	};

	try {
		// 3. 写入数据库
		const result = await userDB.add(userData);
		console.log('添加成功：', result);
		return {
			code: 200,
			message: '添加成功',
			data: {
				userId: result.id
			} // 返回新增记录ID
		};
	} catch (error) {
		console.error('添加失败：', error);
		return {
			code: 500,
			message: '添加失败',
			errMsg: error.message
		};
	}
};