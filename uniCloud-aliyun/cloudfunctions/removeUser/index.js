'use strict';
const db = uniCloud.database();
const userDB = db.collection('Accounts');

exports.main = async (event, context) => {
	// 验证ID是否传入
	if (!event.id) {
		return {
			code: 400,
			message: '缺少用户ID'
		};
	}

	try {
		// 通过ID精确删除（doc()指定单条记录）
		const result = await userDB.doc(event.id).remove();
		console.log('删除结果：', result);
		return {
			code: 200,
			message: '删除成功',
			data: result
		};
	} catch (error) {
		console.error('删除失败：', error);
		return {
			code: 500,
			message: '删除失败'
		};
	}
};