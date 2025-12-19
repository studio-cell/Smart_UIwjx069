'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	console.log('发布新闻参数：', event);

	// 1. 验证必填字段
	const requiredFields = ['title', 'author', 'category', 'time'];
	const missingFields = requiredFields.filter(field => !event[field]);
	if (missingFields.length > 0) {
		return {
			code: 400,
			message: `缺少必填字段：${missingFields.join(',')}`
		};
	}

	// 2. 构造新闻数据
	const newsData = {
		title: event.title.trim(),
		cover: event.cover || '', // 封面图URL
		summary: event.summary || '', // 摘要
		content: event.content || '', // 正文
		author: event.author.trim(),
		category: event.category.trim(),
		isTop: event.isTop || false, // 是否置顶
		comments: event.comments || 0, // 评论数
		time: event.time, // 发布时间
		isAd: event.isAd || false, // 是否广告
		createTime: new Date()
	};

	try {
		const result = await newsDB.add(newsData);
		console.log('新闻发布成功：', result);
		return {
			code: 200,
			message: '新闻发布成功',
			data: {
				newsId: result.id
			}
		};
	} catch (error) {
		console.error('新闻发布失败：', error);
		return {
			code: 500,
			message: '新闻发布失败',
			errMsg: error.message
		};
	}
};