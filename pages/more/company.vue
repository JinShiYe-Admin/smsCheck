<template>
	<view>
		<web-view :src="pageSrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageSrc:'http://www.jsy8800.com'
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({title: '公司介绍'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
