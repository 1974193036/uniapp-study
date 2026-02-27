<template>
	<view class="label-container">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit" @click="startEdit">{{isEdit? '完成' :'编辑'}}</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item,index) in selfLabelList" :key="index">
					{{item.name}}
					<uni-icons v-if="isEdit" @click="deleteLabelItem(item)" class="icon-close" type="clear" size="20"
						color="red"></uni-icons>
				</view>
				<view class="no-data" v-if="!selfLabelList.length">当前没有数据</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" @click="changeSelfList(item)" v-for="(item,index) in recommentLabelList"
					:key="index">
					{{item.name}}
				</view>
				<view v-if="!recommentLabelList.length" class="no-data">当前没有数据</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		getCurrentInstance
	} from 'vue'
	import {
		useLabelStore
	} from '@/store/label.js'
	import {
		useUserStore
	} from '@/store/user.js'
	import {
		storeToRefs
	} from 'pinia'

	const userStore = useUserStore()
	const {
		userInfo
	} = storeToRefs(userStore)

	const labelIds = ref([])

	watch(userInfo, val => {
		labelIds.value = [...(val.label_ids || [])]
	}, {
		immediate: true
	})

	const labelStore = useLabelStore()
	const {
		labelList
	} = storeToRefs(labelStore)


	const selfLabelList = computed(() => {
		return labelList.value.filter(item => labelIds.value.includes(item._id))
	})

	const recommentLabelList = computed(() => {
		return labelList.value.filter(item => !labelIds.value.includes(item._id) && item._id)
	})

	const isEdit = ref(false)

	function startEdit() {
		if (isEdit.value) {
			updateLabel()
		}
		isEdit.value = !isEdit.value
	}

	const {
		proxy
	} = getCurrentInstance()

	async function updateLabel() {
		// console.log('updateLabel')
		const label_ids = selfLabelList.value.map(item => item._id)
		const res = await proxy.$http.update_label_ids({
			userId: userInfo.value._id,
			label_ids
		});
		uni.showToast({
			title: res.msg
		})
		userStore.updateUserInfo({
			...userInfo.value,
			label_ids
		})
	}

	function changeSelfList(item) {
		if (!isEdit.value) return
		labelIds.value.push(item._id)
	}

	function deleteLabelItem(item) {
		labelIds.value = labelIds.value.filter(v => v !== item._id)
	}
</script>

<style lang="scss" scoped>
	@import "./css/labelAdmin.scss";
</style>