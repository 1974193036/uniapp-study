'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		searchVal,
	} = event

	const list = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		// 使用正则表达式进行模糊匹配，只要是包含，就进行返回操作
		.match({
			title: new RegExp(searchVal)
		})
		.project({
			content: 0 // 本次查询不需要返回文章详情给前端
		})
		.end()


	//返回数据给客户端
	return {
		code: 1,
		msg: "搜索数据请求成功",
		data: {
			articleList: list.data
		},
	}
};