// cloudfunctions/user-updateAvatar/index.js
'use strict';
const db = uniCloud.database();
const userCollection = db.collection('Accounts');

exports.main = async (event, context) => {
	const {
		userId,
		avatarUrl
	} = event;

	console.log('更新头像参数：', { userId, avatarUrl });

	try {
		// 参数校验
		if (!userId) {
			return {
				code: 400,
				message: '用户ID不能为空'
			};
		}
		if (!avatarUrl) {
			return {
				code: 400,
				message: '头像URL不能为空'
			};
		}

		// 更新头像
		const res = await userCollection.doc(userId).update({
			avatar: avatarUrl,
			update_time: new Date().getTime()
		});

		console.log('头像更新成功：', res);

		return {
			code: 200,
			message: '头像更新成功',
			data: {
				avatarUrl: avatarUrl
			}
		};
	} catch (error) {
		console.error('更新头像失败：', error);
		return {
			code: 500,
			message: '更新失败：' + error.message,
			error: error.message
		};
	}
};
