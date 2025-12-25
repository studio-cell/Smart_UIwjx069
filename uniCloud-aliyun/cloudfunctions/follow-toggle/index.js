'use strict';
const db = uniCloud.database();
const followCollection = db.collection('follow');

exports.main = async (event, context) => {
  const { userId, authorId, isFollowed } = event;
  try {
    if (isFollowed) {
      // 关注：新增关注记录
      await followCollection.add({
        userId,
        authorId,
        createTime: Date.now()
      });
    } else {
      // 取消关注：删除关注记录
      await followCollection.where({ userId, authorId }).remove();
    }
    return { code: 200, message: '操作成功' };
  } catch (error) {
    return { code: 500, message: '操作失败' };
  }
};