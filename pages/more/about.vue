<template>
	<view>
		<view style="margin-top: 30px;text-align: center;">
			<image style="width: 150px;height: 150px;" src="../../static/logo.png"></image>
			<view>大学校园</view>
		</view>
		<view style="height: 15px;background-color: #DCDFE6;margin-top: 30px;"></view>
		<uni-list>
		    <uni-list-item title="公司介绍" @click="gongsi" link to="" ></uni-list-item>
		    <uni-list-item title="用户隐私政策" link to="" @click="yinsi" ></uni-list-item>
		</uni-list>
		<view class="uni-list-cell" style="height: 70px;">
			<view class="uni-list-cell-left" style="width: 90px;">
				投诉反馈
			</view>
			<view class="uni-list-cell-db" style="margin-right: 20px;">
				如果您有任何建议或问题欢迎给我们发送邮件： <a href="mailto:kf@jsy8800.com">&emsp;&emsp;kf@jsy8800.com</a>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			uni.setNavigationBarTitle({title: '关于'});
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
			yinsi: function() {
				util.openwithData('/pages/more/privace');
			},
			gongsi: function() {
				util.openwithData('/pages/more/company');
			},
		}
	}
</script>

<style>
	.uni-list-cell {
		height: 50px;
	}
	.uni-list-cell::after {
	    left: 0px;
	}
</style>
