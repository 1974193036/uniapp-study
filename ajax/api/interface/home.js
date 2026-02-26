import ajax from '../../http.js'

/* 获取标签列表 */
export const get_label_list = data => ajax({
	name:'get_label_list',
	data
})

/* 获取文章列表 */
export const get_article_list = data => ajax({
	name:"get_article_list",
	data,
	options: {
		showLoading: false
	}
})

/* 修改收藏状态 */
export const update_save_like = data => ajax({
  name: 'update_save_like',
  data
})