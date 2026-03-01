'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		userId,
		authorId
	} = event

	const user = await db.collection('user').doc(userId).get()
	const authorLikesIds = user.data[0].author_likes_ids
	let returnMsg = ''

	let author_ids = null
	if (authorLikesIds.includes(authorId)) {
		returnMsg = '取消关注成功'
		author_ids = dbCmd.pull(authorId)
	} else {
		returnMsg = '关注作者成功'
		author_ids = dbCmd.addToSet(authorId)
	}

	// 将处理完的内容进行重新插入
	await db.collection('user').doc(userId).update({
		author_likes_ids: author_ids
	})

	//返回数据给客户端
	return {
		code: 1,
		data: {
			msg: returnMsg
		}
	}
};