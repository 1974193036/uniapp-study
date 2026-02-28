'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		articleId,
		pageSize = 10,
		page = 1
	} = event;

	const list = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		.match({ // 根据匹配条件进行数据返回
			_id: articleId,
		})
		.unwind('$comments') // 从指定的节点进行内容的获取
		.project({
			_id: 0, // 本次查询不需要返回_id给前端
			comments: 1 // 本次查询只返回comments
		})
		.replaceRoot({
			newRoot: '$comments'
		})
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end()

	//返回数据给客户端
	return {
		code: 1,
		msg: '数据请求成功',
		data: list.data
	}
};