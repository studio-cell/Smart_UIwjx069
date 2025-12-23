// cloudfunctions/news-getList/index.js
'use strict';
const db = uniCloud.database();
const _ = db.command; // 引入数据库操作符，用于组合查询条件
const newsDB = db.collection('News'); // 保留你原有的集合名（大写News）

exports.main = async (event, context) => {
	try {
		// 接收前端传的所有参数，保留你原有的参数
		const {
			category, // 分类名称
			page = 1, // 页码
			pageSize = 10, // 每页条数
			isTop = null, // 是否置顶筛选
			isAd = null // 是否广告筛选
		} = event;

		// 1. 构建查询条件（合并所有筛选条件，避免多次where覆盖）
		let whereCondition = {};
		// 分类筛选（保留原有逻辑）
		if (category) {
			whereCondition.category = category;
		}
		// 是否置顶筛选（保留原有逻辑）
		if (isTop !== null) {
			whereCondition.isTop = isTop;
		}
		// 是否广告筛选（保留原有逻辑）
		if (isAd !== null) {
			whereCondition.isAd = isAd;
		}

		// 2. 构建查询（保留排序：置顶优先、按时间倒序）
		let query = newsDB.where(whereCondition)
			.orderBy('isTop', 'desc')
			.orderBy('createTime', 'desc');

		// 3. 分页逻辑（保留原有分页）
		const skipNum = (page - 1) * pageSize;
		// 查当前页数据
		const result = await query.skip(skipNum).limit(pageSize).get();
		// 查总条数（用于前端判断是否有更多）
		const countResult = await newsDB.where(whereCondition).count();

		// 4. 返回格式（保留你原有的所有返回字段，不丢功能）
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