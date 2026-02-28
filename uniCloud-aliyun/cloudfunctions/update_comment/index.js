'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		userId,
		articleId,
		content
	} = event

	// 进行用户信息获取
	let user = await db.collection('user').doc(userId).get()
	user = user.data[0]

	// const article = await db.collection('article').doc(articleId).get()

	function generatedId(num) {
		return Number(Math.random().toString().substr(3, num) + Date.now()).toString(36)
	}

	let commentObj = {
		comment_id: generatedId(5),
		comment_content: content,
		create_time: Date.now(),
		is_reply: false,
		author: {
			author_id: user._id,
			author_name: user.author_name,
			avatar: user.avatar,
			professional: user.professional
		},
		replyArr: []
	}

	commentObj = dbCmd.unshift({
		...commentObj
	})
	// console.log('commentObj', commentObj)
	await db.collection('article').doc(articleId).update({
		comments: commentObj
	})

	//返回数据给客户端
	return {
		code: 1,
		data: {
			msg: '添加数据成功'
		}
	}
};