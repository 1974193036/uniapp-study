'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		userId,
		articleId
	} = event
	// 获取用户Ids集合
	const userInfo = await db.collection('user').doc(userId).get();

	const articleIds = userInfo.data[0].article_likes_ids
	
	let returnMsg = null

	let articleArr = null;
	// 如果包含删除收藏
	if (articleIds.includes(articleId)) {
		articleArr = dbCmd.pull(articleId)
		returnMsg = '取消收藏成功'
	} else {
		articleArr = dbCmd.addToSet(articleId)
		returnMsg = '添加收藏成功'
	}
	
	// console.log('articleArr', articleArr)

	await db.collection('user').doc(userId).update({
		article_likes_ids: articleArr
	})

	const updateUserInfo = await db.collection('user').doc(userId).get()

	//返回数据给客户端
	return {
		code: 1,
		data: {
			operateTip: returnMsg,
			newUserInfo: updateUserInfo.data[0]
		}
	}
};