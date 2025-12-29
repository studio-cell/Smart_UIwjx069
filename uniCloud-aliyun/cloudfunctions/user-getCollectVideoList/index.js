// cloudfunctions/user-getCollectVideoList/index.js
'use strict';
const db = uniCloud.database();
const collectDB = db.collection('UserVideoCollect');

exports.main = async (event, context) => {
	const {
		userId
	} = event;

	try {
		// 查询该用户的所有收藏记录
		const res = await collectDB.where({
			userId
		}).get();

		return {
			code: 200,
			message: '查询成功',
			data: res.data // 返回格式：[{videoId: 'v1001', userId: 'xxx', createTime: xxx}, ...]
		};
	} catch (error) {
		console.error('查询用户收藏记录失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};