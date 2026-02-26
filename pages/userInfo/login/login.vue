<template>
	<view class="login-container">
		<image src="/static/img/login_bg.png" class="banner-bg" mode=""></image>
		<!-- 导航 -->
		<view class="login-nav">
			<view class="nav-item" :class="{'active':type==='account'}" @click="changFormType('account')">
				账号登录
			</view>
			<view class="nav-item" :class="{'active':type !=='account'}" @click="changFormType('mobile')">
				手机登录
			</view>
		</view>
		<!-- 表单部分 -->
		<uni-forms class="form" ref="formRef" :modelValue="formData" :rules="formRules">
			<view class="" v-if="type ==='account'">
				<uni-forms-item label="账号" name="loginName">
					<input placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入账号"
						v-model="formData.loginName" />
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input" type="password"
						placeholder="请输入密码" v-model="formData.password"></uni-easyinput>
				</uni-forms-item>
			</view>
			<view class="" v-else>
				<uni-forms-item label="手机号" name="phone">
					<uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input" type="number"
						placeholder="请输入手机号" v-model="formData.phone"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<input placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入密码"
						v-model="formData.vCode" />
					<SendCode class="code-component" @setCurrentCode="mobileCode = $event" @getForm="getForm"></SendCode>
				</uni-forms-item>
			</view>

			<button class="login-btn" @click="handleLogin">立即登录</button>
		</uni-forms>

		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		userRules
	} from '@/utils/formValidate.js'
	import {
		useUserStore
	} from '@/store/user'

	const userStore = useUserStore()

	const type = ref('account')
	const formRef = ref()
	const mobileCode = ref('')

	const validateMobileCode = (rule, val, data, callback) => {
		switch (true) {
			case val !== mobileCode.value:
				callback('请输入正确的验证码')
				break
			default:
				return true
		}
	}
	const formRules = {
		...userRules,
		vCode: {
			rules: [
				...userRules.vCode.rules.filter(r => !r.validateFunction), // 保留非自定义验证
				{
					validateFunction: validateMobileCode
				} // 添加新的自定义验证
			]
		}
	}
	// console.log(formRules)

	const formData = ref({
		loginName: '',
		password: '',
		phone: '',
		vCode: '',
	})

	async function handleLogin() {
		try {
			const res = await formRef.value.validate()
			// console.log(res)
			/* 正式向后端发送请求 */
			sendUserInfo({
				...res,
				type: type.value,
			})
		} catch (e) {
			console.log(e)
		}
	}

	/* 开始发送数据到后端 */
	const {
		proxy
	} = getCurrentInstance()
	async function sendUserInfo(data) {
		const userInfo = await proxy.$http.user_login(data)
		// console.log(userInfo)
		if (userInfo) {
			userStore.updateUserInfo(userInfo)
			uni.showToast({
				title: '登录成功',
				icon: 'none',
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	}

	/* 切换当前表单类型 */
	function changFormType(_type) {
		type.value = _type
		formRef.value.clearValidate([]) // 清空校验规则
	}

	function getForm(cb) {
		cb && cb(formRef.value)
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	@import './css/login.scss'
</style>