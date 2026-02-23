export default ({
	name,
	data = {}
}) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({})
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
				uni.hideLoading()
			}
		})
	})
}