<template>
	<view class="steps">
		<view class="date">
			<view class="dateTop">
				<!-- <text>{{item[date] | dateFormat('yyyy-MM-dd')}}</text> -->
				<slot name='dateTop'></slot>
			</view>
			<view class="">
				<!-- 全局filter时间格式化 -->
				<!-- <text>{{item[date] | dateFormat('hh:mm:ss')}}</text> -->
				<slot name='dateBot'></slot>
			</view>
		</view>
		<view class="tail"></view>
		<view class="node"></view>
		<view class="wrapper">
			<view class="">
				<text>{{item[wrapperStatus]}}</text>
				<slot name='status'></slot>
			</view>
			<view class="wrapperTitle">
				<text>{{item[wrapperTitle]}}</text>
				<slot name='content'></slot>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	activity: 当前进度条状态
	wrapperStatus：流程状态对应字段
	wrapperTitle：详情对应字段
	index：进度条
	date：时间
	 */
	export default {
		name: 'm-steps',
		data() {
			return {

			}
		},
		props: {
			item: {
				type: Object,
			},
			activity: {
				type: Number,
				default: 0
			},
			wrapperStatus: {
				type: String,
				default: 'status'
			},
			wrapperTitle: {
				type: String,
				default: 'content'
			},
			date: {
				type: String,
				default: 'date'
			},
			index: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss" scoped>
		.steps {
			position: relative;
			padding-bottom: 40rpx;

			&:last-child {
				.tail {
					display: none;
				}
			}
			
			// .dateTop{
			// 	.dateTopStyle{
			// 		width: 200rpx;
			// 		text-align: center;
			// 	}
			// }

			.date {
				position: absolute;
				top: -6rpx;
				color: #AAAAAA;
				text-align: center;
				font-size: 30rpx;
			}

			// .active-tail {
			// 	border-left: 2px solid #00CFBD !important
			// }

			// .active-node {
			// 	background-color: #00CFBD !important;
			// }

			.tail {
				position: absolute;
				left: 200rpx;
				height: 100%;
				border-left: 4rpx solid #00CFBD
			}

			.node {
				left: 190rpx;
				width: 24rpx;
				height: 24rpx;
				position: absolute;
				background-color: #00CFBD;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.wrapper {
				position: relative;
				padding-left: 240rpx;
				top: -6rpx;
				.wrapperTitle{
					color: #AAAAAA;
					padding-top: 10rpx;
					padding-right: 40rpx;
					word-wrap: break-word;
					word-break: break-all;
					white-space: pre-line;
				}
			}
		}
</style>
