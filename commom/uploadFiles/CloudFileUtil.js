import cryption from '../../commom/uploadFiles/cryption.js';
import Vue from 'vue'


/**
 * 获取多个上传token
 * @param {Object} data
 * @param {Object} callBack
 */
var getUpLoadTokens = function(that, data, callBack) {
	console.log("getUpLoadTokens " + JSON.stringify(data));
	var appId = data.appId; //项目id
	var desKey = data.appKey; //项目名称
	var configure = {}; //配置的数据
	var params = []; //配置的参数信息

	if (data.type == "2" || data.type == "3") { //视频||音频
		configure.thumbKey = [];
	}
	//		for(var i in data.fileArray) {
	for (var i = 0; i < data.QNFileName.length; i++) {
		// var filePaths = data.fileArray[i].split("/");
		// var QNFileName = filePaths[filePaths.length - 1];
		var param = {
			Bucket: data.mainSpace,
			Key: data.uploadSpace + data.QNFileName[i],
			Pops: "",
			NotifyUrl: ""
		}
		switch (data.type) {
			case "0": //上传多个原文件
				break;
			case "2": //视频
				var uploadOptions = {
					type: 2
				}
				var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
				param.Pops = opsData.ops;
				configure.thumbKey.push(opsData.thumbKey);
				break;
			case "3": //音频
				var uploadOptions = {
					type: 3
				}
				var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
				param.Pops = opsData.ops;
				configure.thumbKey.push(opsData.thumbKey);
				break;
			default:
				break;
		}

		//			console.log("参数数据 param " + JSON.stringify(param));
		params.push(param);
	}
	configure.options = {
		AppID: appId,
		Param: cryption.encryptByDES(desKey, JSON.stringify(params))
	}

	console.log("参数数据：" + JSON.stringify(configure.options))
	//获取token
	getQNUpTokenWithManage(that, that.QNGETUPLOADTOKEN, configure.options, function(data) {
		callBack({
			code: data.Status, //1成功
			configure: configure, //配置信息
			data: data, //回调信息
			message: data.Message //回调说明
		})
	}, function(xhr, type, errorThrown) {
		callBack({
			code: 0,
			message: type
		});
	});
}

var getQNDownToken = function(url, data, successCB, index) {
	// console.log('data:'+JSON.stringify(data));
	// console.log('url:'+url);
	// console.log('getQNDownToken:url ' + JSON.stringify(data));
	// console.log('getQNDownToken:data ' + JSON.stringify(data));
	var desKey = ''; //项目名称
	var appId = 0; //项目id
	var urls = []; //需要获取下载token文件的路径
	var configure = {}; //配置的数据
	if (data) {
		if (data.appId) {
			appId = data.appId;
			desKey = data.appKey;
		}
		if (data.urls) {
			urls = data.urls;
		}
	}
	if (desKey != '' && urls.length != 0) {
		configure.options = {
			AppID: appId,
			Param: cryption.encryptByDES(desKey, JSON.stringify(urls))
		}
		// console.log('configure.options:'+JSON.stringify(configure.options));
		uni.request({
			url: url,
			timeout: 60000,
			dataType: 'json', //服务器返回json格式数据
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: configure.options,
			success: res => { //接口调用成功的回调函数
				// console.log('11111res:'+JSON.stringify(res));
				if (res.statusCode === 200) {
					if (res.data.Status === '1') {
						//服务器返回响应
						successCB(res.data, index);
					}
				}
			},
			fail: (e) => { //接口调用失败的回调函数  比如跨域了，断网
				// console.log("e: " + JSON.stringify(e));
				uni.hideLoading();
				uni.showToast('网络请求失败')
			},
			complete: () => {}
		});
	} else {
		uni.hideLoading();
		errorCB('### ERROR ### 配置获取七牛下载token参数错误');
	}
}

/**
 * 获取上传到七牛的uptoken（单/多个文件的uptoken）
 * 使用到的地方：1.个人头像2.资料头像3.群头像4.上传到云存储5.记事
 * @author 莫尚霖
 * @param {Object} url 获取token的url
 * @param {Object} data 数据 json
 * @param {Object} successCB 成功的回调successCB(data)
 * @param {Object} errorCB 失败的回调errorCB(xhr, type, errorThrown);
 * data={
 * 	type:'',//str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件；2上传需要生成缩略图的多个文件;3上传需要生成缩略图的多个视频文件；4上传多个音频文件
 *  QNFileName:'',//str 必填 存放到七牛的文件名
 * 	fileArray:[],//array 选填  type为2时有效，多个文件的路径
 *  appId:'' , //int 必填 项目id
 *  mainSpace:'', //str 必填 文件存放在私有空间或公有空间
 *  uploadSpace: '',//str 必填  上传的空间（文件二级文件名）
 *  imageThumb:'',//str json 选填 type为0时有效，缩略图存放在私有空间或公有空间，默认mainSpace
 *  style:{ 	//json 选填 type为0，2时有效，配置生成缩略图的最大宽和高
 * 		maxWidth:'', //int 选填 配置生成缩略图的最大宽,默认200
 *  	maxHeight:'' //int 选填 配置生成缩略图的最大高，默认200
 *  }
 * }
 */
var getQNUpToken = function(that, url, data, successCB, errorCB) {
	// console.log('getQNUpToken ' + url + ' ' + JSON.stringify(data));
	var type = ''; //获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
	var QNFileName = ''; //存放到七牛的文件名
	var fileList = []; //上传文件的路径
	var desKey = ''; //项目名称
	var appId = 0; //项目id
	var mainSpace = ''; //文件存放在私有空间或公有空间
	var imageThumb = ''; //缩略图存放在私有空间或公有空间
	var saveSpace = ''; //上传的空间
	var configure = {}; //配置的数据
	var maxWidth = '200'; //type为0时 缩略图默认宽为200
	var maxHeight = '200'; //type为0时 缩略图默认高为200

	if (data) {
		if (data.type) {
			type = data.type
			if (type == 0 || type == 2) {
				if (data.style) {
					if (data.style.maxWidth) {
						maxWidth = data.style.maxWidth
					}
					if (data.style.maxHeight) {
						maxHeight = data.style.maxHeight
					}
				}
			}
			if (type == 2 || type == 3 || type == 4) {
				if (data.fileArray) {
					fileList = data.fileArray;
				}
			}
		}
		if (data.QNFileName) {
			QNFileName = data.QNFileName;
		}
		if (data.appId) {
			appId = data.appId;
			desKey = data.appKey;
		}
		if (data.mainSpace) {
			mainSpace = data.mainSpace;
		}
		if (data.imageThumb) {
			imageThumb = data.imageThumb;
		}
		if (imageThumb == '') {
			imageThumb = mainSpace;
		}
		if (data.uploadSpace) {
			saveSpace = data.uploadSpace;
		}
	}

	var thumbSpace = ''; //缩略图的七牛空间
	var ops = '' //七牛预持久化命令
	if (type == '0' || type == '1') {
		if (type == '0') {
			thumbSpace = saveSpace + 'Thumb/'; //缩略图的七牛空间
			var temp = QNFileName.split('.');
			//console.log(JSON.stringify(temp));
			var thumbName = temp[0];
			var thumbType = temp[1];
			if (thumbType == 'avi' || thumbType == 'mp4' || thumbType == 'flv' || thumbType == 'swf' ||
				thumbType == '3gp' || thumbType == 'rm') {
				//视频
				configure.thumbKey = URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
				ops = "vframe/png/offset/1|saveas/" + configure.thumbKey;
			} else {
				//图片
				configure.thumbKey = URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
				ops = "imageView2/1/w/" + maxWidth + "/h/" + maxHeight + "/format/png|saveas/" + configure
					.thumbKey;
			}
		}

		var param = {
			Bucket: mainSpace,
			Key: saveSpace + QNFileName,
			Pops: ops,
			NotifyUrl: ''
		}
		// console.log("参数数据：" + JSON.stringify(param));

		configure.options = {
			AppID: appId,
			Param: cryption.encryptByDES(desKey, JSON.stringify(param))
		}
	} else if (type == '2') { //多个图片文件
		var params = [];
		configure.thumbKey = [];
		var uploadOptions = { //上传七牛后的处理参数
			type: 0, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
			thumbSize: {
				width: maxWidth, //缩略图最大宽度
				height: maxHeight //缩略图最大高度
			}
		}
		for (var i = 0; i < fileList.length; i++) {
			var QNFileName; //文件名
			var param = {};
			param.Bucket = mainSpace;
			//获取文件路径
			var filePaths = fileList[i].split("/");
			QNFileName = filePaths[filePaths.length - 1];
			param.Key = saveSpace + QNFileName;
			// console.log('key:' + param.Key);
			//获取处理参数
			var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
			param.Pops = opsData.ops;
			param.NotifyUrl = '';
			//保存空间值
			params.push(param);
			configure.thumbKey.push(opsData.thumbKey);
		}

		configure.options = {
			AppID: appId,
			Param: cryption.encryptByDES(desKey, JSON.stringify(params))
		}
		// console.log("configure.options: " + JSON.stringify(configure.options));
	} else if (type == '3') { //多个视频文件
		var params = [];
		configure.thumbKey = [];

		for (var i = 0; i < fileList.length; i++) {
			var uploadOptions = { //上传七牛后的处理参数
				type: 2, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
				thumbSize: {
					width: fileList[i].width, //缩略图最大宽度
					height: fileList[i].height //缩略图最大高度
				}
			}
			var QNFileName; //文件名
			var param = {};
			param.Bucket = mainSpace;
			//获取文件路径
			var filePaths = fileList[i].path.split("/");
			QNFileName = filePaths[filePaths.length - 1];
			param.Key = saveSpace + QNFileName;
			//console.log('key:' + param.Key);
			//获取处理参数
			var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
			param.Pops = opsData.ops;
			param.NotifyUrl = '';
			//保存空间值
			params.push(param);
			configure.thumbKey.push(opsData.thumbKey);
		}

		configure.options = {
			AppID: appId,
			Param: cryption.encryptByDES(desKey, JSON.stringify(params))
		}
	} else if (type == '4') { //多个音频文件
		var params = [];
		configure.thumbKey = [];
		for (var i = 0; i < fileList.length; i++) {
			var uploadOptions = { //上传七牛后的处理参数
				type: 3, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
			}
			var QNFileName; //文件名
			var param = {};
			param.Bucket = mainSpace;
			//获取文件路径
			var filePaths = fileList[i].path.split("/");
			QNFileName = filePaths[filePaths.length - 1];
			param.Key = saveSpace + QNFileName;
			//console.log('key:' + param.Key);
			//获取处理参数
			var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
			param.Pops = opsData.ops;
			param.NotifyUrl = '';
			//保存空间值
			params.push(param);
			configure.thumbKey.push(opsData.thumbKey);
		}
		configure.options = {
			AppID: appId,
			Param: cryption.encryptByDES(desKey, JSON.stringify(params))
		}
	}

	// console.log("参数数据：" + JSON.stringify(configure.options))
	//获取token
	getQNUpTokenWithManage(that, url, configure.options, function(data) {
		successCB({
			configure: configure,
			data: data
		});
	}, function(xhr, type, errorThrown) {
		if (that.canSub) {
			that.canSub = true
		}
		errorCB(xhr, type, errorThrown);
	});

}

// 上传base64图片
var uploadIDCardHeadImge = function uploadIDCardHeadImge(type, fileName, base64Str, callback, ecallback) {
	// console.log('uploadIDCardHeadImge');
	var getToken = {
		type: type, //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
		QNFileName: fileName, //str 必填 存放到七牛的文件名
		appId: Vue.prototype.globaData.QN_APPID, //int 必填 项目id
		appKey: Vue.prototype.globaData.QN_APPKEY,
		mainSpace: Vue.prototype.QN_PB_NAME, //str 必填 私有空间或公有空间
		uploadSpace: Vue.prototype.QN_MARKINGPAPERS, //str 必填  上传的空间
	}
	// console.log('getToken:' + JSON.stringify(getToken));
	getQNUpToken(null, Vue.prototype.QNGETUPLOADTOKEN, getToken, function(data) {
		console.log('getQNUpToken111:' + JSON.stringify(data));
		let QNUptoken = data.data; //token数据
		// console.log('七牛上传token:' + JSON.stringify(QNUptoken));
		if (QNUptoken.Status == 0) { //失败
			uni.showToast('获取上传凭证失败 ' + QNUptoken.Message);
			//console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
			uni.hideLoading();
		} else {
			// console.log("上传的Token:" + QNUptoken.Data.Token);
			// console.log("上传的Domain:" + QNUptoken.Data.Domain);
			// console.log("上传的base64Str:"+base64Str);
			let pic = base64Str;
			let url = 'https://upload.qiniu.com/putb64/-1/key/' + encode(QNUptoken.Data.Key);
			uni.request({
				url: url,
				method: 'POST',
				data: pic,
				header: {
					ContentType: "application/octet-stream",
					Authorization: "UpToken " + QNUptoken.Data.Token
				},
				success: (uploadFileRes) => {
					// console.log(uploadFileRes.data);
					let responseUrl = QNUptoken.Data.Domain + uploadFileRes.data.key;
					callback(responseUrl);
				},
				fail: (e) => {
					// console.log(e);
					uni.showToast('七牛信息上传失败！');
					ecallback()
				}
			});
		}
	}, function(xhr, type, errorThrown) {
		uni.hideLoading();
		uni.showToast('请求上传凭证失败 ' + type);
		//console.log('### ERROR ### 请求上传凭证失败' + type);
	});
}

// 上传音频文件
var uploadAudio = function uploadAudio(type, fileName, audioUrl, callback, ecallback) {
	// console.log('uploadAudio');
	var getToken = {
		type: type, //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
		QNFileName: fileName, //str 必填 存放到七牛的文件名
		appId: Vue.prototype.globaData.QN_APPID, //int 必填 项目id
		appKey: Vue.prototype.globaData.QN_APPKEY,
		mainSpace: Vue.prototype.QN_PV_NAME, //str 必填 私有空间或公有空间
		uploadSpace: Vue.prototype.QN_KYCP, //str 必填  上传的空间
	}
	// console.log('getToken:' + JSON.stringify(getToken));
	getQNUpToken(null, Vue.prototype.QNGETUPLOADTOKEN, getToken, function(data) {
		console.log('getQNUpToken111:' + JSON.stringify(data));
		let QNUptoken = data.data; //token数据
		// console.log('七牛上传token:' + JSON.stringify(QNUptoken));
		if (QNUptoken.Status == 0) { //失败
			uni.showToast('获取上传凭证失败 ' + QNUptoken.Message);
			//console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
			uni.hideLoading();
		} else {
			console.log("上传的Token:" + QNUptoken.Data.Token);
			console.log("上传的Domain:" + QNUptoken.Data.Domain);
			// let url = 'https://upload.qiniu.com/putb64/-1/key/' + encode(QNUptoken.Data.Key);
			uni.uploadFile({
				url: 'https://upload.qiniu.com/',
				filePath: audioUrl,
				formData: {
					'key': QNUptoken.Data.Key,
					'token': QNUptoken.Data.Token
				},
				name: 'file',
				success: (uploadFileRes) => {
					console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
					let responseUrl = QNUptoken.Data.Domain + JSON.parse(uploadFileRes.data)
					.key;
					callback(responseUrl);
				},
				fail: (e) => {
					console.log(e);
					uni.showToast('文件上传失败，请稍后再试 ');
				}
			});
		}
	}, function(xhr, type, errorThrown) {
		uni.hideLoading();
		uni.showToast('请求上传凭证失败 ' + type);
		//console.log('### ERROR ### 请求上传凭证失败' + type);
	});
}

function encode(str) {
	// 对字符串进行编码
	var encode = encodeURI(str);
	// 对编码的字符串转化base64
	var base64 = btoa(encode);
	return base64;
}

/**
 *获取参数
 * @param {Object} manageOptions 处理参数
 * @param {String} saveSpace 保存空间
 * @param {String} mainSpace 主空间
 * @param {String} QNFileName 文件名
 */
var getOptions = function(manageOptions, saveSpace, mainSpace, QNFileName) {
	var returnData = {};
	switch (manageOptions.type) {
		case 0: //缩略图
			var thumbSpace = saveSpace + 'thumb/';
			returnData.thumbKey = URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
			returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize
				.height + "/format/png|saveas/" + returnData.thumbKey;
			break;
		case 1: //裁剪
			var clipSpace = saveSpace + 'clip/';
			returnData.clipKey = URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
			returnData.ops = "imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" +
				getIfExist(manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
			break;
		case 2: //视频
			var thumbSpace = saveSpace + 'thumb/';
			var tempFileName = QNFileName.split('.');
			var thumbName = tempFileName[0];
			returnData.thumbKey = URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.png');
			returnData.ops = "vframe/png/offset/1|saveas/" + returnData.thumbKey;
			break;
		case 3: //音频，转格式
			var thumbSpace = saveSpace + 'thumb/';
			var tempFileName = QNFileName.split('.');
			var thumbName = tempFileName[0];
			returnData.thumbKey = URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.mp3');
			returnData.ops = "avthumb/mp3/acodec/libmp3lame" + "|saveas/" + returnData.thumbKey;
			//console.log('3 ' + returnData.ops);
			break;
		case 10: //缩略图+裁剪
			var thumbSpace = saveSpace + 'thumb/';
			returnData.thumbKey = URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
			var clipSpace = saveSpace + 'clip/';
			returnData.clipKey = URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
			returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize
				.height + "/format/png|saveas/" + returnData.thumbKey +
				";imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" + getIfExist(
					manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
			break;
		default:
			break;
	}
	return returnData;
}
var getIfExist = function(option) {
	return option ? option : '';
}

/**
 * 获取上传的token
 * @author 安琪
 * @param {Object} url
 * @param {Object} data
 * @param {Object} successCB
 * @param {Object} errorCB
 */
var getQNUpTokenWithManage = function(that, url, data, successCB, errorCB) {
	console.log('url:' + url);
	console.log('data:' + JSON.stringify(data));
	let reuqestTask = uni.request({
		url: url,
		timeout: 60000,
		dataType: 'json', //服务器返回json格式数据
		method: 'POST',
		// contentType: "application/x-www-form-urlencoded",
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data: data,
		success: res => { //接口调用成功的回调函数
			console.log('11111res:' + JSON.stringify(res));
			if (res.statusCode === 200) {
				if (res.data.Status === '1') {
					//服务器返回响应
					successCB(res.data);
				} else {

				}
			} else { //比如服务器404 500

			}
		},
		fail: (e) => { //接口调用失败的回调函数  比如跨域了，断网
			console.log("e: " + JSON.stringify(e));
			if (that.canSub) {
				that.canSub = true
			}
			uni.hideLoading();
			uni.showToast('网络请求失败')
		},
		complete: () => {
			// Vue.prototype.requestTask.delete(reuqestTask)
		}
	});
}

/**
 * 创建上传任务
 * @author 莫尚霖
 * @param {Object} fPath 文件路径
 * @param {Object} token 七牛上传token
 * @param {Object} key 七牛上传key
 * @param {Object} uploadCompletedCallBack 上传完成时的回调
 * @param {Object} onStateChangedCallBack 上传任务状态监听的回调
 * @param {Object} successCallBack 上传任务创建成功监听的回调
 */
var upload = function(fPath, token, key, uploadCompletedCallBack, onStateChangedCallBack, successCallBack) {
	// console.log('upload fPath: ' + fPath);
	// console.log('upload token: ' + token);
	// console.log('upload key: ' + key);

	uni.uploadFile({
		url: 'https://upload.qiniu.com/',
		filePath: fPath,
		name: 'file',
		formData: {
			'key': key,
			'token': token
		},
		success: (uploadFileRes) => {
			// console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
			uploadCompletedCallBack(uploadFileRes.data, uploadFileRes.statusCode);
		},
	});

	// uni.uploadFile({
	// 	url: 'https://up-z2.qiniup.com', 
	// 	filePath: that.imgList[i],
	// 	name: 'file',
	// 	formData: {
	// 		'key': data.keys[i],
	// 		'token': data.tokens[i]
	// 	},
	// 	success: (uploadFileRes) => {

	// 	}
	// });

	// var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
	// 		method: "POST"
	// 	},
	// 	/**
	// 	 * 上传任务完成的监听
	// 	 * @param {Object} upload 上传任务对象
	// 	 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
	// 	 */
	// 	function(upload, status) {
	// 		uploadCompletedCallBack(upload, status);
	// 	}
	// );
	// task.addData("key", key);
	// task.addData("token", token);
	// task.addFile(fPath, {
	// 	"key": "file",
	// 	"name": "file"
	// });
	// //上传状态变化的监听
	// task.addEventListener("statechanged",
	// 	/**
	// 	 * 上传状态变化的监听
	// 	 * @param {Object} upload 上传任务对象
	// 	 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
	// 	 */
	// 	function(upload, status) {
	// 		onStateChangedCallBack(upload, status);
	// 	}, false);
	// // console.log('upload2:' + fPath + '|' + type + "|" + QNUptoken);
	// successCallBack(task);
	//task.start();
}

var qiniuDelete = function(paths, callBack) {
	var batchDelete = {
		appId: Vue.prototype.globaData.QN_APPID, //int 必填 项目id
		appKey: Vue.prototype.globaData.QN_APPKEY,
		urls: paths //array 必填 需要获取下载token文件的路径
	}
	BatchDelete(Vue.prototype.QNGETTOKENDELETE, batchDelete, function(data) {
			console.log('七牛删除 ' + JSON.stringify(data));
			// if (data.Status == 1) {
			// 	mod.pathList = [];
			// } else {
			// 	//console.log('### ERROR ### 七牛删除失败 ### ' + JSON.stringify(data));
			// }
			// wd.close();
		},
		function(xhr, type, errorThrown) {
			console.log('### ERROR ### 请求七牛删除失败 ### ' + JSON.stringify(type));
		}
	);
}

// 删除七牛文件
var BatchDelete = function(url, data, successCB, errorCB) {
	//console.log('BatchDelete:url ' + url);
	//console.log('BatchDelete:data ' + JSON.stringify(data));
	var desKey = ''; //项目名称
	var appId = 0; //项目id
	var urls = []; //需要获取下载token文件的路径
	var configure = {}; //配置的数据
	if (data) {
		if (data.appId) {
			appId = data.appId;
			desKey = data.appKey;
			if (data.urls) {
				urls = data.urls;
			}
		}
		if (desKey && urls.length != 0) {
			configure.options = {
				AppID: appId,
				Param: cryption.encryptByDES(desKey, JSON.stringify(urls))
			}
			//console.log("参数数据：" + JSON.stringify(configure.options));
			uni.request({
				url: url,
				timeout: 60000,
				dataType: 'json', //服务器返回json格式数据
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: configure.options,
				success: res => { //接口调用成功的回调函数
					console.log('11111res:' + JSON.stringify(res));
					// if (res.statusCode === 200) {
					// 	if (res.data.Status === '1') {
					// 		//服务器返回响应
					// 		successCB(res.data,index);
					// 	}
					// }
				},
				fail: (e) => { //接口调用失败的回调函数  比如跨域了，断网
					console.log("e: " + JSON.stringify(e));
					uni.hideLoading();
					uni.showToast('网络请求失败')
				},
				complete: () => {}
			});
		} else {
			errorCB('### ERROR ### 配置获取七牛下载token参数错误');
		}
	}
}

/**
 * 创建多文件上传任务
 * @author 莫尚霖
 * @param {Object} fPath 文件路径
 * @param {Object} token 七牛上传token
 * @param {Object} key 七牛上传key
 * @param {Object} uploadCompletedCallBack 上传完成时的回调
 */
var uploadFiles = function(that, type, files, mainSpace, uploadSpace, callback) {
	let names = []
	let newImgList = files.filter(item => {
		return item.indexOf('blob:') !== -1 || item.indexOf('file:') !== -1 || item.indexOf('https://') ===
			-1 || item.indexOf('http://') === -1
	}) //过滤服务器已经上传过的文件
	let imgUrls = files.filter(item => {
		return !(item.indexOf('blob:') > -1 || item.indexOf('file:') > -1 || item.indexOf('https://') === -
			1 || item.indexOf('http://') === -1)
	}) //过滤服务器已经上传过的文件
	console.log("newImgList: " + JSON.stringify(newImgList));
	console.log("imgUrls: " + JSON.stringify(imgUrls));
	newImgList.map((item, index) => {
		//如果是H5 文件是blob ，可以用item.name 获取文件名  如果是app-plus ,item是一个String，需要截取字符串，这里不写了
		names.push(that.moment().format('YYYYMMDDHHmmsss') + '_' + index + '.png')
	})
	if (newImgList.length > 0) {
		let getToken = {
			// fileArray:files,//---2
			type: type, //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
			QNFileName: names, //str 必填 存放到七牛的文件名
			appId: that.globaData.QN_APPID, //int 必填 项目id
			appKey: that.globaData.QN_APPKEY,
			mainSpace: mainSpace, //str 必填 私有空间或公有空间
			uploadSpace: uploadSpace, //str 必填  上传的空间
		}
		getUpLoadTokens(that, getToken, data => {
				// getQNUpToken(that,that.QNGETUPLOADTOKEN,getToken, data=> {//---2
				let QNUptoken = data.data; //token数据
				let configure = data.configure; //获取token的配置信息
				console.log('七牛上传token:' + JSON.stringify(QNUptoken));
				if (QNUptoken.Status == 0) { //失败
					that.showToast('获取上传凭证失败 ' + QNUptoken.Message);
					// console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
					if (that.canSub) {
						that.canSub = true
					}
					that.hideLoading();
				} else {
					let domains = []
					newImgList.map((file, index) => {
						_uploadFiles(that, file, QNUptoken.Data[index].Token, QNUptoken.Data[index].Key,
							function(upload, status) {
								// console.log("status: " + JSON.stringify(status));
								if (status == 200) { //上传任务成功
									// let thumb = QNUptoken.Data.OtherKey[configure.thumbKey]; //缩略图地址
									let domain = QNUptoken.Data[index].Domain + QNUptoken.Data[
										index].Key
									domains.push(domain)
									if (domains.length === newImgList.length) {
										let endNames = that.imgNames.concat(names)
										domains.sort();
										let endUrls = imgUrls.concat(domains)
										callback(endNames, endUrls)
										that.hideLoading();
									}
								} else { //上传失败
									if (that.canSub) {
										that.canSub = true
									}
									that.showToast('文件上传失败，请稍后再试 ');
									that.hideLoading();
								}
							});
					})
				}
			}
			// , function(xhr, type, errorThrown) {//---2
			// 	uni.hideLoading();//---2
			// 	uni.showToast('请求上传凭证失败 ' + type);//---2
			// 	//console.log('### ERROR ### 请求上传凭证失败' + type);//---2
			// }//---2
		);
	} else {
		callback(that.imgNames, imgUrls)
	}
}
var _uploadFiles = function(that, fPath, token, key, uploadCompletedCallBack) {
	// console.log('upload fPath: ' + fPath);
	// console.log('upload token: ' + token);
	// console.log('upload key: ' + key);
	uni.uploadFile({
		url: 'https://upload.qiniu.com/',
		filePath: fPath,
		formData: {
			'key': key,
			'token': token
		},
		name: 'file',
		success: (uploadFileRes) => {
			// console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
			uploadCompletedCallBack(uploadFileRes.data, uploadFileRes.statusCode);
		},
		fail: (e) => {
			// console.log(e);
			if (that.canSub) {
				that.canSub = true
			}
			that.showToast('文件上传失败，请稍后再试 ');
		}
	});
}

/**
 * 单个文件上传
 * @anthor an
 * @param {Object} tokenInfo
 * @param {String} fileName
 * @param {Function} callback
 */
var uploadFile = function(tokenInfo, fileName, callback) {
	////console.log('upload:' + fPath);
	var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
			method: "POST"
		},
		/**
		 * 上传任务完成的监听
		 * @param {Object} upload 上传任务对象
		 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
		 */
		function(upload, status) {
			callback(upload, status);
		}
	);

	task.addData("key", tokenInfo.Key);
	//task.addData("scope", scope + ':' + type);
	task.addData("token", tokenInfo.Token);
	task.addFile(fileName, {
		"key": "file",
		"name": "file"
	});
	//上传状态变化的监听
	task.addEventListener("statechanged", onStateChanged, false);
	task.start();
}

// /**
//  * 多张图片上传
//  * @author an
//  * @param {Array} fileNames 本地路径
//  * @param {Object} QNUptokens 上传token
//  * @param {Function} callback 回调函数
//  */
// var uploadFiles = function(fileNames, tokenInfos, callback) {
// 	plus.uploader.clear();

// 	for (var i in tokenInfos) {
// 		////console.log('upload:' + fPath);
// 		createTask(tokenInfos[i], fileNames[i], i, callback);
// 	}
// 	plus.uploader.startAll();
// }

function createTask(tokenInfo, fileName, index, callback) {
	var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
			method: "POST"
		},
		/**
		 * 上传任务完成的监听
		 * @param {Object} upload 上传任务对象
		 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
		 */
		function(upload, status) {
			callback(upload, status, index);
		}
	);
	task.addData("key", tokenInfo.Key);
	//task.addData("scope", scope + ':' + type);
	task.addData("token", tokenInfo.Token);
	task.addFile(fileName, {
		"key": 'file',
		"name": "file"
	});

	//上传状态变化的监听
	task.addEventListener("statechanged", onStateChanged, false);
}
// 监听上传任务状态
function onStateChanged(upload, status) {
	if (upload.state == 4 && status == 200) {
		// 上传完成
		//			//console.log("Upload success: " + upload.getFileName());
	}
}
var utf8_encode = function(argString) {
	if (argString === null || typeof argString === 'undefined') {
		return '';
	}

	var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	var utftext = '',
		start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode(
				(c1 >> 6) | 192, (c1 & 63) | 128
			);
		} else if (c1 & 0xF800 ^ 0xD800 > 0) {
			enc = String.fromCharCode(
				(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		} else { // surrogate pairs
			if (c1 & 0xFC00 ^ 0xD800 > 0) {
				throw new RangeError('Unmatched trail surrogate at ' + n);
			}
			var c2 = string.charCodeAt(++n);
			if (c2 & 0xFC00 ^ 0xDC00 > 0) {
				throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode(
				(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
};
var base64_encode = function(data) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data = utf8_encode(data + '');

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	switch (data.length % 3) {
		case 1:
			enc = enc.slice(0, -2) + '==';
			break;
		case 2:
			enc = enc.slice(0, -1) + '=';
			break;
	}

	return enc;
};
var URLSafeBase64Encode = function(v) {
	v = base64_encode(v);
	return v.replace(/\//g, '_').replace(/\+/g, '-');
};

module.exports = {
	getQNUpToken: getQNUpToken,
	upload: upload,
	uploadFiles: uploadFiles,
	getQNDownToken: getQNDownToken,
	uploadIDCardHeadImge: uploadIDCardHeadImge,
	uploadAudio: uploadAudio,
	qiniuDelete: qiniuDelete,
}
