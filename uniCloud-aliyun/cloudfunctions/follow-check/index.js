'use strict';
const db = uniCloud.database();
const followCollection = db.collection('follow');

exports.main = async (event, context) => {
	const {
		userId,
		authorId
	} = event;
	try {
		// 查询当前用户是否关注该作者
		const res = await followCollection
			.where({
				userId: userId,
				authorId: authorId
			})
			.get();

		return {
			code: 200,
			data: {
				isFollowed: res.data.length > 0 // 有记录则已关注
			}
		};
	} catch (error) {
		return {
			code: 500,
			msg: '查询关注状态失败',
			error: error.message
		};
	}
};