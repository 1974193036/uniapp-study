import {
	ref,
	computed
} from 'vue'
import {
	defineStore
} from 'pinia'

export const useHistoryStore = defineStore('history', () => {
	// State - 使用 ref 定义响应式数据
	const historyList = ref(uni.getStorageSync('historyList') || [])

	// Actions - 修改状态的方法
	const setHistory = (val) => {
		let list = historyList.value
		// 判断是否包含当前搜索的内容，包含直接不执行任何操作
		if (list.length > 0 && list.findIndex(item => item === val) > -1) return
		list.unshift(val)
		uni.setStorageSync('historyList', list)
		historyList.value = list
	}

	const cleanHistory = () => {
		uni.removeStorageSync('historyList')
		historyList.value = []
	}

	return {
		// State
		historyList,
		// Actions
		setHistory,
		cleanHistory,
	}
})