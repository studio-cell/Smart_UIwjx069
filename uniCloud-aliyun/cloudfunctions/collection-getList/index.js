'use strict';
const db = uniCloud.database();
const collectionDB = db.collection('Collection');
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		userId,
		page = 1,
		pageSize = 10
	} = event;

	// 参数校验
	if (!userId || typeof userId !== 'string') {
		return {
			code: 400,
			message: '缺少用户ID或参数格式错误'
		};
	}

	try {
		// 1. 查询用户收藏的新闻ID列表
		const skipNum = (page - 1) * pageSize;
		const collectionResult = await collectionDB
			.where({
				userId
			})
			.orderBy('collectTime', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		if (!collectionResult.data || collectionResult.data.length === 0) {
			return {
				code: 200,
				message: '暂无收藏',
				data: {
					list: [],
					total: 0
				}
			};
		}

		// 2. 批量查询新闻详情
		const newsIds = collectionResult.data.map(item => item.newsId);
		const newsResult = await newsDB
			.where({
				_id: db.command.in(newsIds)
			})
			.get();

		// 3. 关联收藏时间，处理null数据
		const collectList = collectionResult.data.map(collect => {
			const news = newsResult.data.find(n => n._id === collect.newsId) || {};
			return {
				...collect,
				newsInfo: {
					title: news.title || '暂无标题',
					cover: news.cover || '',
					author: news.author || '未知作者',
					time: news.time || ''
				}
			};
		});

		// 4. 获取总条数
		const countResult = await collectionDB.where({
			userId
		}).count();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: collectList,
				total: countResult.total || 0,
				page: parseInt(page),
				pageSize: parseInt(pageSize)
			}
		};
	} catch (error) {
		console.error('收藏列表查询失败：', error);
		return {
			code: 500,
			message: '查询失败：' + error.message,
			errMsg: error.message
		};
	}
};