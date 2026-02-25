import ajax from '../../http.js'

// 用户登录
export const user_login = data => ajax({
	name: 'user_login',
	data
})

// 获取手机验证码
export const get_code = data => ajax({
  name: "get_code",
  data
})
