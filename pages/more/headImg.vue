<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell" @click="clickImg()">
				<view class="uni-list-cell-left" style="width: 80px;">
					头像
				</view>
				<view class="uni-list-cell-right">
					<image style="width: 35px;height: 35px;border-radius: 50%;margin-top: 5px;" :src="personInfo.img_url"></image>
				</view>
			</view>
			<!-- <view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					手机号
				</view>
				<view class="uni-list-cell-right">
					{{personInfo.peoplePhone}}
				</view>
			</view> -->
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					昵称
				</view>
				<view class="uni-list-cell-right">
					{{personInfo.user_name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
			}
		},
		onLoad(option) {
			_this = this;
			uni.setNavigationBarTitle({title: '账号信息'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
			this.tabbar = util.getMenu();
			let tempInfo = util.getPersonal();
			console.log('tempInfo:' + JSON.stringify(this.tempInfo));
			if(this.isPoneAvailable(tempInfo.login_name)) {
				tempInfo.peoplePhone = tempInfo.login_name;
			}else{
				tempInfo.peoplePhone = '暂无手机号';
			}
			this.personInfo = tempInfo;
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			clickImg(){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    // sourceType: ['album'], //从相册选择
				    success: function (res) {
				  //       console.log(JSON.stringify(res.tempFilePaths));
						// console.log(JSON.stringify(res.tempFiles));
						var fileName = 'headimage' + _this.personInfo.user_code + '.png';
						var getToken = {
							type: '0', //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
							QNFileName: fileName, //str 必填 存放到七牛的文件名
							appId: _this.globaData.QN_APPID, //int 必填 项目id
							appKey: _this.globaData.QN_APPKEY,
							mainSpace: _this.QN_PB_NAME, //str 必填 私有空间或公有空间
							uploadSpace: _this.QN_HEADIMG, //str 必填  上传的空间
						}
						// console.log('getToken:'+JSON.stringify(getToken));
						cloudFileUtil.getQNUpToken(_this,_this.QNGETUPLOADTOKEN, getToken, data=> {
							var QNUptoken = data.data; //token数据
							var configure = data.configure; //获取token的配置信息
							// console.log('七牛上传token:' + JSON.stringify(QNUptoken));
							if(QNUptoken.Status == 0) { //失败
								_this.showToast('获取上传凭证失败 ' + QNUptoken.Message);
								// console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
								_this.hideLoading();
							} else {
								cloudFileUtil.upload(res.tempFilePaths[0], QNUptoken.Data.Token, QNUptoken.Data.Key, function(upload, status) {
									//上传任务完成的监听
									// console.log('上传任务完成:' + status);
									// console.log('上传任务完成:' + JSON.stringify(upload));
									if(status == 200) { //上传任务成功
										//头像类型,个人头像0，资料头像1，群头像2
										var thumb = QNUptoken.Data.OtherKey[configure.thumbKey]; //缩略图地址
										var domain = QNUptoken.Data.Domain + QNUptoken.Data.Key; //文件地址
										// console.log(thumb);
										console.log('domain:'+domain);
										var myDate = new Date();
										var imgeURL = domain + '?' + myDate.getTime();
										var comData0 = {
											index_code: 'uico', //修改类型，uico:头像
											img_url: imgeURL, //对应类型的值
										};
										_this.post(_this.globaData.INTERFACE_SSO_SKIN + 'user/updImg', comData0,(data0,data3) => {
											console.log('updImg:' + JSON.stringify(data3));
											_this.hideLoading();
											if(data3.code == 0) {
												_this.personInfo.img_url = imgeURL;
												util.setPersonal(_this.personInfo);
												_this.showToast('个人头像更新成功');
												uni.$emit('updateHeadImg',{});
											} else {
												_this.showToast(data3.msg);
											}
										});
									} else { //上传失败
										// errorCallBack(upload.responseText);
										_this.hideLoading();
									}
								}, function(upload, status) {
									
								}, function(task) {
									//上传任务创建成功的回调
									task.start();
								});
							}
						});
				    }
				});
			},
			isPoneAvailable(str) {
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if(!myreg.test(str)) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
</script>

<style>
.uni-list-cell{
	height: 50px;
}
.uni-list-cell-right{
	margin-right: 20px;
	text-align: right;
}
</style>
