'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		articleId,
		userId
	} = event;

	const userList = await db.collection('user').doc(userId).get()
	const thumbs_up_article_ids = userList.data[0].thumbs_up_article_ids
	let tempArr = null
	let returnMsg = ''
	let thumbsNumber = null

	if (thumbs_up_article_ids.includes(articleId)) {
		tempArr = dbCmd.pull(articleId)
		thumbsNumber = -1
		returnMsg = '您取消了点赞'
	} else {
		tempArr = dbCmd.addToSet(articleId)
		thumbsNumber = 1
		returnMsg = '点赞成功'
	}

	// 处理用户字段
	await db.collection('user').doc(userId).update({
		thumbs_up_article_ids: tempArr
	})

	// 处理文章数量字段
	await db.collection('article').doc(articleId).update({
		thumbs_up_count: dbCmd.inc(thumbsNumber)
	})


	//返回数据给客户端
	return {
		code: 1,
		data: {
			msg: returnMsg
		}
	}
};