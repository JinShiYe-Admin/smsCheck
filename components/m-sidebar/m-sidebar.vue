<template>
	<view class="sidebar">
		<view class="sidebar_tab">
			<view class="sidebar_ico">
			</view>
			<view class="sidebar_title">
				{{title}}
			</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'm-sidebar',
		props:{
			title: String,
		},
		data() {
			return{}
		}
	}
</script>

<style lang="scss" scoped>
	.sidebar_tab{
		display: flex;
		align-items: center;
		.sidebar_ico{
			border-width: 0px;
			    width: 2px;
			    height: 18px;
			    background: inherit;
			    background-color: rgba(19, 98, 253, 1);
			    border: none;
			    border-radius: 2px;
			    box-shadow: none;
		}
		.sidebar_title{
			margin-left: 20rpx;
			font-weight: bold;
			font-size: 32rpx;
		}
	}
	
</style>
