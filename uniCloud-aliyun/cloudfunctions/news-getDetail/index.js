'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		newsId
	} = event;

	// 验证新闻ID
	if (!newsId) {
		return {
			code: 400,
			message: '缺少新闻ID'
		};
	}

	try {
		// 查询单条新闻
		const result = await newsDB.doc(newsId).get();
		if (result.data.length === 0) {
			return {
				code: 404,
				message: '新闻不存在'
			};
		}

		return {
			code: 200,
			message: '查询成功',
			data: result.data[0]
		};
	} catch (error) {
		console.error('新闻详情查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};