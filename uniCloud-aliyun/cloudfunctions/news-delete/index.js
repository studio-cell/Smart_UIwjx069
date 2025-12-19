'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		newsId
	} = event;

	if (!newsId) {
		return {
			code: 400,
			message: '缺少新闻ID'
		};
	}

	try {
		const result = await newsDB.doc(newsId).remove();
		console.log('新闻删除成功：', result);
		return {
			code: 200,
			message: '新闻删除成功',
			data: result
		};
	} catch (error) {
		console.error('新闻删除失败：', error);
		return {
			code: 500,
			message: '删除失败',
			errMsg: error.message
		};
	}
};