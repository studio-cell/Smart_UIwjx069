'use strict';
const db = uniCloud.database();
const categoryDB = db.collection('Category');

exports.main = async (event, context) => {
	try {
		// 查询启用的分类（按排序升序）
		const result = await categoryDB
			.where({
				status: 1
			})
			.orderBy('sort', 'asc')
			.get();

		return {
			code: 200,
			message: '查询成功',
			data: result.data
		};
	} catch (error) {
		console.error('分类列表查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};