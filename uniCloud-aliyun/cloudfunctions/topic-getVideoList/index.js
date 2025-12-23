// cloudfunctions/topic-getVideoList/index.js
'use strict';
const db = uniCloud.database();
const videoDB = db.collection('Video');

exports.main = async (event, context) => {
	const {
		topicId,
		page = 1,
		pageSize = 10
	} = event;

	try {
		const skipNum = (page - 1) * pageSize;
		// 查询该话题下的视频
		const countResult = await videoDB.where({
			topicId
		}).count();
		const listResult = await videoDB
			.where({
				topicId
			})
			.orderBy('createTime', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: listResult.data,
				total: countResult.total
			}
		};
	} catch (error) {
		console.error('话题视频查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};