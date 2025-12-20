'use strict';
exports.main = async (event, context) => {
	// 1. 参数校验（增强）
	const {
		userId,
		targetId,
		targetType,
		onlyCheck = false
	} = event;
	if (!userId || !targetId || !targetType || !['news', 'comment'].includes(targetType)) {
		return {
			code: 400,
			message: '参数错误（userId/targetId/targetType必填，targetType仅支持news/comment）'
		};
	}

	// 2. 获取数据库引用
	const db = uniCloud.database();
	const collection = db.collection('like');

	try {
		// 3. 检查是否已点赞
		const queryRes = await collection
			.where({
				userId,
				targetId,
				targetType
			})
			.get();

		const hasLiked = queryRes.data && queryRes.data.length > 0;

		// 4. 仅检查状态
		if (onlyCheck) {
			return {
				code: 200,
				message: '查询成功',
				data: {
					isLiked: hasLiked
				}
			};
		}

		// 5. 点赞/取消点赞
		if (hasLiked) {
			// 取消点赞
			await collection.doc(queryRes.data[0]._id).remove();
			return {
				code: 200,
				message: '取消点赞成功',
				data: {
					isLiked: false
				}
			};
		} else {
			// 点赞（替换 serverDate 为 Date.now()）
			await collection.add({
				userId,
				targetId,
				targetType,
				createTime: Date.now(), // 阿里云兼容：使用时间戳替代 serverDate
				updateTime: Date.now()
			});
			return {
				code: 200,
				message: '点赞成功',
				data: {
					isLiked: true
				}
			};
		}
	} catch (error) {
		console.error('点赞操作失败：', error);
		return {
			code: 500,
			message: '点赞操作失败',
			errMsg: error.message
		};
	}
};