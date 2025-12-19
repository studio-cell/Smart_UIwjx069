'use strict';
const db = uniCloud.database();
const likeDB = db.collection('Like');
const newsDB = db.collection('News');
const commentDB = db.collection('Comment');

exports.main = async (event, context) => {
	const {
		userId,
		targetId,
		targetType
	} = event; // targetType: news/comment

	// 验证参数
	if (!userId || !targetId || !['news', 'comment'].includes(targetType)) {
		return {
			code: 400,
			message: '参数错误（userId/targetId/targetType必填，targetType仅支持news/comment）'
		};
	}

	try {
		// 1. 检查是否已点赞
		const existResult = await likeDB
			.where({
				userId,
				targetId,
				targetType
			})
			.get();

		if (existResult.data.length > 0) {
			// 已点赞：取消点赞
			const likeId = existResult.data[0]._id;
			await likeDB.doc(likeId).remove();

			// 更新目标的点赞数（-1）
			if (targetType === 'news') {
				await newsDB.doc(targetId).update({
					likeCount: db.command.inc(-1)
				});
			} else {
				await commentDB.doc(targetId).update({
					likeCount: db.command.inc(-1),
					isLiked: false
				});
			}

			return {
				code: 200,
				message: '取消点赞成功',
				data: {
					isLiked: false
				}
			};
		} else {
			// 未点赞：添加点赞
			await likeDB.add({
				userId,
				targetId,
				targetType,
				likeTime: new Date()
			});

			// 更新目标的点赞数（+1）
			if (targetType === 'news') {
				await newsDB.doc(targetId).update({
					likeCount: db.command.inc(1)
				});
			} else {
				await commentDB.doc(targetId).update({
					likeCount: db.command.inc(1),
					isLiked: true
				});
			}

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