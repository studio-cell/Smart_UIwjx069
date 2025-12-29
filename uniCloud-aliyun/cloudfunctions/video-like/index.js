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

	// 参数验证
	if (!videoId || !userId) {
		return {
			code: 400,
			message: '缺少必要参数'
		};
	}

	try {
		// 1. 查询视频是否存在
		const videoRes = await videoDB.where({
			vid: videoId
		}).get();

		let videoDocId = null;
		let currentLikeCount = 0;

		if (videoRes.data && videoRes.data.length > 0) {
			// 视频已存在
			videoDocId = videoRes.data[0]._id;
			currentLikeCount = videoRes.data[0].likeCount || 0;
		} else {
			// 视频不存在，创建一条记录（使用前端的本地数据）
			// 这里需要前端在点赞时传递视频的完整信息，或者我们创建基础记录
			const createRes = await videoDB.add({
				vid: videoId,
				likeCount: 0,
				collectCount: 0,
				createTime: Date.now(),
				updateTime: Date.now()
			});

			videoDocId = createRes.id;
			currentLikeCount = 0;
		}

		// 2. 处理取消点赞时的边界情况
		if (isCancel) {
			// 如果当前点赞数为0，避免减到负数
			if (currentLikeCount <= 0) {
				// 只清理用户点赞记录，不更新视频点赞数
				await likeDB.where({
					videoId,
					userId
				}).remove();

				return {
					code: 200,
					message: '取消点赞成功'
				};
			}

			// 更新视频点赞数（减1）
			await videoDB.doc(videoDocId).update({
				likeCount: currentLikeCount - 1,
				updateTime: Date.now()
			});

			// 删除用户点赞记录
			await likeDB.where({
				videoId,
				userId
			}).remove();

			return {
				code: 200,
				message: '取消点赞成功'
			};
		}

		// 3. 处理点赞操作
		// 检查是否已点赞
		const existLike = await likeDB.where({
			videoId,
			userId
		}).get();

		// 如果已点赞，直接返回成功
		if (existLike.data && existLike.data.length > 0) {
			return {
				code: 200,
				message: '已点赞'
			};
		}

		// 添加点赞记录
		await likeDB.add({
			videoId,
			userId,
			createTime: Date.now(),
			updateTime: Date.now()
		});

		// 更新视频点赞数（加1）
		await videoDB.doc(videoDocId).update({
			likeCount: currentLikeCount + 1,
			updateTime: Date.now()
		});

		return {
			code: 200,
			message: '点赞成功'
		};

	} catch (error) {
		console.error('视频点赞失败：', error);
		return {
			code: 500,
			message: '操作失败',
			error: error.message
		};
	}
};