'use strict';
const db = uniCloud.database();
const commentDB = db.collection('Comments');
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		userId,
		page = 1,
		pageSize = 20
	} = event;

	if (!userId) {
		return {
			code: 400,
			message: '缺少用户ID'
		};
	}

	try {
		// 1. 查询当前用户的评论
		const skipNum = (page - 1) * pageSize;
		const commentResult = await commentDB
			.where({
				userId
			})
			.orderBy('time', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		// 2. 关联新闻标题
		const commentList = await Promise.all(commentResult.data.map(async (comment) => {
			const newsResult = await newsDB.doc(comment.newsId).get();
			return {
				...comment,
				newsTitle: newsResult.data.length > 0 ? newsResult.data[0].title : ''
			};
		}));

		// 3. 获取总条数
		const countResult = await commentDB.where({
			userId
		}).count();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: commentList,
				total: countResult.total
			}
		};
	} catch (error) {
		console.error('获取我的评论失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};