'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		newsId
	} = event;

	// 验证ID
	if (!newsId) {
		return {
			code: 400,
			message: '缺少新闻ID'
		};
	}

	// 构造更新数据（只更新传入的字段）
	const updateData = {};
	if (event.title) updateData.title = event.title.trim();
	if (event.cover) updateData.cover = event.cover;
	if (event.summary) updateData.summary = event.summary;
	if (event.content) updateData.content = event.content;
	if (event.author) updateData.author = event.author.trim();
	if (event.category) updateData.category = event.category.trim();
	if (event.isTop !== undefined) updateData.isTop = event.isTop;
	if (event.comments !== undefined) updateData.comments = event.comments;
	if (event.isAd !== undefined) updateData.isAd = event.isAd;

	try {
		const result = await newsDB.doc(newsId).update(updateData);
		console.log('新闻更新成功：', result);
		return {
			code: 200,
			message: '新闻更新成功',
			data: result
		};
	} catch (error) {
		console.error('新闻更新失败：', error);
		return {
			code: 500,
			message: '更新失败',
			errMsg: error.message
		};
	}
};