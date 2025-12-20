'use strict';
const db = uniCloud.database();
const commentDB = db.collection('Comment');

exports.main = async (event, context) => {
	try {
		// 解构参数并设置默认值
		const {
			newsId,
			page = 1,
			pageSize = 20
		} = event;

		// 参数校验
		if (!newsId || typeof newsId !== 'string') {
			return {
				code: 400,
				message: '参数错误：缺少有效的新闻ID'
			};
		}
		// 分页参数校验（避免非法值）
		const pageNum = Math.max(1, parseInt(page));
		const sizeNum = Math.max(1, Math.min(50, parseInt(pageSize))); // 限制最大页大小50

		// 计算跳过数
		const skipNum = (pageNum - 1) * sizeNum;

		// 分页查询评论（按时间倒序）
		const commentResult = await commentDB
			.where({
				newsId
			})
			.orderBy('time', 'desc')
			.skip(skipNum)
			.limit(sizeNum)
			.get();

		// 获取总条数（优化：使用count聚合，性能更高）
		const countResult = await commentDB.where({
			newsId
		}).count();

		// 数据脱敏：移除敏感字段
		const commentList = commentResult.data.map(item => {
			delete item._id; // 可选
			delete item.userId; // 可选：根据业务是否隐藏用户ID
			return item;
		});

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: commentList,
				total: countResult.total,
				page: pageNum,
				pageSize: sizeNum,
				totalPage: Math.ceil(countResult.total / sizeNum) // 新增：总页数
			}
		};
	} catch (error) {
		console.error('评论列表查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
		};
	}
};