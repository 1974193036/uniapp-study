export default ({
	name,
	data = {},
	options = {},
}) => {
	const loading = options.showLoading === true || options.showLoading === undefined
	return new Promise((resolve, reject) => {
		loading && uni.showLoading({})
		uniCloud.callFunction({
			name,
			data,
			success({
				result
			}) {
				if (result.code === 1) {
					resolve(result.data)
				} else {
					uni.showToast({
						icon: "none",
						title: result.msg
					})
				}
			},
			fail(err) {
				reject(err)
			},
			complete() {
				loading && uni.hideLoading()
			}
		})
	})
}