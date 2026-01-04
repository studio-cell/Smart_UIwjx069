// cloudfunctions/comment-add/index.js
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const collection = db.collection('Comment');

	try {
		// 1. 获取参数
		const {
			newsId,
			content,
			userId,
			username
		} = event;

		console.log('评论参数：', { newsId, content, userId, username });

		// 2. 基础校验
		if (!newsId) {
			console.log('错误：新闻ID为空');
			return {
				code: 400,
				message: '新闻ID不能为空'
			};
		}
		if (!content || !content.trim()) {
			console.log('错误：评论内容为空');
			return {
				code: 400,
				message: '评论内容不能为空'
			};
		}

		// 3. 构建评论数据
		const commentData = {
			newsId: String(newsId), // 确保是字符串
			userId: String(userId || '6943db593f1a47e81a41eb99'), // 优先使用传入的userId，否则使用默认值
			username: String(username || '匿名用户'), // 优先使用传入的username，否则使用默认值
			content: content.trim(),
			time: new Date().getTime(), // 使用时间戳
			likeCount: 0
		};

		console.log('准备写入的评论数据：', commentData);

		// 4. 写入数据库
		const res = await collection.add(commentData);
		console.log('写入成功，ID：', res.id);

		return {
			code: 200,
			message: '评论发布成功',
			data: {
				commentId: res.id,
				commentData: commentData
			}
		};
	} catch (error) {
		console.error('发布失败详细信息：', error);
		return {
			code: 500,
			message: '服务器错误: ' + error.message,
			error: error.message
		};
	}
};