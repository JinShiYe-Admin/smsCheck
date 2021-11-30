<template style="background-color: red;">
	<view class="warp">
		<uniNavBar title='更多' backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white'></uniNavBar>
		<uni-card style="font-weight: 900;" v-for="(item, index) in tabarMore" :index="index" :key="index">
			<view>{{item.text}}</view>
			<view v-if="item.childList.length>0" style="padding-top: 10px;">
				<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
					<uni-grid-item v-for="(chilItem, chiilIndex) in item.childList" :index="chiilIndex"
						:key="chiilIndex">
						<view class="grid-item-box" @click="clickItem(chilItem)">
							<image :src="chilItem.icon" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 13px;color: #878787;"
								class="text">{{ chilItem.text }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view v-if="item.childList.length==0">
				<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
					<uni-grid-item>
						<view class="grid-item-box" @click="clickItemTab(item)">
							<image :src="item.img_href" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 12px;font-weight: 400;"
								class="text">{{ item.text }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-card>
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabarMore: [],
			}
		},
		methods: {
			clickItem: function(item) {
				console.log('item:' + JSON.stringify(item));
				item.index = 100;
				util.openwithData(item.pagePath, item);
			},
			clickItemTab: function(item) {
				console.log('item:' + JSON.stringify(item));
				item.index = 100;
				util.openwithData(item.pagePath1, item);
				// item.index = 99;
				// util.setTabbarMenu(item);
				// uni.switchTab({
				// 	url: item.pagePath
				// });
			}
		},
		components: {
			uniNavBar
		},
		onLoad(option) {
			this.tabbar = util.getMenu();
			this.tabarMore = util.getMenuMore();
			console.log('this.tabarMore:' + JSON.stringify(this.tabarMore));
		}
	}
</script>

<style>
	.moreImg {
		width: 40px;
		height: 40px;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	page {
		background-color: #f2f2f2;
	}

	.uni-border-bottom ::after {
		border-bottom: 0px solid red !important;
	}
</style>
