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
		// 先检查是否已收藏
		const existResult = await collectionDB
			.where({
				userId,
				newsId
			})
			.get();

		if (existResult.data.length > 0) {
			return {
				code: 409,
				message: '已收藏该新闻'
			};
		}

		// 添加收藏
		const result = await collectionDB.add({
			userId,
			newsId,
			collectTime: new Date()
		});

		return {
			code: 200,
			message: '收藏成功',
			data: {
				collectionId: result.id
			}
		};
	} catch (error) {
		console.error('收藏失败：', error);
		return {
			code: 500,
			message: '收藏失败',
			errMsg: error.message
		};
	}
};