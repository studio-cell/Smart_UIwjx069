'use strict';
const db = uniCloud.database();
const topicDB = db.collection('Topic');

exports.main = async (event, context) => {
	const {
		category = '',
		page = 1,
		pageSize = 10,
		keyword = ''
	} = event;

	try {
		const skipNum = (page - 1) * pageSize;
		let whereCondition = {};

		// 按分类筛选
		if (category && category !== '推荐') {
			whereCondition.category = category;
		}

		// 按关键词搜索
		if (keyword) {
			whereCondition = {
				...whereCondition,
				$or: [
					{ title: new RegExp(keyword, 'i') },
					{ tag: new RegExp(keyword, 'i') }
				]
			};
		}

		// 查询总数
		const countResult = await topicDB.where(whereCondition).count();

		// 查询列表，按热度降序
		const listResult = await topicDB
			.where(whereCondition)
			.orderBy('hotValue', 'desc')
			.skip(skipNum)
			.limit(pageSize)
			.get();

		return {
			code: 200,
			message: '查询成功',
			data: {
				list: listResult.data,
				total: countResult.total,
				page,
				pageSize
			}
		};
	} catch (error) {
		console.error('查询话题列表失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};
