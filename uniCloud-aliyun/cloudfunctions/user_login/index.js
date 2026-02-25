'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		loginName,
		password,
		phone,
		type
	} = event;

	const {
		affectedDocs,
		data
	} = await db.collection('user')
		.aggregate() // 使用聚合的形式进行数据的获取
		.match(type === 'account' ? { // 根据匹配条件进行数据返回
			loginName,
			password
		} : {
			phone
		})
		.end()

	//返回数据给客户端
	return affectedDocs ? {
		code: 1,
		msg: "获取用户信息成功",
		data: data[0]
	} : {
		code: 0,
		msg: type === 'account' ? '获取用户信息失败，请检查用户名或密码' : '验证码或手机号码错误'
	}
};