'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts');

exports.main = async (event, context) => {
	const {
		id,
		username,
		password,
		nickname,
		mobile,
		email
	} = event;

	// 验证ID和必填字段
	if (!id || !username) {
		return {
			code: 400,
			message: '缺少ID或用户名'
		};
	}

	// 构造更新数据（只更新传入的字段）
	const updateData = {};
	if (username) updateData.username = username.trim();
	if (password) updateData.password = password;
	if (nickname) updateData.nickname = nickname;
	if (mobile) updateData.mobile = mobile;
	if (email) updateData.email = email;

	try {
		// 局部更新（只修改传入的字段）
		const result = await userDB.doc(id).update(updateData);
		console.log('更新结果：', result);
		return {
			code: 200,
			message: '更新成功',
			data: result
		};
	} catch (error) {
		console.error('更新失败：', error);
		return {
			code: 500,
			message: '更新失败'
		};
	}
};