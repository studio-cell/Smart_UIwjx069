'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	const {
		category, // 分类名称
		page = 1, // 页码
		pageSize = 10, // 每页条数
		isTop = null, // 是否置顶筛选
		isAd = null // 是否广告筛选
	} = event;

	try {
		// 1. 构建查询条件
		let query = newsDB;
		if (category) {
			query = query.where({
				category
			});
		}
		if (isTop !== null) {
			query = query.where({
				isTop
			});
		}
		if (isAd !== null) {
			query = query.where({
				isAd
			});
		}

		// 2. 分页查询（先排序：置顶优先，按时间倒序）
		const skipNum = (page - 1) * pageSize;
		const result = await query
			.orderBy('isTop', 'desc')
			.orderBy('createTime', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		// 3. 获取总条数（用于分页）
		const countResult = await query.count();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: result.data,
				total: countResult.total,
				page,
				pageSize,
				totalPage: Math.ceil(countResult.total / pageSize)
			}
		};
	} catch (error) {
		console.error('新闻列表查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};