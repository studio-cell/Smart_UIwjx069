'use strict';
const db = uniCloud.database();
const newsDB = db.collection('News');

exports.main = async (event, context) => {
	try {
		const {
			newsId
		} = event;

		// 参数校验
		if (!newsId || typeof newsId !== 'string') {
			return {
				code: 400,
				message: '参数错误：缺少有效的新闻ID'
			};
		}

		// 查询单条新闻
		const result = await newsDB.doc(newsId).get();

		// 新闻不存在处理
		if (result.data.length === 0) {
			return {
				code: 404,
				message: '新闻不存在或已下架'
			};
		}

		// 返回新闻详情（脱敏处理，避免敏感字段泄露）
		const newsDetail = result.data[0];
		delete newsDetail._id; // 可选：根据业务需求是否返回_id

		return {
			code: 200,
			message: '查询成功',
			data: newsDetail
		};
	} catch (error) {
		console.error('新闻详情查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
		};
	}
};