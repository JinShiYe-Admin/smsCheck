<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navRightBtn"
			:textClick="navRightCallback"></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;margin-right: 20px;margin-left: 20px;">
				<picker style="flex: 1;" @change="schClick" :value="schIndex" :range="schList" range-key="unit_name">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="'学校：'+schList[schIndex].unit_name"></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="userClick" :value="smsTypeIndex" :range="smsTypeList"
					range-key="msg_type_name">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="'信息类型：'+smsTypeList[smsTypeIndex].msg_type_name"></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 37px;padding-bottom: 40px;">
			<view class="example-body">
				<view v-for="(model,index) in pageArray" :key='index'>
					<uni-card isShadow>
						<text class="content-box-text">
							<uni-row class="nameTime">
								<uni-col :span="14" style="font-size: 14px;font-weight: 900;">
									发送人:{{model.send_user_tname}}
								</uni-col>
								<uni-col :span="10" style="text-align: right;">
									{{model.msg_type_name}}
								</uni-col>
								<uni-col :span="14" style="color: gray;">
									{{model.sch_name}}
								</uni-col>
								<uni-col :span="10" style="text-align: right;color: gray;">
									{{model.send_time}}
								</uni-col>
							</uni-row>
							<view class="card-line"></view>
							<view class="msg-content" v-html="model.msg_content"></view>
							<view>
								<radio v-if="navRightBtn.length==2" @click="clickRadio(model)"
									:checked=model.selectRadio style="margin-top: 5px;" />
								<button v-if="navRightBtn.length==1" class="mini-btn tongguoBtn" type="primary"
									size="mini" @click="clickBtn(1,1,model)">通过</button>
								<button v-if="navRightBtn.length==1" class="mini-btn jujueBtn" type="primary"
									size="mini" @click="clickBtn(2,0,model)">拒绝</button>
							</view>
						</text>
					</uni-card>
				</view>
			</view>
			<!-- <view style="padding-bottom: 50px;background-color: #eef0f2;" class="uni-loadmore" v-if="showLoadMore">
				{{loadMoreText}}
			</view> -->
		</view>
		<view class="uni-list" v-if="navRightBtn.length<2">
			<view class="card-line"></view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					当前选择
				</view>
				<view class="uni-list-cell-db">
					<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex"
						:range="multiAreaList" range-key="area_name">
						<view style="text-align: right;margin-right: 10px;color: gray;" class="uni-input">
							{{multiAreaList[0][multiIndex[0]].area_name}}，{{multiAreaList[1][multiIndex[1]].area_name}}，{{multiAreaList[2][multiIndex[2]].area_name}}
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="uni-list juJueTongGuo" v-if="navRightBtn.length==2">
			<view class="card-line" style="margin-top: 1px;margin-bottom: 0px;"></view>
			<view class="uni-flex uni-row" style="height: 44px;">
				<view class="flex-item" @click="clickBtn(3,0)">拒绝</view>
				<view style="margin-left: 2px;color: #2a82e4;" class="flex-item" @click="clickBtn(4,1)">通过</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="确认" content="是否确认当前操作？" @confirm="dialogConfirm" @close="dialogClose">
			</uni-popup-dialog>
		</uni-popup>
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
				navRightBtn: [],
				navRightCallback: [],
				pageArray: [],
				// pageIndex: 1,
				// total_page: 0,
				// flagRef: 0, //是刷新0，还是加载更多1
				// loadMoreText: "加载中...",
				// showLoadMore: false,
				//顶部筛选框相关内容
				schIndex: 0,
				smsTypeIndex: 0,
				schList: [{
					unit_name: '全部',
					area_code: '-1',
					unit_code: '-1'
				}],
				smsTypeList: [{
					msg_type: '',
					msg_type_name: '全部'
				}],
				allAreaList: [], //获取到的所有省市区
				getArea: {}, //获取的实际的省市区
				showAreaList: [], //实际的省市区
				multiAreaList: [
					[{
						area_name: '未知'
					}],
					[{
						area_name: '未知'
					}],
					[{
						area_name: '未知'
					}]
				], //多级联动数组
				selectSch: [], //非全选的学校code
				multiIndex: [0, 0, 0],
				idList: [], //选择的短信记录id列表
				isPass: 1, //是否通过审核，1通过，0不通过
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
			// console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			uni.setNavigationBarTitle({
				title: this.tabBarItem.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 1.21:系统地区列表
			this.getSysArea();
			// 获取类型
			this.getTypeList();
			// 获取权限
			this.getCheck();
		},
		methods: {
			onBackPress(options){
				return true;
			},
			clickBtn(flag, isPs, model) {
				this.idList = [];
				this.isPass = isPs;
				if (flag == 1 || flag == 2) {
					this.idList.push(model.id);
					this.$refs.alertDialog.open();
				} else {
					for (var i = 0; i < this.pageArray.length; i++) {
						var tempM = this.pageArray[i];
						if (tempM.selectRadio) {
							this.idList.push(tempM.id);
						}
					}
					if (this.idList.length == 0) {
						this.showToast('请先选择要审核的短信');
					} else {
						this.$refs.alertDialog.open();
					}
				}
			},
			dialogConfirm() {
				this.$refs.alertDialog.close();
				// 短信审核
				let comData = {
					check_unit_code: this.personInfo.unit_code,
					check_user_code: this.personInfo.user_code,
					check_user_name: this.personInfo.user_name,
					id_list: this.idList,
					is_pass: this.isPass,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsCheck/check', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						let comData1 = {
							check_user_unit: this.personInfo.unit_code,
							check_user: this.personInfo.user_code,
							check_user_tname: this.personInfo.user_name,
							hr_smsids: this.idList.join(','),
							is_check: this.isPass,
							index_code: this.tabBarItem.access.split('#')[1],
						}
						this.showLoading();
						this.post(this.globaData.INTERFACE_SCHHOME + 'api/appsms/appsmschk', comData1, (data0,
							data) => {
							this.hideLoading();
							if (data.code == 0) {
								let tempArray = [];
								for (var i = 0; i < this.pageArray.length; i++) {
									let tempM = this.pageArray[i];
									let tempFlag = 0;
									for (var a = 0; a < this.idList.length; a++) {
										if (tempM.id == this.idList[a]) {
											tempFlag++;
										}
									}
									if (tempFlag == 0) {
										tempArray.push(tempM);
									}
								}
								this.pageArray = tempArray;
								if (this.pageArray.length < 10) {
									// this.loadMoreText = "加载中..."
									// this.flagRef = 0;
									// this.pageIndex = 1;
									this.getPageList();
								}
							} else {
								this.showToast(data.msg);
							}
						})
					} else {
						this.showToast(data.msg);
					}
				})
			},
			dialogClose() {
				this.$refs.alertDialog.close();
			},
			clickRadio(model) {
				model.selectRadio = !model.selectRadio;
			},
			bindMultiPickerColumnChange: function(e) {
				// console.log('this.showAreaList:'+JSON.stringify(this.showAreaList));
				// console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value;
				// console.log('this.multiIndex:'+this.multiIndex);
				switch (e.detail.column) {
					case 0: //拖动第1列
					this.multiIndex.splice(1, 1, 0);
					this.multiIndex.splice(2, 1, 0);
						this.multiAreaList.splice(1, 1, this.showAreaList[this.multiIndex[0]].childList);
						this.multiAreaList.splice(2, 1, this.showAreaList[this.multiIndex[0]].childList[this.multiIndex[1]].childList);
						break
					case 1: //拖动第2列
					this.multiIndex.splice(2, 1, 0);
						this.multiAreaList.splice(2, 1, this.showAreaList[this.multiIndex[0]].childList[this.multiIndex[1]].childList);
						break
				}
				// this.pageIndex = 1;
				this.getSchCode();
				// this.$forceUpdate()
			},
			schClick: function(e) {
				if (this.schIndex !== e.detail.value) {
					this.schIndex = e.detail.value;
					// this.loadMoreText = "加载中...";
					// this.flagRef = 0;
					// this.pageIndex = 1;
					this.getPageList();
				}
			},
			userClick: function(e) {
				if (this.smsTypeIndex !== e.detail.value) {
					this.smsTypeIndex = e.detail.value;
					// this.loadMoreText = "加载中...";
					// this.flagRef = 0;
					// this.pageIndex = 1;
					this.getPageList();
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
						// console.log('SysArea:'+JSON.stringify(data));
						this.allAreaList = data.data.list;
						// 用户服务区域查询
						this.getServarea();
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getCheck() {
				let comData = {
					cls_code: 0,
					grd_code: 0,
					op_code: 'check',
					stu_code: 0,
					sub_code: 0,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_SSO_SUB + 'acl/permissionByPosition', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.result == 1) {
							this.navRightBtn = ['批量审核'];
							this.navRightCallback = [this.piLiangShenHeBtn];
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			piLiangShenHeBtn() {
				this.navRightBtn = ['全选', '取消'];
				this.navRightCallback = [this.quanXuanBtn, this.quXiaoBtn];
			},
			quanXuanBtn() {
				for (var i = 0; i < this.pageArray.length; i++) {
					let tempM = this.pageArray[i];
					tempM.selectRadio = true;
				}
			},
			quXiaoBtn() {
				this.navRightBtn = ['批量审核'];
				this.navRightCallback = [this.piLiangShenHeBtn];
				for (var i = 0; i < this.pageArray.length; i++) {
					let tempM = this.pageArray[i];
					tempM.selectRadio = false;
				}
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
							this.getArea = data.data.list[0];
							var tempM = data.data.list[0];
							if (tempM.pro_codes == '000000') {
								this.showAreaList.push({
									area_code: "370000",
									area_name: "山东省",
									selectAll: 1,
									childList: [{
										area_code: "-1",
										area_name: "全部"
									}]
								});
								this.showAreaList.push({
									area_code: "420000",
									area_name: "湖北省",
									selectAll: 1,
									childList: [{
										area_code: "-1",
										area_name: "全部"
									}]
								});
								this.showAreaList.push({
									area_code: "460000",
									area_name: "海南省",
									selectAll: 1,
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
											tempArea.selectAll = 1;
											tempArea.childList = [{
												area_code: "-1",
												area_name: "全部"
											}];
											this.showAreaList.push(tempArea);
										}
									}
								}
								// console.log('this.showAreaList:' + JSON.stringify(this.showAreaList));
							} else {
								var tempArrayPro1 = []; //全选省份
								var tempArrayCity1 = []; //全选城市
								var tempArrayCoty1 = []; //全选区县
								var tempArrayPro0 = []; //非全选省份
								var tempArrayCity0 = []; //非全选城市
								var tempArrayCoty0 = []; //非全选区县
								// 处理省份字段
								if (tempM.pro_codes.length > 0) {
									tempArrayPro1 = tempM.pro_codes.split(",");
								}
								// console.log('this.showAreaListAAA:' + JSON.stringify(this.showAreaList));
								//处理城市字段
								if (tempM.city_codes.length > 0) {
									tempArrayCity1 = tempM.city_codes.split(",");
									// 根据全部城市，将省塞入数组
									for (let index = 0; index < tempArrayCity1.length; index++) {
										const element = tempArrayCity1[index];
										tempArrayPro0.push(element.substr(0, 2) + '0000');
									}
								}
								// console.log('this.showAreaListCCC:' + JSON.stringify(this.showAreaList));
								//处理区县字段
								if (tempM.coty_codes.length > 0) {
									tempArrayCoty1 = tempM.coty_codes.split(",");
									// 根据全部城市，将省塞入数组
									for (let index = 0; index < tempArrayCoty1.length; index++) {
										const element = tempArrayCoty1[index];
										tempArrayPro0.push(element.substr(0, 2) + '0000');
										tempArrayCity0.push(element.substr(0, 4) + '00');
									}
								}
								// console.log('this.showAreaListDDD:' + JSON.stringify(this.showAreaList));
								//处理单位字段
								if (tempM.unit_codes.length > 0) {
									var tempArray = tempM.unit_codes.split(",");
									// 塞入可选单位
									for (let index = 0; index < tempArray.length; index++) {
										const element = tempArray[index];
										var tempUnit = element.split("_");
										this.selectSch.push(tempUnit[1]);
										// 将可选单位的区域代码，塞入临时区县
										tempArrayCoty0.push(tempUnit[0]);
										// 将可选单位的区域代码，塞入临时省份
										tempArrayPro0.push(tempUnit[0].substr(0, 2) + '0000');
										// 将可选单位的区域代码，塞入临时城市
										tempArrayCity0.push(tempUnit[0].substr(0, 4) + '00');
									}
								}
								// 去重
								tempArrayPro0 = this.unique(tempArrayPro0);
								tempArrayCity0 = this.unique(tempArrayCity0);
								tempArrayCoty0 = this.unique(tempArrayCoty0);
								// 塞入可选省份
								for (let index = 0; index < tempArrayPro0.length; index++) {
									let tempData = this.selectData(tempArrayPro0[index], 1);
									tempData.selectAll = 0;
									this.showAreaList.push(tempData);
								}
								for (let index = 0; index < tempArrayPro1.length; index++) {
									let tempData = this.selectData(tempArrayPro1[index], 1);
									tempData.selectAll = 1;
									this.showAreaList.push(tempData);
								}
								// console.log('this.showAreaList:'+JSON.stringify(this.showAreaList));
								// 将特定省份置前
								//找到数组中area_code=460000，420000，370000的下标索引(从0开始)
								let current0 = this.showAreaList.findIndex(v => v.area_code == 460000);
								if (current0 != -1) {
									//把area_code=的对象赋值给临时数组
									let tempArr0 = [];
									tempArr0.push(this.showAreaList[current0]);
									//移除数组中area_code=的对象
									this.showAreaList.splice(current0, 1); //从start[一般为对象的索引]的位置开始向后删除delCount个元素
									//重新渲染数组
									this.showAreaList = tempArr0.concat(this.showAreaList);
								}

								//找到数组中area_code=460000，420000，370000的下标索引(从0开始)
								let current1 = this.showAreaList.findIndex(v => v.area_code == 420000);
								if (current1 != -1) {
									//把area_code=的对象赋值给临时数组
									let tempArr1 = [];
									tempArr1.push(this.showAreaList[current1]);
									//移除数组中area_code=的对象
									this.showAreaList.splice(current1, 1); //从start[一般为对象的索引]的位置开始向后删除delCount个元素
									//重新渲染数组
									this.showAreaList = tempArr1.concat(this.showAreaList);
								}

								//找到数组中area_code=460000，420000，370000的下标索引(从0开始)
								let current2 = this.showAreaList.findIndex(v => v.area_code == 370000);
								if (current2 != -1) {
									//把area_code=的对象赋值给临时数组
									let tempArr2 = [];
									tempArr2.push(this.showAreaList[current2]);
									//移除数组中area_code=的对象
									this.showAreaList.splice(current2, 1); //从start[一般为对象的索引]的位置开始向后删除delCount个元素
									//重新渲染数组
									this.showAreaList = tempArr2.concat(this.showAreaList);
								}

								// 塞入城市
								for (var a = 0; a < this.showAreaList.length; a++) {
									let tempAllArea = this.showAreaList[a];
									for (let index = 0; index < tempArrayCity0.length; index++) {
										if (tempAllArea.area_code.substr(0, 2).indexOf(tempArrayCity0[index]
												.substr(0, 2)) != -1) {
											let tempData = this.selectData(tempArrayCity0[index], 2);
											tempData.selectAll = 0;
											tempAllArea.childList.push(tempData);
										}
									}
								}
								for (var a = 0; a < this.showAreaList.length; a++) {
									let tempAllArea = this.showAreaList[a];
									for (let index = 0; index < tempArrayCity1.length; index++) {
										if (tempAllArea.area_code.substr(0, 2).indexOf(tempArrayCity1[index]
												.substr(0, 2)) != -1) {
											let tempData = this.selectData(tempArrayCity1[index], 2);
											tempData.selectAll = 1;
											tempAllArea.childList.push(tempData);
										}
									}
								}
								// 塞入区县
								for (var a = 0; a < this.showAreaList.length; a++) {
									// 省份
									let tempAllArea = this.showAreaList[a];
									for (var b = 0; b < tempAllArea.childList.length; b++) {
										// 城市
										let tempCity = tempAllArea.childList[b];
										// 循环得到的区县
										for (let index = 0; index < tempArrayCoty0.length; index++) {
											if (tempCity.area_code.substr(0, 4).indexOf(tempArrayCoty0[index]
													.substr(0, 4)) != -1) {
												let tempData = this.selectData(tempArrayCoty0[index], 3);
												tempData.selectAll = 0;
												tempCity.childList.push(tempData);
											}
										}
									}
								}
								for (var a = 0; a < this.showAreaList.length; a++) {
									// 省份
									let tempAllArea = this.showAreaList[a];
									for (var b = 0; b < tempAllArea.childList.length; b++) {
										// 城市
										let tempCity = tempAllArea.childList[b];
										// 循环得到的区县
										for (let index = 0; index < tempArrayCoty1.length; index++) {
											if (tempCity.area_code.substr(0, 4).indexOf(tempArrayCoty1[index]
													.substr(0, 4)) != -1) {
												let tempData = this.selectData(tempArrayCoty1[index], 3);
												tempData.selectAll = 1;
												tempCity.childList.push(tempData);
											}
										}
									}
								}
								// console.log('this.showAreaListEEE:' + JSON.stringify(this.showAreaList));
							}
							// 将省份、非全选的城市、区县都塞值完毕，然后塞入全选的城市、区县
							this.setCity();
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
				// console.log('selectData:' + code + ',type:' + type);
				for (var i = 0; i < this.allAreaList.length; i++) {
					let tempArea = this.allAreaList[i];
					if (type == 1) {
						if (tempArea.area_code == code) {
							tempArea.childList = [{
								area_code: "-1",
								area_name: "全部",
								childList: [{
									area_code: "-1",
									area_name: "全部",
									childList: {}
								}]
							}];
							return tempArea;
						}
					} else if (type == 2) {
						if (tempArea.area_code == code) {
							if (
								tempArea.area_name.indexOf("北京") != -1 ||
								tempArea.area_name.indexOf("天津") != -1 ||
								tempArea.area_name.indexOf("上海") != -1 ||
								tempArea.area_name.indexOf("重庆") != -1
							) {
								tempArea.area_name = "市辖区";
							}
							tempArea.childList = [{
								area_code: "-1",
								area_name: "全部"
							}];
							return tempArea;
						}
					} else if (type == 3) {
						if (tempArea.area_code == code) {
							tempArea.childList = [{
								area_code: "-1",
								area_name: "全部"
							}];
							return tempArea;
						}
					}
				}
			},
			setCity() {
				for (var i = 0; i < this.showAreaList.length; i++) {
					let tempProv = this.showAreaList[i];
					if (tempProv.selectAll == 1) {
						for (var a = 0; a < this.allAreaList.length; a++) {
							let tempAllArea = this.allAreaList[a];

							if (
								tempAllArea.area_code.substr(0, 2).indexOf(tempProv.area_code.substr(0, 2)) != -1 &&
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
								tempAllArea.selectAll = 1;
								tempAllArea.childList = [{
									area_code: "-1",
									area_name: "全部"
								}];
								tempProv.childList.push(tempAllArea);
							}
						}
					}
				}
				console.log('this.showAreaList111:' + JSON.stringify(this.showAreaList));
				this.setArea();
			},
			setArea() {
				for (var i = 0; i < this.showAreaList.length; i++) {
					let tempProv = this.showAreaList[i];
					if (tempProv.selectAll == 1) {
						for (var a = 0; a < tempProv.childList.length; a++) {
							let tempCity = tempProv.childList[a];
							if (tempCity.selectAll == 1) {
								for (var b = 0; b < this.allAreaList.length; b++) {
									let tempAllArea = this.allAreaList[b];
									if (
										tempAllArea.area_code.substr(0, 4).indexOf(tempCity.area_code.substr(0, 4)) != -
										1 &&
										tempAllArea.area_code.substr(4, 2).indexOf("00") == -1
									) {
										tempAllArea.selectAll = 1;
										tempAllArea.childList = [{
											area_code: "-1",
											area_name: "全部"
										}];
										tempCity.childList.push(tempAllArea);
									}
								}
							}
						}
					}
				}
				if (this.showAreaList.length == 0) {
					this.showToast('当前登录用户尚未分配服务单位');
				} else {
					this.multiAreaList.splice(0, 1, this.showAreaList);
					this.multiAreaList.splice(1, 1, this.showAreaList[0].childList);
					this.multiAreaList.splice(2, 1, this.showAreaList[0].childList[0].childList);
					this.getSchCode();
				}
				// console.log('this.multiAreaList:' + JSON.stringify(this.multiAreaList));
			},
			// 计算要获取学校的省市区代码
			getSchCode() {
				// 是否区县
				let tempCoty = this.multiAreaList[2][this.multiIndex[2]];
				if (tempCoty.area_code == -1) {
					let tempCity = this.multiAreaList[1][this.multiIndex[1]];
					if (tempCity.area_code == -1) {
						let tempProv = this.multiAreaList[0][this.multiIndex[0]];
						this.getSch(tempProv.area_code, 1, tempProv.selectAll);
					} else {
						this.getSch(tempCity.area_code, 2, tempCity.selectAll);
					}
				} else {
					this.getSch(tempCoty.area_code, 3, tempCoty.selectAll);
				}
			},
			getSch(code, flag, selectAll) {
				console.log('selectAllselectAllselectAllselectAll:' + selectAll);
				let comData = {
					area_code: code,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'sch', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.schList = [{
							unit_name: '全部',
							area_code: '-1',
							unit_code: '-1'
						}];
						// if(this.getArea.is_servsch == 1){
						// 	this.schList.push({
						// 		unit_name: '服务学校',
						// 		area_code: '-1',
						// 		unit_code: '100000'
						// 	})
						// }
						if (selectAll == 0) {
							for (var i = 0; i < data.data.list.length; i++) {
								let tempSch = data.data.list[i];
								// 如果是根据省份查找，看是否有全选的城市
								if (flag == 1) {
									// 筛选城市字段	
									if (this.getArea.city_codes.length > 0) {
										let tempCity = this.getArea.city_codes.split(',');
										for (var a = 0; a < tempCity.length; a++) {
											if (tempSch.area_code.substr(0, 4).indexOf(tempCity[a].substr(0, 4)) !=
												-
												1 &&
												tempSch.area_code.substr(4, 2).indexOf("00") == -1) {
												this.schList.push(tempSch);
											}
										}
									}
								}
								// 如果是根据城市查找，看是否有全选的区县
								if (flag == 1 || flag == 2) {
									// 筛选城市字段
									if (this.getArea.coty_codes.length > 0) {
										let tempCoty = this.getArea.coty_codes.split(',');
										for (var a = 0; a < tempCoty.length; a++) {
											if (tempSch.area_code == tempCoty[a]) {
												this.schList.push(tempSch);
											}
										}
									}
								}
								// 将存储的学校，进行对比
								for (var a = 0; a < this.selectSch.length; a++) {
									if (this.selectSch[a] == tempSch.unit_code) {
										this.schList.push(tempSch);
									}
								}
							}
						} else {
							this.schList = this.schList.concat(data.data.list);
						}
						this.getPageList();
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getTypeList() {
				let comData = {
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsCheck/msgTypeList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.smsTypeList = this.smsTypeList.concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getPageList() {
				let tempMsg = this.smsTypeList[this.smsTypeIndex].msg_type;
				let tempSchCode = [];
				if (this.schIndex == 0) {
					for (var i = 1; i < this.schList.length; i++) {
						let tempSch = this.schList[i];
						tempSchCode.push(tempSch.unit_code);
					}
					if (tempSchCode.length == 0) {
						tempSchCode.push('-1');
					}
				} else {
					tempSchCode.push(this.schList[this.schIndex].unit_code);
				}
				var comData = {
					keyword: '', //
					msg_type: tempMsg, //
					sch_codes: tempSchCode.join(','), //
					type: 'all',
					// page_number: this.pageIndex, //当前页数
					page_number: 1, //当前页数
					page_size: '10', //每页记录数
					index_code: this.tabBarItem.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				//
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsCheck/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						// this.pageIndex++;
						// this.total_page = data.data.total_page;
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							tempM.selectRadio = false;
							for (var a = 0; a < this.smsTypeList.length; a++) {
								let tempS = this.smsTypeList[a];
								if (tempM.msg_type == tempS.msg_type) {
									tempM.msg_type_name = tempS.msg_type_name;
								}
							}
						}
						// if (this.flagRef == 0) {
						// 	if (data.data.list.length == 0) {
						// 		this.showToast('暂无数据');
						// 	}
						// 	this.pageArray = [].concat(data.data.list);
						// 	uni.stopPullDownRefresh();
						// } else {
						// 	this.pageArray = this.pageArray.concat(data.data.list);
						// }
						this.pageArray = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
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
		// onReachBottom() {
		// 	this.flagRef = 1;
		// 	if (this.total_page < this.pageIndex) {
		// 		this.loadMoreText = "没有更多数据了!"
		// 		return;
		// 	}
		// 	this.showLoadMore = true;
		// 	setTimeout(() => {
		// 		this.getPageList();
		// 	}, 300);
		// },
		onPullDownRefresh() {
			// this.loadMoreText = "加载中..."
			// this.flagRef = 0;
			// this.pageIndex = 1;
			this.getPageList();
		},
	}
</script>

<style>
	.areaClass {
		top: calc(100% - 50px);
	}

	.select-line {
		height: 2px;
		background-color: #00CFBD;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 2px;
		margin-bottom: 2px;
	}

	.msg-content {
		word-break: break-all;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #eef0f2;
		/* height: calc(100% - 300px) !important; */
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #eef0f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
		/* padding-bottom: 50px; */
	}

	.content-box-text {
		font-size: 12px;
		line-height: 22px;
	}

	.jujueBtn {
		float: right;
		color: #ff8d1a !important;
		background-color: white !important;
		border: 1px solid #ff8d1a !important;
	}

	.tongguoBtn {
		float: right;
		color: #2a82e4 !important;
		margin-left: 5px;
		background-color: white !important;
		border: 1px solid #2a82e4 !important;
	}

	.uni-list {
		position: fixed;
		bottom: 0;
		z-index: 2;
	}

	.juJueTongGuo {
		height: 40px;
		background-color: #e5e5e5;
	}

	.flex-item {
		font-size: 13px;
		width: 50%;
		text-align: center;
		height: 44px;
		background-color: white !important;
		padding-top: 10px;
		color: #ff8d1a !important;
	}

	::v-deep .sensitive {
		color: #ff4d4f;
		font-size: 16px;
		font-weight: 600;
		padding: 0 6px;
	}

	::v-deep uni-page-wrapper {
		background: red !important;
	}
</style>
