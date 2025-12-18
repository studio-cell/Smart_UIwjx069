'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts');

exports.main = async (event, context) => {
	if (!event.id) {
		return {
			code: 400,
			message: '缺少用户ID'
		};
	}

	try {
		// 通过ID查询单条记录
		const result = await userDB.where({
			_id: event.id
		}).get();
		return {
			code: 200,
			data: result.data[0], // 返回单个用户信息
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