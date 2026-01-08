'use strict';
const db = uniCloud.database();
const topicDB = db.collection('Topic');

exports.main = async (event, context) => {
	const {
		title,
		tag,
		category,
		hotValue = '0',
		commentCount = 0,
		likeCount = 0
	} = event;

	try {
		if (!title || !tag || !category) {
			return {
				code: 400,
				message: '缺少必要参数：title、tag、category'
			};
		}

		const result = await topicDB.add({
			title,
			tag,
			category,
			hotValue,
			commentCount,
			likeCount,
			createTime: new Date().getTime(),
			updateTime: new Date().getTime()
		});

		return {
			code: 200,
			message: '话题创建成功',
			data: {
				topicId: result.id
			}
		};
	} catch (error) {
		console.error('创建话题失败：', error);
		return {
			code: 500,
			message: '创建失败',
			errMsg: error.message
		};
	}
};
