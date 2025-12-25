'use strict';
const db = uniCloud.database();
const followCollection = db.collection('follow');

exports.main = async (event, context) => {
	const {
		userId,
		authorId,
		isFollowed
	} = event;
	try {
		if (isFollowed) {
			// 关注：新增关注记录
			await followCollection.add({
				userId: userId,
				authorId: authorId,
				createTime: Date.now()
			});
			return {
				code: 200,
				msg: '关注成功'
			};
		} else {
			// 取消关注：删除关注记录
			const res = await followCollection
				.where({
					userId,
					authorId
				})
				.get();
			if (res.data.length > 0) {
				await followCollection.doc(res.data[0]._id).remove();
			}
			return {
				code: 200,
				msg: '取消关注成功'
			};
		}
	} catch (error) {
		return {
			code: 500,
			msg: '操作失败',
			error: error.message
		};
	}
};