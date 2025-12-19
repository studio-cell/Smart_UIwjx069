'use strict';
const db = uniCloud.database();
const commentDB = db.collection('Comment');

exports.main = async (event, context) => {
	const {
		newsId,
		page = 1,
		pageSize = 20
	} = event;

	if (!newsId) {
		return {
			code: 400,
			message: '缺少新闻ID'
		};
	}

	try {
		// 分页查询指定新闻的评论（按时间倒序）
		const skipNum = (page - 1) * pageSize;
		const result = await commentDB
			.where({
				newsId
			})
			.orderBy('time', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		// 获取总条数
		const countResult = await commentDB.where({
			newsId
		}).count();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: result.data,
				total: countResult.total,
				page,
				pageSize
			}
		};
	} catch (error) {
		console.error('评论列表查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};