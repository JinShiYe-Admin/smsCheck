<template>
	<view>
		<web-view :src="pageSrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageSrc:this.PRIVACE
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({title: '隐私政策'});
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
