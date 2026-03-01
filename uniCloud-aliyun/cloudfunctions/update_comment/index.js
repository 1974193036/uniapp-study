'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		userId,
		articleId,
		content,
		comment_id = '',
		reply_id = '',
		is_reply = false
	} = event

	// 进行用户信息获取
	let user = await db.collection('user').doc(userId).get()
	user = user.data[0]

	// 获取文章的数据表
	const article = await db.collection('article').doc(articleId).get()
	// 获取指定文章下的所有的评论内容
	const comments = article.data[0].comments


	function generatedId(num) {
		return Number(Math.random().toString().substr(3, num) + Date.now()).toString(36)
	}

	let commentObj = {
		comment_id: generatedId(5),
		comment_content: content,
		create_time: Date.now(),
		is_reply,
		author: {
			author_id: user._id,
			author_name: user.author_name,
			avatar: user.avatar,
			professional: user.professional
		},
		replyArr: []
	}

	if (comment_id === '') {
		commentObj.replyArr = [];
		commentObj = dbCmd.unshift({
			...commentObj
		})
	} else {
		let commentAuthor = null
		// 获取对当前这一条评论的子回复的索引值获取
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)
		if (is_reply) {
			commentAuthor = comments[commentIndex].replyArr.find(item => item.comment_id === reply_id).author.author_name
		} else {
			commentAuthor = comments.find(item => item.comment_id === comment_id).author.author_name
		}

		commentObj.to = commentAuthor
		commentObj = {
			[commentIndex]: {
				replyArr: dbCmd.unshift(commentObj)
			}
		}
	}


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