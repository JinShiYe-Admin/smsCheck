/**
 * APP 工具类
 */
import Vue from 'vue'
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
/**
 * 获取有层级关系的部门数组  
 * （应用场景：人事接口返回的部门数组为一维数组，需要根据dpt_code自行分层）
 * @param {Object} dptList
 */
function getDptTree(dptList) {
	const map = {};
	const val = [];
	dptList.forEach((item) => {
		map[item.dpt_code] = item;
	});
	dptList.forEach((item) => {
		const parent = map[item.pcode];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			val.push(item);
		}
	});
	return val
}

/**
 * 数组排序
 * @param {Object} propertyName key 字段名
 * @param {Object} order  0从小到大  正序  1从大到小 倒序
 */
function compare(propertyName, order) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if (order == 0) {
			if (value2 < value1) {
				return -1;
			} else if (value2 > value1) {
				return 1;
			} else {
				return 0;
			}
		}
		if (order == 1) {
			if (value2 > value1) {
				return -1;
			} else if (value2 < value1) {
				return 1;
			} else {
				return 0;
			}
		}

	}
}

//设置登录用户的信息
function setPersonal(data) {
	uni.setStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData.EnvKey, JSON
		.stringify(data))
}
//获取登录用户的信息
function getPersonal() {
	const _value = uni.getStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData
		.EnvKey)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}
//清除登录用户的信息
function removePersonal() {
	uni.removeStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData.EnvKey);
}

//设置登录用户的菜单信息
function setMenu(data) {
	uni.setStorageSync(Vue.prototype.meunList, JSON.stringify(data))
}
//获取登录用户的菜单信息
function getMenu() {
	const _value = uni.getStorageSync(Vue.prototype.meunList)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//设置登录用户的菜单信息
function setMenuMore(data) {
	uni.setStorageSync(Vue.prototype.meunListMore, JSON.stringify(data))
}
//获取登录用户的菜单信息
function getMenuMore() {
	const _value = uni.getStorageSync(Vue.prototype.meunListMore)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//设置登录用户的菜单信息
function setStore(key,data) {
	uni.setStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE +key, JSON.stringify(data));
}
//获取登录用户的菜单信息
function getStore(key) {
	const _value = uni.getStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE+key);
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//设置切换tabbar时菜单信息
function setTabbarMenu(data) {
	uni.setStorageSync(Vue.prototype.tabbarMenu, JSON.stringify(data))
}
//获取切换tabbar时菜单信息
function getTabbarMenu() {
	const _value = uni.getStorageSync(Vue.prototype.tabbarMenu)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//清除登录用户的菜单信息
function removeMenu() {
	uni.removeStorageSync(Vue.prototype.meunList);
	uni.removeStorageSync(Vue.prototype.meunListMore);
}

//清除本地所有storage缓存
function clearStorage() {
	try {
		uni.clearStorageSync();
	} catch (e) {
		console.log(e);
	}
}

/**
 * 获取设备唯一识别码
 * 注意：官网文档解释——非 App 端由 uni-app 框架生成并存储，清空 Storage 会导致改变
 */
function getDeviceId() {
	const res = uni.getSystemInfoSync();
	return res.deviceId
}
//获取浏览器识别码
function getBroswerId() {
	const res = uni.getSystemInfoSync();
	let system = res.system
	return system.replace(/\s*/g, "");

}

/**
 * 跳转页面 页面刷新
 * @param {Object} url 页面路径
 * @param {Object} data 传参
 * @param {Object} _events 页面监听，用于子页面向父页面传值
 */
function openwithData(url, data = {}, _events = {}) {
	uni.navigateTo({
		url: url + '?pagedata=' + encodeURIComponent(JSON.stringify(data)),
		animationType: 'pop-in',
		events: {
			..._events
		},
		success: function(res) {
			// res.eventChannel.emit('pagedata', data)
		}
	});

}

/**
 * 获取父页面传过来的参数
 * @param {Object} option
 */
function getPageData(option) {
	try {
		return JSON.parse(option.pagedata)
	} catch (e) {
		console.log(e);
		return {}
	}

}

// 打开附件
function openFile(fileUrl) {
	var urlStr = encodeURI(fileUrl);
	// #ifdef APP-PLUS
	uni.showLoading('加载中...');
	uni.downloadFile({
		url: urlStr,
		success: function(res) {
			var filePath = res.tempFilePath;
			uni.openDocument({
				filePath: filePath,
				success: function(res) {
					uni.hideLoading();
					console.log('打开文档成功');
				},
				fail() {
					uni.hideLoading();
					uni.showToast({
						title: '当前附件打开失败'
					})
				}
			});
		}
	});
	// #endif
	// #ifndef APP-PLUS
	console.log('urlStr:' + urlStr)
	var tempArr0 = urlStr.split('?');
	var urlStrTemp = tempArr0[0];
	var tempArr = urlStrTemp.split('.');
	var tempStr = tempArr[tempArr.length - 1];
	if (tempStr == 'png' || tempStr == 'jpg' || tempStr == 'jpeg' || tempStr == 'gif' || tempStr == 'bmp' ) {
		var tempArray = [];
		tempArray.push(urlStr);
		uni.previewImage({
			urls: tempArray,
		});
	} else {
		uniCopy({
			content: urlStr,
			success: (res) => {
				uni.showToast({
					title: '已复制该附件链接，请在系统浏览器中粘贴并打开',
					duration: 3000,
				})
				console.log('uniCopy-success');
			},
			error: (e) => {
				console.log('uniCopy-error');
			}
		})
	}
	// #endif
}

/**
 * Toast弹窗
 * @param {Object} title
 */
var timeTask = null

function showToast(title) {
	if (timeTask) {
		clearTimeout(timeTask)
	}
	timeTask = setTimeout(() => {
		//#ifdef APP-PLUS
		plus.nativeUI.toast(title);
		//#endif
		//#ifndef APP-PLUS
		uni.showToast({
			icon: 'none',
			title: title,
			position: 'bottom',
			duration: 2000,
		});
		//#endif
	}, 50)
}

/**
 * 获取按钮权限
 */

function getPermissionByPosition(op_codes, index_code, callback) {
	let personal = getPersonal();
	var comData = {
		platform_code: personal.platform_code, //平台代码
		app_code: personal.app_code, //应用系统代码
		unit_code: personal.unit_code, //单位代码
		index_code: index_code, //页面码,页面对应的权限码:index结尾的页面码,必传,由前端从皮得到
		op_code: op_codes, //操作码,操作码,如add,edit,delete等功能操作码
		grd_code: 0, //年级代码，全部年级则传-1,不需要判断年级则传0
		cls_code: 0, //班级代码，年级下全部班级则传-1，不需要判断班级则传0
		stu_code: 0, //学生代码，全部学生则传-1，不需要判断学生则传0
		sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
		access_token: personal.access_token //用户令牌
	};
	Vue.prototype.post(Vue.prototype.globaData.INTERFACE_SSO_SUB + 'acl/permissionByPosition', comData, response => {
		console.log("response: ", response);
		let ins = op_codes.split(",");
		let outs = response.result.split(",");
		let result = []
		ins.map((initem, index) => {
			result.push(outs[index] == "0" ? false : true)
		})
		callback(result)
	}, error => {
		console.log("error: ", error);
		let ins = op_codes.split(",");
		let result = []
		ins.map((initem, index) => {
			result.push(false)
		})
		callback(result)
	})
}

// 获取未读数
function getUnReadCut(index_code, url, callback) {
	let personal = getPersonal();
	var comData = {
		platform_code: personal.platform_code, //平台代码
		app_code: personal.app_code, //应用系统代码
		index_code: index_code.split("#")[1], //页面码,页面对应的权限码:index结尾的页面码,必传,由前端从皮得到
		unit_code: personal.unit_code, //单位代码
		user_code: personal.user_code, //用户代码
		access_token: personal.access_token,
		numtp: 0,
	};
	Vue.prototype.post(url, comData, response => {
		callback(response.list);
	}, error => {
		console.log("error: ", error);
		callback([]);
	})
}

function getPageArray() {
	let tempAAA = '';
	//#ifndef APP-PLUS
	var tempUrl = window.location.href;
	console.log('getPageArray.tempUrl:' + tempUrl);
	var tempArr = tempUrl.split('/');
	console.log('tempArr:' + JSON.stringify(tempArr));
	let urlFlag = 0;
	for (var a = 0; a < tempArr.length; a++) {
		if (tempArr[a].indexOf("wx") != -1) {
			urlFlag = a;
		}
	}
	urlFlag = urlFlag + 2;
	let tempUrl1 = [];
	for (var a = 0; a < urlFlag; a++) {
		tempUrl1.push(tempArr[a]);
	}
	tempAAA = tempUrl1.join('/');
	//#endif 
	console.log('tempAAA:' + tempAAA);
	let tempArray = [{
			// 非凸起按钮未激活的图标，可以是uView内置图标名或自定义扩展图标库的图标
			// 或者png图标的【绝对路径】，建议尺寸为80px * 80px
			// 如果是中间凸起的按钮，只能使用图片，且建议为120px * 120px的png图片
			iconPath: tempAAA + "/static/tabbar/smsCheck.png",
			// 激活(选中)的图标，同上
			selectedIconPath: tempAAA + "/static/tabbar/smsCheck_select.png",
			// 显示的提示文字
			text: '短信审核', //短信审核
			// 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
			count: 0,
			// 如果配置此值为true，那么角标将会以红点的形式显示
			isDot: false,
			// 如果使用自定义扩展的图标库字体，需配置此值为true
			// 自定义字体图标库教程：https://www.uviewui.com/guide/customIcon.html
			customIcon: false,
			// 如果是凸起按钮项，需配置此值为true
			midButton: false,
			// 点击某一个item时，跳转的路径，此路径必须是pagees.json中tabBar字段中定义的路径
			pagePath: '/pages/smsCheck/index', // 1.5.6新增，路径需要以"/"开头
			pagePath1: '/pages/smsCheck/index1', // 1.5.6新增，路径需要以"/"开头
			img_href: tempAAA + "/static/tabbar/smsCheck_img.png",
			url: 'schapp_SmsCheck',
			childList: []
		}, 
	];
	return tempArray;
}

//获取设备
module.exports = {
	compare: compare,
	getDptTree: getDptTree,
	setPersonal: setPersonal,
	getPersonal: getPersonal,
	removePersonal: removePersonal,
	setMenu: setMenu,
	getMenu: getMenu,
	removeMenu: removeMenu,
	setMenuMore: setMenuMore,
	getMenuMore: getMenuMore,
	setTabbarMenu: setTabbarMenu,
	getTabbarMenu: getTabbarMenu,
	clearStorage: clearStorage,
	getDeviceId: getDeviceId,
	getBroswerId: getBroswerId,
	openwithData: openwithData,
	getPageData: getPageData,
	showToast: showToast,
	getPermissionByPosition: getPermissionByPosition,
	getPageArray: getPageArray,
	getUnReadCut: getUnReadCut,
	openFile: openFile,
	setStore:setStore,
	getStore:getStore
}
