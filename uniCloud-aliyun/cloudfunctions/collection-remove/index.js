'use strict';
const db = uniCloud.database();
const collectionDB = db.collection('Collection');

exports.main = async (event, context) => {
	const {
		userId,
		newsId,
		collectionId
	} = event;

	// 参数校验：支持collectionId或userId+newsId两种方式
	if (!userId || (!newsId && !collectionId)) {
		return {
			code: 400,
			message: '缺少必要参数：userId + (newsId 或 collectionId)'
		};
	}

	try {
		let whereCondition = {};
		if (collectionId) {
			whereCondition._id = collectionId;
		} else {
			whereCondition = {
				userId,
				newsId
			};
		}

		// 查询收藏记录
		const existResult = await collectionDB.where(whereCondition).get();
		if (!existResult.data || existResult.data.length === 0) {
			return {
				code: 404,
				message: '未收藏该新闻'
			};
		}

		// 删除收藏
		const collectionIdToDel = existResult.data[0]._id;
		const result = await collectionDB.doc(collectionIdToDel).remove();

		return {
			code: 200,
			message: '取消收藏成功',
			data: {
				deleted: result.deleted,
				isCollected: false
			}
		};
	} catch (error) {
		console.error('取消收藏失败：', error);
		return {
			code: 500,
			message: '取消收藏失败：' + error.message,
			errMsg: error.message
		};
	}
};