'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		userId
	} = event

	let userInfo = await db.collection('user').doc(userId).get()
	let article_ids = userInfo.data[0].article_ids

	const list = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		.project({
			content: 0, // 本次查询不需要返回content给前端
			comments: 0
		})
		.match({
			id: dbCmd.in(article_ids)
		})
		.end()

	//返回数据给客户端
	return {
		code: 1,
		msg: "请求成功",
		data: list.data
	}
};