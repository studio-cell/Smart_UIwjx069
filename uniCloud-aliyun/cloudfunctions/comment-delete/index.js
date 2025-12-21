// cloudfunctions/comment-delete/index.js
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const commentCollection = db.collection('Comment'); // 匹配你的集合名

	try {
		const {
			commentId,
			userId
		} = event;

		// 1. 基础参数校验
		if (!commentId) {
			return {
				code: 400,
				message: '评论ID不能为空'
			};
		}
		if (!userId) {
			return {
				code: 400,
				message: '用户ID不能为空'
			};
		}

		// 2. 查询评论是否存在（纯字符串匹配，去掉正则）
		const commentRes = await commentCollection.doc(commentId).get();
		if (!commentRes.data) {
			return {
				code: 404,
				message: '评论不存在'
			};
		}

		// 3. 权限校验（统一转字符串+去空格，兼容格式）
		const dbUserId = String(commentRes.data.userId || '').trim();
		const reqUserId = String(userId).trim();

		console.log('权限校验对比：', {
			dbUserId: dbUserId,
			reqUserId: reqUserId,
			isEqual: dbUserId === reqUserId
		});

		// 4. 校验通过则删除
		if (dbUserId === reqUserId) {
			const delRes = await commentCollection.doc(commentId).remove();

			if (delRes.deleted === 1) {
				// 5. 可选：更新新闻评论数（失败不影响删除）
				try {
					await db.collection('News').doc(commentRes.data.newsId).update({
						inc: {
							comments: -1
						}
					});
				} catch (e) {
					console.warn('更新新闻评论数失败：', e);
				}

				return {
					code: 200,
					message: '删除成功'
				};
			} else {
				return {
					code: 500,
					message: '删除失败，未找到可删除的评论'
				};
			}
		} else {
			return {
				code: 403,
				message: '无权删除他人评论'
			};
		}
	} catch (error) {
		console.error('删除失败：', error);
		return {
			code: 500,
			message: '服务器错误',
			error: error.message
		};
	}
};