// cloudfunctions/video-like/index.js
'use strict';
const db = uniCloud.database();
const videoDB = db.collection('Video');
const likeDB = db.collection('UserVideoLike');

exports.main = async (event, context) => {
	const {
		videoId,
		userId,
		isCancel
	} = event;

	try {
		// 1. 更新视频点赞数
		await videoDB.doc(videoId).update({
			inc: {
				likeCount: isCancel ? -1 : 1
			}
		});

		// 2. 更新用户点赞记录
		if (isCancel) {
			await likeDB.where({
				videoId,
				userId
			}).remove();
		} else {
			const exist = await likeDB.where({
				videoId,
				userId
			}).get();
			if (exist.data.length === 0) {
				await likeDB.add({
					videoId,
					userId,
					createTime: Date.now()
				});
			}
		}

		return {
			code: 200,
			message: isCancel ? '取消点赞成功' : '点赞成功'
		};
	} catch (error) {
		console.error('视频点赞失败：', error);
		return {
			code: 500,
			message: '操作失败',
			errMsg: error.message
		};
	}
};