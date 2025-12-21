// cloudfunctions/comment-add/index.js
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const collection = db.collection('Comment');

	try {
		// 1. 只取必要参数，忽略传递的userId，直接写死
		const {
			newsId,
			content
		} = event;

		// 2. 基础校验
		if (!newsId) return {
			code: 400,
			message: '新闻ID不能为空'
		};
		if (!content) return {
			code: 400,
			message: '评论内容不能为空'
		};

		// 3. 强制写入你的用户ID（核心：不再依赖传递的参数）
		const commentData = {
			newsId: newsId,
			userId: '6943db593f1a47e81a41eb99', // 固定写死你的用户ID
			username: 'wjx', // 固定写死你的用户名
			content: content.trim(),
			time: new Date(),
			likeCount: 0
		};

		// 4. 写入数据库
		const res = await collection.add(commentData);

		return {
			code: 200,
			message: '评论发布成功',
			data: {
				commentId: res.id
			}
		};
	} catch (error) {
		console.error('发布失败：', error);
		return {
			code: 500,
			message: '服务器错误',
			error: error.message
		};
	}
};