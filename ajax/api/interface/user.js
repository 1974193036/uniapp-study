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

/* 关注作者 */
export const update_follow_author = data => ajax({
  name: 'update_follow_author',
  data
})
