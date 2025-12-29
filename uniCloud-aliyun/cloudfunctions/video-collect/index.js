// cloudfunctions/video-collect/index.js
'use strict';
const db = uniCloud.database();
const videoDB = db.collection('Video');
const collectDB = db.collection('UserVideoCollect');

exports.main = async (event, context) => {
	const {
		videoId, // 注意：这是前端的vid，不是数据库的_id
		userId,
		isCancel // 是否取消收藏
	} = event;

	// 参数验证
	if (!videoId || !userId) {
		return {
			code: 400,
			message: '缺少必要参数'
		};
	}

	try {
		// 1. 先根据vid查询视频是否存在
		const videoRes = await videoDB.where({
			vid: videoId // 根据vid字段查询，而不是使用_id
		}).get();

		if (!videoRes.data || videoRes.data.length === 0) {
			return {
				code: 404,
				message: '视频不存在'
			};
		}

		const videoData = videoRes.data[0];
		const videoDocId = videoData._id; // 获取数据库中的_id
		const currentCollectCount = videoData.collectCount || 0;

		// 2. 若取消收藏且当前收藏数为0，直接返回成功（避免出现负数）
		if (isCancel && currentCollectCount <= 0) {
			await collectDB.where({
				videoId,
				userId
			}).remove();
			return {
				code: 200,
				message: '取消收藏成功'
			};
		}

		// 3. 更新视频收藏数（递增/递减）
		await videoDB.doc(videoDocId).update({
			inc: {
				collectCount: isCancel ? -1 : 1
			},
			updateTime: Date.now()
		});

		// 4. 更新用户收藏记录（新增/删除）
		if (isCancel) {
			// 取消收藏：删除用户收藏记录
			await collectDB.where({
				videoId,
				userId
			}).remove();
		} else {
			// 收藏：先判断是否已收藏，避免重复添加
			const exist = await collectDB.where({
				videoId,
				userId
			}).get();

			if (exist.data.length === 0) {
				await collectDB.add({
					videoId,
					userId,
					createTime: Date.now(),
					updateTime: Date.now()
				});
			} else {
				return {
					code: 200,
					message: '已收藏'
				};
			}
		}

		return {
			code: 200,
			message: isCancel ? '取消收藏成功' : '收藏成功'
		};
	} catch (error) {
		console.error('视频收藏失败：', error);
		return {
			code: 500,
			message: '操作失败',
			errMsg: error.message
		};
	}
};