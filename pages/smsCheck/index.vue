<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;margin-right: 5px;">
				<picker style="flex: 1;" @change="dptClick" :value="schIndex" :range="schList" range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="schList[schIndex].text"></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="userClick" :value="smsTypeIndex" :range="smsTypeList"
					range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="smsTypeList[smsTypeIndex].text"></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 37px;">
			dddd
			<!-- <uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" /> -->
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		<!-- <u-tabbar-my v-if='tabBarItem.index>1' :list="tabbar"></u-tabbar-my> -->
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				//顶部筛选框相关内容
				schIndex: 0,
				smsTypeIndex: 0,
				schList: [{
					text: '',
					value: '-1'
				}],
				smsTypeList: [{
					text: '',
					value: '-1'
				}],
				allAreaList: [], //获取到的所有省市区
				showAreaList: [], //实际的省市区
			}
		},
		components: {
			mynavBar
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.tabBarItem = util.getTabbarMenu();
			console.log('this.tabBarItem:' + JSON.stringify(this.tabBarItem));
			uni.setNavigationBarTitle({
				title: this.tabBarItem.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//79.获取某人接收的通知单列表
			// this.getPageList();
			// this.getSch();
			// 1.21:系统地区列表
			this.getSysArea();
		},
		methods: {
			dptClick: function(e) {
				if (this.schIndex !== e.detail.value) {
					this.schIndex = e.detail.value
					this.smsTypeIndex = 0
					this.smsTypeList = [{
						text: '',
						value: '-1'
					}]
					this.loadMoreText = "加载中..."
					this.flagRef = 0;
					this.pageIndex = 1;
					// this.getDptUser(this.schList[this.schIndex]);
				}
			},
			userClick: function(e) {
				if (this.smsTypeIndex !== e.detail.value) {
					this.smsTypeIndex = e.detail.value
					this.loadMoreText = "加载中..."
					this.flagRef = 0;
					this.pageIndex = 1;
					this.getPageDataArray();
				}
			},
			getSysArea() {
				let comData = {
					type: 5,
					areano: '',
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_BASESUB + 'SysArea', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.allAreaList = data.data.list;
						// 用户服务区域查询
						this.getServarea();
					} else {
						this.showToast(data.msg);
					}
				})
			},
			// 用户服务区域查询
			getServarea() {
				let comData1 = {
					user_codes: this.personInfo.user_code,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_SSO_SUB + 'user/servarea', comData1, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.list.length > 0) {
							var tempM = data.data.list[0];
							if (tempM.pro_codes == '000000') {
								this.showAreaList.push({
									area_code: "370000",
									area_name: "山东省",
									value: '370000',
									text: '山东省',
									childList: [{
										area_code: "-1",
										area_name: "全部"
									}]
								});
								this.showAreaList.push({
									area_code: "420000",
									area_name: "湖北省",
									value: '420000',
									text: '湖北省',
									childList: [{
										area_code: "-1",
										area_name: "全部"
									}]
								});
								this.showAreaList.push({
									area_code: "460000",
									area_name: "海南省",
									value: '460000',
									text: '海南省',
									childList: [{
										area_code: "-1",
										area_name: "全部"
									}]
								});
								for (var i = 0; i < this.allAreaList.length; i++) {
									let tempArea = this.allAreaList[i];
									if (tempArea.area_code.indexOf("0000") != -1) {
										if (
											tempArea.area_code === "370000" ||
											tempArea.area_code === "420000" ||
											tempArea.area_code === "460000"
										) {} else {
											tempArea.value = tempArea.area_code;
											tempArea.text = tempArea.area_name;
											tempArea.childList = [{
												area_code: "-1",
												area_name: "全部"
											}];
											this.showAreaList.push(tempArea);
										}
									}
								}
								console.log('this.showAreaList:' + JSON.stringify(this.showAreaList));
								this.setCity();
							} else {
								// 处理省份字段
								if (tempM.pro_codes.length > 0) {
									var tempArray = tempM.pro_codes.split(",");
									var tempArray1 = []; //可选全部的省
									// 塞入可选省份
									for (let index = 0; index < tempArray.length; index++) {
										let tempData = this.selectData(tempArray[index], 1);
										tempData.selectAll = 1;
										this.showAreaList.push(tempData);
									}
								}
								console.log('this.showAreaListAAA:' + JSON.stringify(this.showAreaList));
								//处理城市字段
								if (tempM.city_codes.length > 0) {
									var tempArray = tempM.city_codes.split(",");
									var tempArray1 = []; //城市字段下的，非全选省份
									var tempArray2 = []; //临时放省份，用于往省份里塞数据
									// 根据全部城市，将省塞入数组
									for (let index = 0; index < tempArray.length; index++) {
										const element = tempArray[index];
										tempArray1.push(element.substr(0, 2) + '0000');
									}
									// 去重
									tempArray1 = this.unique(tempArray1);
									// 塞入可选省份
									for (let index = 0; index < tempArray1.length; index++) {
										let tempData = this.selectData(tempArray1[index], 1);
										tempData.selectAll = 0;
										this.showAreaList.push(tempData);
									}
									// 给临时省份数组去重
									for (var a = 0; a < this.showAreaList.length; a++) {
										let tempAllArea = this.showAreaList[a];
										for (let index = 0; index < tempArray.length; index++) {
											if (tempAllArea.area_code.substr(0, 2).indexOf(tempArray[index].substr(0, 2)) != -1) {
												let tempData = this.selectData(tempArray[index], 2);
												tempData.selectAll = 1;
												tempAllArea.childList.push(tempData);
											}
										}
									}
								}
								console.log('this.showAreaListCCC:' + JSON.stringify(this.showAreaList));
								//处理区县字段
							}
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			unique(arr) {
				return Array.from(new Set(arr));
			},
			selectData(code, type) { //1省，2市，3区，4学校
				console.log('selectData:' + code + ',type:' + type);
				for (var i = 0; i < this.allAreaList.length; i++) {
					let tempArea = this.allAreaList[i];
					if (type == 1) {
						if (tempArea.area_code == code) {
							tempArea.value = tempArea.area_code;
							tempArea.text = tempArea.area_name;
							tempArea.childList = [{
								area_code: "-1",
								area_name: "全部"
							}];
							return tempArea;
						}
					} else if (type == 2) {
						if (tempArea.area_code.substr(0, 2).indexOf(code.substr(0, 2)) != -1 &&
							tempArea.area_code.substr(2, 2).indexOf("00") == -1 &&
							tempArea.area_code.substr(4, 2).indexOf("00") != -1) {
							if (
								tempArea.area_name.indexOf("北京") != -1 ||
								tempArea.area_name.indexOf("天津") != -1 ||
								tempArea.area_name.indexOf("上海") != -1 ||
								tempArea.area_name.indexOf("重庆") != -1
							) {
								tempArea.area_name = "市辖区";
							}
							tempArea.value = tempArea.area_code;
							tempArea.text = tempArea.area_name;
							tempArea.childList = [{
								area_code: "-1",
								area_name: "全部"
							}];
							return tempArea;
						}
					}
				}
			},
			setProvList() {

			},
			setCity() {
				for (var i = 0; i < this.showAreaList.length; i++) {
					let tempArea = this.showAreaList[i];
					for (var a = 0; a < this.allAreaList.length; a++) {
						let tempAllArea = this.allAreaList[a];
						if (
							tempAllArea.area_code.substr(0, 2).indexOf(tempArea.area_code.substr(0, 2)) != -1 &&
							tempAllArea.area_code.substr(2, 2).indexOf("00") == -1 &&
							tempAllArea.area_code.substr(4, 2).indexOf("00") != -1
						) {
							if (
								tempAllArea.area_name.indexOf("北京") != -1 ||
								tempAllArea.area_name.indexOf("天津") != -1 ||
								tempAllArea.area_name.indexOf("上海") != -1 ||
								tempAllArea.area_name.indexOf("重庆") != -1
							) {
								tempAllArea.area_name = "市辖区";
							}
							tempAllArea.value = tempAllArea.area_code;
							tempAllArea.text = tempAllArea.area_name;
							tempAllArea.childList = [{
								area_code: "-1",
								area_name: "全部"
							}];
							tempArea.childList.push(tempAllArea);
						}
					}
				}
				console.log('this.showAreaList111:' + JSON.stringify(this.showAreaList));
				this.setArea();
			},
			setArea() {
				for (var i = 0; i < this.showAreaList.length; i++) {
					let tempProv = this.showAreaList[i];
					for (var a = 0; a < tempProv.childList.length; a++) {
						let tempCity = tempProv.childList[a];
						for (var b = 0; b < this.allAreaList.length; b++) {
							let tempAllArea = this.allAreaList[b];
							if (
								tempAllArea.area_code.substr(0, 4).indexOf(tempCity.area_code.substr(0, 4)) != -1 &&
								tempAllArea.area_code.substr(4, 2).indexOf("00") == -1
							) {
								tempAllArea.value = tempAllArea.area_code;
								tempAllArea.text = tempAllArea.area_name;
								tempAllArea.childList = [{
									area_code: "-1",
									area_name: "全部"
								}];
								tempCity.childList.push(tempAllArea);
							}
						}
					}
				}
				console.log('this.showAreaList222:' + JSON.stringify(this.showAreaList));
			},
			setSch() {

			},
			getSch() {
				let comData = {
					user_code: this.personInfo.user_code,
					index_code: 'index',
				}
				this.post(this.globaData.INTERFACE_SSO_SUB + 'user/servarea', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						// let dpts = data.data.dpt_list;
						// if(dpts.length>0 ){
						// 	for (var i = 0; i < dpts.length; i++) {
						// 		var tempDpt = dpts[i];
						// 		tempDpt.text = tempDpt.dpt_name;
						// 		tempDpt.value = tempDpt.dpt_code;
						// 		tempDpt.userArray = [];
						// 	}
						// 	this.dptList=dpts;
						// 	//1.14.学校部门用户
						// 	this.getDptUser(dpts[0]);
						// }else{
						// 	events.closeWaiting();
						// 	this.showToast('无数据授权 无法获取部门');
						// }
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getPageList() {
				var comData = {
					schoolId: this.personInfo.unit_code, //学校ID
					name: '', //通知单名称
					type: 1, //类型,1 工资条2 成绩单
					noticeManId: this.personInfo.user_code, //通知人ID
					beginTime: '20170101', //查询开始时间
					endTime: '30180127', //查询结束时间
					page_number: this.pageIndex, //当前页数
					page_size: '20', //每页记录数
					index_code: this.tabBarItem.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				//79.获取某人接收的通知单列表
				this.post(this.globaData.INTERFACE_OA + 'noticeLetter/getReceiveNoticeLetterByMan', comData, (data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if (data.list.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.list);
					}
				});
			}
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
	}
</script>

<style>
</style>
