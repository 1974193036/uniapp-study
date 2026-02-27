// stores/user.js
import {
	ref,
	computed
} from 'vue'
import {
	defineStore
} from 'pinia'

export const useLabelStore = defineStore('label', () => {
	// State - 使用 ref 定义响应式数据
	const labelList = ref(uni.getStorageSync('labelList') || [])

	// Actions - 修改状态的方法
	const setLabelList = (_labelList) => {
		uni.setStorageSync('labelList', _labelList)
		labelList.value = _labelList
	}

	return {
		// State
		labelList,
		// Actions
		setLabelList,
	}
})