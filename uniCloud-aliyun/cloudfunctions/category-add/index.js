'use strict';
const db = uniCloud.database();
const categoryDB = db.collection('Category');

exports.main = async (event, context) => {
	const {
		name,
		sort = 0,
		status = 1
	} = event;

	if (!name) {
		return {
			code: 400,
			message: '缺少分类名称'
		};
	}

	try {
		// 检查分类名称是否已存在
		const existResult = await categoryDB
			.where({
				name
			})
			.get();

		if (existResult.data.length > 0) {
			return {
				code: 409,
				message: '分类名称已存在'
			};
		}

		const result = await categoryDB.add({
			name: name.trim(),
			sort,
			status,
			createTime: new Date()
		});

		return {
			code: 200,
			message: '分类添加成功',
			data: {
				categoryId: result.id
			}
		};
	} catch (error) {
		console.error('分类添加失败：', error);
		return {
			code: 500,
			message: '分类添加失败',
			errMsg: error.message
		};
	}
};