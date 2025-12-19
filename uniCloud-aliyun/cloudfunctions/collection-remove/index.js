'use strict';
const db = uniCloud.database();
const collectionDB = db.collection('Collection');

exports.main = async (event, context) => {
	const {
		userId,
		newsId
	} = event;

	if (!userId || !newsId) {
		return {
			code: 400,
			message: '缺少用户ID/新闻ID'
		};
	}

	try {
		// 查询收藏记录ID
		const existResult = await collectionDB
			.where({
				userId,
				newsId
			})
			.get();

		if (existResult.data.length === 0) {
			return {
				code: 404,
				message: '未收藏该新闻'
			};
		}

		// 删除收藏
		const collectionId = existResult.data[0]._id;
		const result = await collectionDB.doc(collectionId).remove();

		return {
			code: 200,
			message: '取消收藏成功',
			data: result
		};
	} catch (error) {
		console.error('取消收藏失败：', error);
		return {
			code: 500,
			message: '取消收藏失败',
			errMsg: error.message
		};
	}
};