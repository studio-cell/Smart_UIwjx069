'use strict';
const db = uniCloud.database();
const _ = db.command;

// 初始化数据库集合
const likeDB = db.collection('Like');
const newsDB = db.collection('News');
const commentDB = db.collection('Comment');

exports.main = async (event, context) => {
	try {
		// 解构并校验参数
		const {
			userId,
			targetId,
			targetType
		} = event;

		// 严格参数校验（类型+值）
		if (!userId || typeof userId !== 'string') {
			return {
				code: 400,
				message: '参数错误：userId为必填字符串'
			};
		}
		if (!targetId || typeof targetId !== 'string') {
			return {
				code: 400,
				message: '参数错误：targetId为必填字符串'
			};
		}
		if (!['news', 'comment'].includes(targetType)) {
			return {
				code: 400,
				message: '参数错误：targetType仅支持news/comment'
			};
		}

		// 1. 检查是否已点赞
		const existResult = await likeDB
			.where({
				userId,
				targetId,
				targetType
			})
			.get();

		let isLiked = false;
		let message = '';

		if (existResult.data.length > 0) {
			// 已点赞：取消点赞
			const likeId = existResult.data[0]._id;
			await likeDB.doc(likeId).remove();

			// 更新目标的点赞数（-1）
			if (targetType === 'news') {
				await newsDB.doc(targetId).update({
					likeCount: _.inc(-1)
				});
			} else {
				await commentDB.doc(targetId).update({
					likeCount: _.inc(-1),
					isLiked: false
				});
			}

			isLiked = false;
			message = '取消点赞成功';
		} else {
			// 未点赞：添加点赞
			await likeDB.add({
				userId,
				targetId,
				targetType,
				likeTime: new Date(),
				createTime: db.serverDate() // 使用服务器时间更准确
			});

			// 更新目标的点赞数（+1）
			if (targetType === 'news') {
				await newsDB.doc(targetId).update({
					likeCount: _.inc(1)
				});
			} else {
				await commentDB.doc(targetId).update({
					likeCount: _.inc(1),
					isLiked: true
				});
			}

			isLiked = true;
			message = '点赞成功';
		}

		return {
			code: 200,
			message,
			data: {
				isLiked
			}
		};
	} catch (error) {
		console.error('点赞操作失败：', error);
		return {
			code: 500,
			message: '点赞操作失败',
			errMsg: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
		};
	}
};