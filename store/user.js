// stores/user.js
import {
	ref
} from 'vue'
import {
	defineStore
} from 'pinia'

// 默认用户信息结构
const defaultUserInfo = {
	id: '',
	loginName: '',
	phone: '',
	avatar: '',
}

export const useUserStore = defineStore('user', () => {
	// State - 使用 ref 定义响应式数据
	const userInfo = ref({
		...defaultUserInfo,
		...(uni.getStorageSync('userInfo') || {})
	})

	// Actions - 修改状态的方法
	const updateUserInfo = (data) => {
		userInfo.value = {
			...userInfo.value,
			...data
		}
		uni.setStorageSync('userInfo', userInfo.value);
	}

	// 重置状态（方便调用）
	const reset = () => {
		userInfo.value = {
			...defaultUserInfo
		}
		uni.removeStorageSync('userInfo')
	}

	return {
		// State
		userInfo,
		// Actions
		updateUserInfo,
		reset
	}
})