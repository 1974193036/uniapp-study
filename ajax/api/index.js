const requireApi = import.meta.glob('./interface/**/*.js', {
	eager: true
});

const module = {};

const keys = Object.keys(requireApi)
keys.forEach((key, index) => {
	const moduleApi = requireApi[key]
	Object.keys(moduleApi).forEach(fnName => {
		module[fnName] = moduleApi[fnName]
	})
})

export default module