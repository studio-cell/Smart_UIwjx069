'use strict';
const db = uniCloud.database();
// 注意：集合名保持和你的云数据库一致（如 Video/Videq，无需修改）
const videoDB = db.collection('Video');

exports.main = async (event, context) => {
	const {
		topicId, // 原有参数：话题ID（可选，不传则按分类/全量查询）
		category = "推荐", // 新增参数：视频分类，默认“推荐”（返回全量）
		page = 1,
		pageSize = 10
	} = event;

	try {
		const skipNum = (page - 1) * pageSize;
		let whereCondition = {}; // 查询条件容器

		// 核心判断：区分两种查询模式
		if (topicId) {
			// 模式1：传入 topicId，按话题查询（保留原有功能，不影响旧逻辑）
			whereCondition = {
				topicId
			};
		} else {
			// 模式2：未传入 topicId，按分类/全量查询（新增功能，适配你的视频列表）
			whereCondition = category === "推荐" ? {} : {
				category
			};
		}

		// 统一执行查询（总数 + 分页列表），复用原有逻辑，减少冗余
		const countResult = await videoDB.where(whereCondition).count();
		const listResult = await videoDB
			.where(whereCondition)
			.orderBy('createTime', 'desc')
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
		console.error('视频查询失败：', error);
		return {
			code: 500,
			message: '查询失败',
			errMsg: error.message
		};
	}
};