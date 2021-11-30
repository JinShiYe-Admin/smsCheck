<template>
 	<view class="uni-pagination">
 		<view class="uni-pagination__btn"
 			:class="currentIndex === 0 ? 'uni-pagination--disabled' : 'uni-pagination--enabled'"
 			:hover-class="currentIndex === 0 ? '' : 'uni-pagination--hover'" :hover-start-time="20"
 			:hover-stay-time="70" @click="clickLeft">
 			<template>
 				<uni-icons :style="{'color':backColor}" size="16" type="arrowleft" />
 			</template>
 		</view>
 		<view class="uni-padding-wrap" style="width: 100%;margin-top: 10px;">
 			<view class="page-section swiper">
 				<view class="page-section-spacing">
 					<swiper class="swiper" :current="currentIndex" @change="changeSwiper">
 						<swiper-item v-for="(model,index) in allValue" :key='index'>
 							<view class="swiper-item">
 								<view style="width: 100%;border-radius: 10px;padding-top: 3px;padding-bottom: 3px;text-align: center;" :style="showBackColor?{'background':backColor,'color':textColor}:''" class="title">
									<uni-badge v-if="showIndex" :text='index+1' type='error' size="small"></uni-badge>
 									{{model.text}}</view>
 							</view>
 						</swiper-item>
 					</swiper>
 				</view>
 			</view>
 		</view>
 		<view class="uni-pagination__btn"
 			:class="currentIndex >= allValue.length-1 ? 'uni-pagination--disabled' : 'uni-pagination--enabled'"
 			:hover-class="currentIndex === allValue.length-1 ? '' : 'uni-pagination--hover'" :hover-start-time="20"
 			:hover-stay-time="70" @click="clickRight">
 			<template>
 				<uni-icons :style="{'color':backColor}" size="16" type="arrowright" />
 			</template>
 		</view>
 	</view>
 </template>

 <script>
 	/**
 	 * Pagination 分页器
 	 * @description 分页器组件，用于展示页码、请求数据等
 	 * @property {Array} allValue 滑动分页数组
 	 * @property {String} backColor 背景色
	 * @property {String} textColor 字体颜色
	 * @property {String} current 当前索引
 	 * @event {Function} change 点击页码按钮时触发 ,e={type,current} current为当前页，type值为：next/prev，表示点击的是上一页还是下一个
 	 */

 	export default {
 		name: 'my-swiperPage',
		emits: ['swiperPagechange'],
 		props: {
 			allValue: {
 				type: [Array],
 				default () {
 					return [{
 						text: '暂无'
 					}]
 				}
 			},
			showBackColor: {//是否显示背景色
				type: [Boolean],
				default: false
			},
			showIndex: {//是否显示索引
				type: [Boolean],
				default: false
			},
			backColor: {//背景色、左右按钮颜色
				type: [String],
				default: '#00CFBD'
			},
			textColor: {//字体颜色
				type: [String],
				default: 'white'
			},
 			current: {
 				type: [Number, String],
 				default: 0
 			},
 		},
 		data() {
 			return {
 				currentIndex: 0,
 			}
 		},
 		watch: {
 			current(val) {
 				console.log('watch--current:' + val);
 				this.currentIndex = val
 			},
 		},
 		methods: {
			changeSwiper(e){
				console.log('changeSwiper:'+e.detail.current);
				this.currentIndex = e.detail.current;
				this.change();
			},
 			clickLeft() {
 				if (Number(this.currentIndex) === 0) {
 					return
 				}
 				this.currentIndex -= 1;
 				// this.change();
 			},
 			clickRight() {
				console.log('clickRight1111100');
 				if (Number(this.currentIndex) >= this.allValue.length-1) {
 					return;
 				}
				console.log('clickRight1111111');
 				this.currentIndex += 1;
 				// this.change();
 			},
 			change(e) {
 				this.$emit('swiperPagechange', {
 					index: this.currentIndex
 				});
 			}
 		}
 	}
 </script>

 <style scoped>
 	.uni-pagination {
 		/* #ifndef APP-NVUE */
 		display: flex;
 		/* #endif */
 		position: relative;
 		overflow: hidden;
 		flex-direction: row;
 		justify-content: center;
 		align-items: center;
		margin-bottom: 10px;
 	}

 	.uni-pagination__btn {
 		/* #ifndef APP-NVUE */
 		display: flex;
 		cursor: pointer;
 		/* #endif */
 		padding: 0 8px;
 		line-height: 30px;
 		font-size: 14px;
 		position: relative;
 		/* background-color: #f4f4f5; */
 		flex-direction: row;
 		justify-content: center;
 		align-items: center;
 		text-align: center;
 	}

 	.uni-pagination--enabled {
 		color: #333333;
 		opacity: 1;
 	}

 	.uni-pagination--disabled {
 		opacity: 0.5;
 		/* #ifdef H5 */
 		cursor: default;
 		/* #endif */
 	}

 	.uni-pagination--hover {
 		color: rgba(0, 0, 0, 0.6);
 		background-color: #f1f1f1;
 	}

 	uni-swiper {
 		height: 30px;
 	}
	
	::v-deep .uni-badge {
		line-height: 15px;
	}
	
	.title {
		height: 100%;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
 </style>
