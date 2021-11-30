<template>
	<view>
		<uniNavBar title='登录' backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white'
			@clickLeft='clickLeft()'></uniNavBar>

		<view v-if="showInput == 1">
			<view class="titletal">
				<text class="title">{{title}}</text>
			</view>
			<!-- <view class="uni-list"> -->
			<view class="uni-list-cell" style="height: 60px;">
				<view class="uni-list-cell-left" style="margin-left: 20px;height: 60px;">
					<image class="nameImage" src="../../static/login/name.png"></image>
					<label class="loginLab">账号</label>
				</view>
				<view class="uni-list-cell-db">
					<!-- <input v-model="upassword" password type="text" placeholder="请输入密码" /> -->
					<input class="inputText" type="text" placeholder="请输入账号" value="user" v-model="uname" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="margin-left: 20px;height: 60px;">
					<image class="keyImage" src="../../static/login/key.png"></image>
					<label class="loginLab">密码</label>
				</view>
				<view class="uni-list-cell-db">
					<!-- <input v-model="confirmpassword" password style="" type="text" placeholder="请确认密码" /> -->
					<input class="inputText" password="true" type="text" placeholder="请输入密码" value="pass"
						v-model="passw" />
				</view>
			</view>
			<view class="loginBtnView"><button class="loginBtn" @click="login()">登录</button></view>
			<view @click="zhuce" style="margin-top: 30px;float: left;margin-left: 40px;color: #00CFBD;">账号注册/找回密码</view>
		</view>
		<view v-if="showInput == 2">
			<view class="uni-list-cell" style="height: 60px;">
				<view class="uni-list-cell-left" style="margin-left: 20px;height: 60px;">
					<image class="nameImage" src="../../static/login/name.png"></image>
					<label class="loginLab">密码</label>
				</view>
				<view class="uni-list-cell-db">
					<input class="inputText" password type="text" placeholder="请输入密码" value="user" v-model="pagePswd" />
				</view>
			</view>
			<view class="loginBtnView"><button class="loginBtn" @click="sure()">确定</button></view>
		</view>
		<popup ref="mapState" protocolPath='/pages/more/privace' :showPopup='showYinsi' @popupState="popupState">
		</popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import RSAKey from '../../commom/encrypt/rsa.js'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import update from '../../uni_modules/uni-upgrade-center-app/utils/check-update.js'
	import popup from '@/components/DuDu-popup/DuDu-popup.vue'
	export default {
		data() {
			return {
				showInput: 0, //正式环境，直接显示注册,1；非正式环境，如果是微信页面，显示输入密码,2，app直接显示注册,1
				pagePswd: '',
				loginInfo: {},
				title: '欢迎登陆',
				uname: '',
				passw: '',
				jsonData: [],
				showArray: [],
				pageArray: util.getPageArray(),
				showYinsi:false,//是否显示隐私
			}
		},
		components: {
			uniNavBar,
			popup
		},
		methods: {
			popupState(e) { //e->false取消 true确认
				console.log('popupState:' + e);
				if(e){
					uni.setStorageSync('yinsi',1);
					this.showYinsi = false;
					this.tongyiYinsi();
				}else{
					this.showYinsi = true;
					this.showToast('由于您没有同意教宝校园《用户隐私政策》的相关内容，我们暂时无法为您提供服务。请谅解！');
				}
			},
			tongyiYinsi(){
				//#ifdef APP-PLUS
				update();
				//#endif
				if (this.APPORWECHAT == 1) {
					this.showInput = 1;
					var tempInfo = util.getPersonal();
					if (tempInfo.userName0) {
						this.uname = tempInfo.userName0;
						this.passw = tempInfo.passWord0;
						this.login();
					}
				} else {
					let openid = this.getUrlParam('openid');
					console.log('openid111111:' + openid);
					if (openid) {
						let tempM = {
							openid: openid
						}
						// util.openwithData('/pages/login/indexWX', tempM);
						uni.redirectTo({
							url: '/pages/login/indexWX?openid=' + openid
						});
					} else {
						if (this.globaData.EnvKey == 5) {
							console.log('页面url:' + window.location.href);
							var tempUrl = window.location.href;
							console.log('tempUrl0:' + tempUrl);
							// var tempUrl1 = tempUrl.replace('index', 'registerIndex');
							// console.log('tempUrl1:' + tempUrl1);
							var tempArray = tempUrl.split('/');
							console.log('tempArray:' + JSON.stringify(tempArray));
							var appid = '';
							for (var a = 0; a < tempArray.length; a++) {
								if (tempArray[a].indexOf("wx") != -1) {
									appid = tempArray[a];
								}
							}
							let tempGo = 'https://jsypay.jiaobaowang.net/jsypaym/wxpay/ThdGetOpenid.ashx?appid=' + appid +
								'&returi=' + encodeURIComponent(tempUrl);
							// 向服务器传递appid、返回URL
							location.replace(tempGo);
						} else {
							this.showInput = 2;
						}
					}
				}
				console.log('this.showInput:' + this.showInput);
			},
			sure: function() {
				if (this.pagePswd == 'jsy@123654') {
					if (this.APPORWECHAT == 1) {
						this.showInput = 1;
						var tempInfo = util.getPersonal();
						if (tempInfo.userName0) {
							this.uname = tempInfo.userName0;
							this.passw = tempInfo.passWord0;
							this.login();
						}
					} else {
						console.log('页面url:' + window.location.href);
						var tempUrl = window.location.href;
						console.log('tempUrl0:' + tempUrl);
						// var tempUrl1 = tempUrl.replace('index', 'indexWX');
						// console.log('tempUrl1:' + tempUrl1);
						var tempArray = tempUrl.split('/');
						console.log('tempArray:' + JSON.stringify(tempArray));
						var appid = '';
						for (var a = 0; a < tempArray.length; a++) {
							if (tempArray[a].indexOf("wx") != -1) {
								appid = tempArray[a];
							}
						}
						let tempGo = 'https://jsypay.jiaobaowang.net/jsypaym/wxpay/ThdGetOpenid.ashx?appid=' + appid +
							'&returi=' + encodeURIComponent(tempUrl);
						// 向服务器传递appid、返回URL
						location.replace(tempGo);
					}
				} else {
					this.showToast('请输入正确的密码');
				}
			},
			clickLeft: function() {
				console.log('clickLeft');
			},
			zhuce: function() {
				util.openwithData('/pages/register/index');
			},
			login: function() {
				console.log('login');
				if (this.uname.length <= 0 || this.passw.length <= 0) {
					this.showToast('账号或密码不能为空');
					return;
				} else {
					util.setPersonal({});
					this.showLoading()
					let deviceId = util.getDeviceId();
					let broswerId = util.getBroswerId();
					let comData = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						unit_code: this.globaData.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
						webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
						shaketype: '1', //
					};
					console.log('response.comData:' + JSON.stringify(comData));
					this.post(this.globaData.INTERFACE_SSO_SKIN + 'login/getEncryptKey', comData, (response0,
						response) => {
						console.log('response:' + JSON.stringify(response));
						if (response.code === '0000') {
							let data = response.data
							let ConsultPublicKey = {
								n: String(data.Modulus),
								e: String(data.Exponent)
							}
							let rsaPublicKey = new RSAKey()
							rsaPublicKey.setPublicString(JSON.stringify(ConsultPublicKey))
							let comData = {
								uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
								webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
								shaketype: '1', //
								login_name: rsaPublicKey.encrypt(this.uname), //登录名
								password: rsaPublicKey.encrypt(this.passw), //
								device_type: this.APPORWECHAT == 1 ? '1' :
								'3', //登录设备类型，0：WEB、1：APP、2：客户端、3：第三方登录
								platform_code: this.globaData.PLATFORMCODE, //平台代码
								app_code: this.globaData.APPCODE, //应用系统代码
								unit_code: this.globaData
									.UNITCODE, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
								verify_code: ''
							};
							this.post(this.globaData.INTERFACE_SSO_SKIN + 'login', comData, (data0, data1) => {
								var tempData = data1.data;
								util.setPersonal(tempData);
								var tempFlag = 0;
								//1.4获取菜单
								//不需要加密的数据
								var comData4 = {
									platform_code: this.globaData.PLATFORMCODE, //平台代码
									app_code: this.globaData.APPCODE, //应用系统代码
									unit_code: data1.data.user.unit_code,
									index_code: 'index',
									access_token: data1.data.access_token //用户令牌
								};
								this.post(this.globaData.INTERFACE_SSO_SKIN + 'acl/menu',
									comData4, (data0, data4) => {
										console.log("data4: " + JSON.stringify(data4));
										if (data4.code == 0) {
											if (data4.data.list.length > 0) {
												var tempA = [];
												for (var i = 0; i < data4.data.list[0].childList
													.length; i++) { //一级菜单循环
													var web_first_item = data4.data.list[0]
														.childList[i];
													for (var a = 0; a < this.pageArray
														.length; a++) {
														var local_first_item = this.pageArray[a];
														if (local_first_item.url == web_first_item
															.url) {
															local_first_item.text = web_first_item
																.name;
															local_first_item.access =
																web_first_item.access;
															local_first_item.redspot_url =
																web_first_item.redspot_url;
															let childList = []
															for (var b = 0; b < web_first_item
																.childList.length; b++) { //二级菜单循环
																var web_second_item =
																	web_first_item.childList[b];
																for (var c = 0; c <
																	local_first_item.childList
																	.length; c++) {
																	var local_second_item =
																		local_first_item.childList[
																			c];
																	if (local_second_item.url ==
																		web_second_item.url) {
																		local_second_item.access =
																			web_second_item.access;
																		local_second_item
																			.redspot_url =
																			web_second_item
																			.redspot_url;
																		local_second_item
																			.childList =
																			web_second_item
																			.childList;
																		local_second_item.text =
																			web_second_item.name;
																		childList.push(
																			local_second_item)
																	}
																}
															}
															local_first_item.childList = childList
															tempA.push(local_first_item);
														}
													}
												}
												for (var i = 0; i < tempA.length; i++) {
													let tempM = tempA[i];
													tempM.index = i;
												}
												console.log('tempA:' + JSON.stringify(tempA));
												if (tempA.length > 5) {
													var tempArrayM = tempA.slice(4);
													util.setMenuMore(tempArrayM);
													tempA = tempA.slice(0, 4);
													tempA.push({
														text: "更多",
														index: 4,
														pagePath: "/pages/more/index",
														iconPath: '../../static/tabbar/more.png',
														selectedIconPath: '../../static/tabbar/more_select.png',
														img_href: "../../img/schapp_work/kaoqin_tab.png",
														url: 'schappUni_CoursePractice',
														childList: []
													});
												} else {
													util.setMenuMore([]);
												}
												console.log('tempA:' + JSON.stringify(tempA));
												this.showArray = [].concat(tempA);
												util.setMenu(this.showArray);
												if (this.showArray.length > 0) {
													util.setTabbarMenu(this.showArray[0]);
												}
												//跳转界面
												tempFlag++;
												console.log('tempFlag02:' + tempFlag);
												if (tempFlag == 3) {
													this.gotoPage();
												}
											} else {
												this.showToast('应用系统无权限，请联系管理员');
											}
										} else {
											this.showToast(data4.msg);
										}
									})

								var comData3 = {
									platform_code: data1.data.user.platform_code, //平台代码
									app_code: data1.data.user.app_code, //应用系统代码
									index_code: 'index', //页面权限符,必传,从登录皮肤处获得
									unit_code: data1.data.user.unit_code, //学校代码,必传
									user_code: data1.data.user.user_code, //用户代码,必传
									access_token: data1.data.access_token //用户令牌
								};
								//登录用户岗位信息
								this.post(this.globaData.INTERFACE_HR_SUB + 'user/getUserImg',
									comData3, (data0,
										data3) => {
										if (data3.code == 0) {
											var tempPerInfo = util.getPersonal();
											tempPerInfo.hrImg_url = data3.data.user_img;
											util.setPersonal(tempPerInfo);
											tempFlag++;
											console.log('tempFlag01:' + tempFlag);
											if (tempFlag == 3) {
												//跳转界面
												this.gotoPage();
											}
										} else {
											this.showToast(data3.msg);
										}
									});

								//1.42.根据用户类型及代码查询教师/学生信息
								var comData5 = {
									platform_code: this.globaData.PLATFORMCODE, //平台代码
									app_code: this.globaData.APPCODE, //应用系统代码
									unit_code: data1.data.user.unit_code,
									user_type_code: data1.data.user.type_code,
									user_code: data1.data.user.user_code,
									index_code: 'index',
									access_token: data1.data.access_token //用户令牌
								};
								//1.42.根据用户类型及代码查询教师/学生信息
								this.post(this.globaData.INTERFACE_HR_SUB +
									'user/getUserInfoByTypeAndCode', comData5, (
										data0, data5) => {
										if (data5.code == '0000') {
											if (data5.data) {
												var tempPerInfo = util.getPersonal();
												if (data1.data.user.type_code == 'YHLX0003') {
													tempPerInfo.tec_name = data5.data.tec_name;
													tempPerInfo.sch_name = data5.data.sch_name;
													tempPerInfo.sch_code = data5.data.sch_code;
													tempPerInfo.tec_code = data5.data.tec_code;
													tempPerInfo.dpt_name = data5.data.dpt_name;
													tempPerInfo.dpt_code = data5.data.dpt_code;
												} else {
													tempPerInfo.cls_name = data5.data.cls_name;
													tempPerInfo.sch_name = data5.data.sch_name;
													tempPerInfo.sch_code = data5.data.sch_code;
													tempPerInfo.cls_code = data5.data.cls_code;
													tempPerInfo.grd_name = data5.data.grd_name;
													tempPerInfo.grd_code = data5.data.grd_code;
													tempPerInfo.stu_name = data5.data.stu_name;
													tempPerInfo.stu_code = data5.data.stu_code;
												}
												util.setPersonal(tempPerInfo);
												tempFlag++;
												console.log('tempFlag02:' + tempFlag);
												if (tempFlag == 3) {
													//跳转界面
													this.gotoPage();
												}
											} else {
												this.showToast('应用系统无权限，请联系管理员');
											}
										} else {
											this.showToast(data5.msg);
										}
									});

							})
						} else {
							this.showToast('获取秘钥失败');
						}
					})
				}
			},
			gotoPage: function() {
				this.hideLoading();
				var tempData = util.getPersonal();
				//将personal 中的key更改为指定的值
				tempData.user_name = tempData.user.user_name;
				tempData.sex = tempData.user.sex;
				tempData.pid = tempData.user.pid;
				tempData.unit_name = tempData.user.unit_name;
				tempData.login_name = tempData.user.login_name;
				tempData.platform_code = tempData.user.platform_code;
				tempData.user_code = tempData.user.user_code;
				tempData.img_url = tempData.user.img_url;
				tempData.platform_name = tempData.user.platform_name;
				tempData.unit_code = tempData.user.unit_code;
				tempData.id = tempData.user.id;
				tempData.type_code = tempData.user.type_code;
				tempData.app_code = tempData.user.app_code;
				tempData.userName0 = this.uname;
				tempData.passWord0 = this.passw;
				tempData.backFlag = this.APPORWECHAT;
				delete tempData['user'];
				console.log('new tempData:' + JSON.stringify(tempData));
				util.setPersonal(tempData)
				if ('111111a' == '123456') {
					var tempModel = {
						flag: 1 //0是主动修改密码，1是判断是默认密码，自动让修改
					}
					// util.mOpenWithData("../../html/mine/modifyPassword.html", tempModel);
				} else {
					if (tempData.user_code == '0') { //无权限
						// util.hrefSessionStorage('../../html/login/index2.html', {});
					} else {
						// util.hrefSessionStorage('../../html/login/index.html', {});
						console.log("跳转页面吧");
						// this.jsonData = tempData;
						var tempArray = util.getMenu();
						console.log('tempArray:' + JSON.stringify(tempArray));
						if (tempArray.length > 0) {
							// uni.switchTab({
							// 	url: tempArray[0].pagePath
							// });
							util.openwithData(tempArray[0].pagePath);
						} else {
							this.showToast('当前系统没有可用菜单');
						}
					}
				}
			},
			getUrlParam(name) {
				var search = window.location.href;
				console.log('search:'+search);
				var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
				var matcher = pattern.exec(search);
				var items = null;
				if (null != matcher) {
					try {
						items = decodeURIComponent(decodeURIComponent(matcher[1]));
					} catch (e) {
						try {
							items = decodeURIComponent(matcher[1]);
						} catch (e) {
							items = matcher[1];
						}
					}
				}
				return items;
			},
		},
		onLoad: function() {
			// 判断是否同意隐私政策
			let yinsiShow = uni.getStorageSync('yinsi');
			console.log('yinsiShow:'+yinsiShow);
			// if(yinsiShow==1){
				this.tongyiYinsi();
			// }else{
			// 	this.showYinsi = true;
			// }
		}
	}
</script>

<style>
	/* .content {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	} */

	.mui-checkbox input[type='checkbox']:checked:before {
		color: #00CFBD;
	}

	.RememberPass {
		color: #adadad;

		margin-top: 5px;
	}

	.RememberCheck {
		margin-left: -50%;
		margin-top: 10px;
		color: #adadad;
	}

	.content {
		text-align: center;
		height: 400upx;
	}

	.backlogo {
		padding-bottom: 0px;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.titletal {
		margin-top: 90upx;
		height: 75px;
		text-align: center;
	}

	.title {
		/* font-size: 36upx; */
		color: #00CFBD;
		font-size: 150%;
	}

	.text {
		border: 1, solid, black;
	}

	.login-from {
		/* margin-top: 30%; */

		flex: auto;
		height: 100%;
		width: 100%;
	}

	.inputView {
		background-color: #fff;
		line-height: 50px;
		border-width: 1px;
		border-bottom: 2dp;
	}

	/*输入框*/
	.nameImage,
	.keyImage {
		margin-top: 25px;
		margin-left: 0px;
		width: 22px;
		height: 22px;
	}

	.loginLab {
		margin: 0px 15px 15px 10px;
		color: #545454;
		font-size: 18px;
	}

	.inputText {
		/* flex: block;
		float: right; */
		text-align: left;
		margin-right: 22px;
		margin-top: 15px;
		color: #000000;
		font-size: 18px;
	}

	.line {
		/* width: 100%; */
		margin-left: 40px;
		margin-right: 40px;
		height: 1px;
		background-color: #cccccc;
		margin-top: 1px;
	}

	/*按钮*/
	.loginBtnView {
		width: 100%;
		height: auto;
		/* background-color:#FFFFFF; */
		margin-top: 20px;
		margin-bottom: 0px;
		padding-bottom: 0px;
	}

	.loginBtn {
		width: 80%;
		margin-top: 50px;
		background-color: #00CFBD;
		color: aliceblue;
	}
</style>
