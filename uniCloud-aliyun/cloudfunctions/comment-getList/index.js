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

		console.log('查询评论参数：', { newsId, page, pageSize });

		// 参数校验
		if (!newsId) {
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
				newsId: String(newsId) // 确保类型一致
			})
			.orderBy('time', 'desc')
			.skip(skipNum)
			.limit(sizeNum)
			.get();

		console.log('查询到的评论数：', commentResult.data.length);

		// 获取总条数（优化：使用count聚合，性能更高）
		const countResult = await commentDB.where({
			newsId: String(newsId)
		}).count();

		console.log('评论总数：', countResult.total);

		// 返回完整数据，不删除字段
		const commentList = commentResult.data.map(item => ({
			...item,
			commentId: item._id, // 添加 commentId 字段方便前端使用
			_id: item._id
		}));

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
			errMsg: error.message
		};
	}
};