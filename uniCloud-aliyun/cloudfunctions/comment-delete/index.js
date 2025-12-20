'use strict';
const db = uniCloud.database();
const commentDB = db.collection('Comments');
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		commentId
	} = event;

	if (!commentId) {
		return {
			code: 400,
			message: '缺少评论ID'
		};
	}

	try {
		// 1. 获取评论信息（关联的新闻ID）
		const commentResult = await commentDB.doc(commentId).get();
		if (commentResult.data.length === 0) {
			return {
				code: 404,
				message: '评论不存在'
			};
		}
		const newsId = commentResult.data[0].newsId;

		// 2. 删除评论
		await commentDB.doc(commentId).remove();

		// 3. 更新新闻评论数（-1）
		await newsDB.doc(newsId).update({
			comments: db.command.inc(-1)
		});

		return {
			code: 200,
			message: '删除成功'
		};
	} catch (error) {
		console.error('删除评论失败：', error);
		return {
			code: 500,
			message: '删除失败',
			errMsg: error.message
		};
	}
};