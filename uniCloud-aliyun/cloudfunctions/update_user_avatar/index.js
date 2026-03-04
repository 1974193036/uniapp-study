'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		userId,
		filePath
	} = event

	// 更新用户操作
	const user = await db.collection('user').doc(userId).get()
	const oldUrl = user.data[0].avatar
	try {
		await uniCloud.deleteFile({
			fileList: [oldUrl],
		});
	} catch (e) {
		console.log(e)
	}
	// 更新作者头像
	const id = user.data[0].id
	let res = await db.collection('article').where({
		'author.id': id
	}).update({
		'author.avatar': filePath
	})

	await db.collection('user').doc(userId).update({
		avatar: filePath
	})

	//返回数据给客户端
	return {
		code: 1,
		data: {
			msg: "修改头像成功",
		}
	}
}
