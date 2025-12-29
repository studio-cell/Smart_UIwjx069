'use strict';
const db = uniCloud.database();
const videoDB = db.collection('Video'); // 对应你的视频集合（注意集合名大小写一致）
const collectDB = db.collection('UserVideoCollect'); // 新增用户视频收藏集合

exports.main = async (event, context) => {
	const {
		videoId,
		userId,
		isCancel // 是否取消收藏
	} = event;

	try {
		// 1. 先查询视频是否存在，避免无效操作
		const videoRes = await videoDB.doc(videoId).get();
		if (!videoRes.data || videoRes.data.length === 0) {
			return {
				code: 404,
				message: '视频不存在'
			};
		}
		const currentCollectCount = videoRes.data[0].collectCount || 0;

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
		await videoDB.doc(videoId).update({
			inc: {
				collectCount: isCancel ? -1 : 1
			}
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
					createTime: Date.now() // 记录收藏时间
				});
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