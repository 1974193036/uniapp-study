const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

function validateLoginName(rule, val, data, callback) {
	switch (true) {
		case val.length < 6:
			callback('用户名长度不正确')
			break;
		default:
			return true
	}
}

function validatePhone(rule, val, data, callback) {
	switch (true) {
		case !mobileReg.test(val):
			callback('手机号码格式不正确')
			break;
		default:
			return true
	}
}

export const userRules = {
	loginName: {
		rules: [{
				required: true,
				'errorMessage': "账户名不能为空"
			},
			{
				validateFunction: validateLoginName
			} // 自定义验证规则
		]
	},
	password: {
		rules: [{
			required: true,
			'errorMessage': "密码不能为空"
		}, ]
	},
	phone: {
		rules: [{
				required: true,
				'errorMessage': "电话号码不能为空"
			},
			{
				validateFunction: validatePhone
			} // 自定义验证规则
		]
	},
	vCode: {
		rules: [{
				required: true,
				'errorMessage': "验证码不能为空"
			},
		]
	}
}