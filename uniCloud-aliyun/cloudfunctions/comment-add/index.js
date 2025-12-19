'use strict';
const db = uniCloud.database();
const commentDB = db.collection('Comment');
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		newsId,
		userId,
		content,
		username
	} = event;

	// 验证必填字段
	if (!newsId || !userId || !content || !username) {
		return {
			code: 400,
			message: '缺少新闻ID/用户ID/评论内容/用户名'
		};
	}

	// 构造评论数据
	const commentData = {
		newsId,
		userId,
		content: content.trim(),
		username,
		time: new Date().toLocaleString(), // 格式化时间
		likeCount: 0,
		isLiked: false
	};

	try {
		// 1. 添加评论
		const result = await commentDB.add(commentData);

		// 2. 更新新闻的评论数（+1）
		await newsDB.doc(newsId).update({
			comments: db.command.inc(1) // 自增1
		});

		return {
			code: 200,
			message: '评论发布成功',
			data: {
				commentId: result.id
			}
		};
	} catch (error) {
		console.error('评论发布失败：', error);
		return {
			code: 500,
			message: '评论发布失败',
			errMsg: error.message
		};
	}
};