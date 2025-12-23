'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	const {
		keyword,
		type = 'all'
	} = event;

	try {
		let result = [];
		// 按类型搜索
		if (type === 'news' || type === 'all') {
			const news = await db.collection('News').where({
				title: new RegExp(keyword, 'i') // 阿里云模糊匹配
			}).get();
			result = [...result, ...news.data.map(item => ({
				...item,
				type: 'news'
			}))];
		}
		if (type === 'video' || type === 'all') {
			const videos = await db.collection('Video').where({
				title: new RegExp(keyword, 'i')
			}).get();
			result = [...result, ...videos.data.map(item => ({
				...item,
				type: 'video'
			}))];
		}

		return {
			code: 200,
			message: '查询成功',
			data: result
		};
	} catch (error) {
		return {
			code: 500,
			message: '搜索失败'
		};
	}
};