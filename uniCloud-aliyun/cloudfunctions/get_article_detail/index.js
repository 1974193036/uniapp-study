'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		article_id
	} = event;

	const articleList = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		.match({ // 根据匹配条件进行数据返回
			_id: article_id
		})
		.end()

	//返回数据给客户端
	return {
		code: 1,
		msg: "文章获取成功",
		data: articleList.data[0]
	}
};