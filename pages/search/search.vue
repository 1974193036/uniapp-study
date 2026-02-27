<template>
	<view class="search-container">
		<!-- 搜索导航组件 -->
		<NavBar :isSearch="true" :parentVal="parentVal" @updateVal="parentVal=$event" @sendSearchData="sendSearchData">
		</NavBar>
		<!-- 搜索包裹 -->
		<view v-if="isShowHistory" class="search-wrapper">
			<!-- 没有进行搜索的操作 -->
			<view class="search-history-container">
				<!-- 头部 -->
				<view class="search-header">
					<text class="history-text">搜索历史</text>
					<text class="history-clean" @click="cleanHistory">清空</text>
				</view>
				<!-- 内容部分 -->
				<view v-if="historyList.length > 0" class="search-history-content">
					<view @click="openHistory(item)" class="history-content-item" v-for="(item, index) in historyList"
						:key="index">{{ item }}</view>
				</view>
				<view v-else class="no-data">当前没有搜索历史</view>
			</view>
		</view>
		<!-- 开始进行搜索的操作 -->
		<view v-else class="search-list-container">
			<ListItem v-if="searchList.length > 0" @saveHistory="saveHistory" :articleList="searchList"
				:isShowLoading="false"></ListItem>
			<view v-else class="no-data">没有搜索到相关数据</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		storeToRefs
	} from 'pinia'
	import {
		useHistoryStore
	} from '@/store/history.js'

	const historyStore = useHistoryStore()
	const {
		historyList
	} = storeToRefs(historyStore)

	const searchList = ref([])
	const isShowHistory = ref(true)
	const parentVal = ref('')

	// 开始进行内容搜索
	const {
		proxy
	} = getCurrentInstance()
	async function sendSearchData() {
		isShowHistory.value = false
		if (!parentVal.value) {
			isShowHistory.value = true
			searchList.value = []
			return
		}
		const {
			articleList,
		} = await proxy.$http.get_search_data({
			searchVal: parentVal.value
		})
		searchList.value = articleList || []
	}

	// 保存搜索记录
	function saveHistory() {
		historyStore.setHistory(parentVal.value)
	}

	// 弹出搜索内容
	function openHistory(val) {
		parentVal.value = val
		sendSearchData()
	}
	
	// 清空搜索记录
	function cleanHistory() {
		historyStore.cleanHistory()
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
		height: 100%;
		display: flex;
	}
</style>
<style lang="scss" scoped>
	@import './css/search.scss'
</style>