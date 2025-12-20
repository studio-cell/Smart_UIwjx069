'use strict';
const db = uniCloud.database();
const collectionDB = db.collection('Collection');

exports.main = async (event, context) => {
	const {
		userId,
		newsId
	} = event;

	// 严格参数校验
	if (!userId || !newsId || typeof userId !== 'string' || typeof newsId !== 'string') {
		return {
			code: 400,
			message: '缺少用户ID/新闻ID或参数格式错误'
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

		if (existResult.data && existResult.data.length > 0) {
			return {
				code: 409,
				message: '已收藏该新闻'
			};
		}

		// 添加收藏（包含时间戳）
		const result = await collectionDB.add({
			userId,
			newsId,
			collectTime: new Date().getTime(), // 时间戳格式，方便前端处理
			createTime: new Date().getTime()
		});

		return {
			code: 200,
			message: '收藏成功',
			data: {
				collectionId: result.id,
				isCollected: true
			}
		};
	} catch (error) {
		console.error('收藏失败：', error);
		return {
			code: 500,
			message: '收藏失败：' + error.message,
			errMsg: error.message
		};
	}
};