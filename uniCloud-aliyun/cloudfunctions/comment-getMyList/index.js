// cloudfunctions/comment-getMyList/index.js
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const commentCollection = db.collection('Comment'); // 注意：你的集合名是Comment（首字母大写）
	const newsCollection = db.collection('News');

	try {
		const {
			userId,
			page = 1,
			pageSize = 20
		} = event;

		// 1. 校验用户ID
		if (!userId) {
			return {
				code: 400,
				message: '用户ID不能为空'
			};
		}

		// 2. 分页查询：严格匹配数据库的userId字段
		const skip = (page - 1) * pageSize;
		const commentRes = await commentCollection
			.where({
				userId: userId
			}) // 这里必须和数据库字段一致：userId
			.orderBy('time', 'desc')
			.skip(skip)
			.limit(pageSize)
			.get();

		// 3. 关联查询新闻标题（匹配数据库的newsId字段）
		const commentList = await Promise.all(
			commentRes.data.map(async (item) => {
				if (item.newsId) { // 匹配数据库的newsId字段
					const newsRes = await newsCollection.doc(item.newsId).get();
					item.newsTitle = newsRes.data?.title || '已删除的新闻';
				}
				return item;
			})
		);

		// 4. 返回结果
		return {
			code: 200,
			message: '查询成功',
			data: {
				list: commentList,
				total: commentRes.total
			}
		};
	} catch (error) {
		console.error('获取我的评论失败：', error);
		return {
			code: 500,
			message: '服务器错误',
			error: error.message
		};
	}
};