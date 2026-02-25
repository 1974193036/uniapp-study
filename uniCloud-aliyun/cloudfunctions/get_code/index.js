'use strict';
exports.main = async (event, context) => {
	const {
		phone
	} = event;
	// 验证码长度
	const CODE_LENGTH = 6
	// 创建一个随机数，返回给前端
	const currentNumber = Math.random().toString().substring(2, CODE_LENGTH + 2)

	try {
		const res = await uniCloud.sendSms({
			appid: '__UNI__9DCFC8A', // mainfest.json中进行获取
			smsKey: '',
			smsSecret: '',
			phone,
			templateId: '12333', // 获取的短信模版
			data: { // 短信模版中的变量参数
				code: currentNumber,
				expMinute: '1',
			}
		})
		// 调用成功，请注意这时不代表发送成功
		return {
			code: 1,
			data: currentNumber,
			msg: '请在手机注意查收验证码'
		}
	} catch (err) {
		return {
			code: 0,
			data: null,
			msg: '短信验证码发送失败'
		}
	}
};