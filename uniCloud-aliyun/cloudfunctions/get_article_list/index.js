'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)

	const {
		classify
	} = event

	let matchObj = {}

	if (classify !== '全部') {
		matchObj = {
			classify
		}
	}

	const collection = db.collection('article')
	const res = await collection
		.aggregate() // 使用聚合的形式进行数据的获取
		.match(matchObj)   // 根据匹配条件进行数据返回
		.project({
			content: 0 // 本次查询不需要返回文章详情给前端
		})
		.end()

	//返回数据给客户端
	return {
		code: 1,
		data: res.data || [],
		msg: '成功'
	}
};