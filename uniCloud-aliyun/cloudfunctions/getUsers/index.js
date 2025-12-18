'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts');

exports.main = async (event, context) => {
	try {
		// 查询所有用户（可添加条件过滤，如.where({status: 1})）
		const result = await userDB.get();
		return {
			code: 200,
			data: result.data, // 返回用户列表
			message: '查询成功'
		};
	} catch (error) {
		console.error('查询失败：', error);
		return {
			code: 500,
			message: '查询失败'
		};
	}
};