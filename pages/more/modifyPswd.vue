<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					原密码
				</view>
				<view class="uni-list-cell-db">
					<input v-model="oldPassword" password style="height: 50px;" maxlength="18" type="text"
						placeholder="请输入原密码" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					新密码
				</view>
				<view class="uni-list-cell-db">
					<input v-model="newPassword" password style="height: 50px;" maxlength="18" type="text"
						placeholder="请输入新密码" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					确认密码
				</view>
				<view class="uni-list-cell-db">
					<input v-model="confirmPassword" password style="height: 50px;" maxlength="18" type="text"
						placeholder="请输入确认密码" />
				</view>
			</view>
		</view>
		<view style="width: 95%;margin: 0 2.5%;margin-top: 20px;">
			<button @click="submit()" type="button" class="mui-btn mui-btn-block mui-btn-primary"
				style="background: #00CFBD;border: 0;height: 44px;font-size: 15px;color: white;padding-top: 5px;">确
				定</button>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import md5 from '../../commom/encrypt/md5.js';
	export default {
		data() {
			return {
				personal:'',
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			}
		},
		onLoad:function(){
			this.personal = util.getPersonal();
			console.log('this.personal:'+JSON.stringify(this.personal));
			uni.setNavigationBarTitle({title: '修改密码'});
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
			submit: function() {
				if (this.oldPassword == '') {
					this.showToast('请输入原密码');
				} else if (this.oldPassword != this.personal.passWord0) {
					this.showToast('原密码输入不正确');
				} else if (this.newPassword == '') {
					this.showToast('请输入新密码');
				} else if (this.confirmPassword == '') {
					this.showToast('请输入确认密码');
				} else if (!(this.newPassword === this.confirmPassword)) {
					this.showToast('两次输入的密码不一致');
				} else if (this.newPassword === this.oldPassword) {
					this.showToast('新密码不能与旧密码相同');
				} else if (!checkPass(this.newPassword)) {
					this.showToast('密码需为6到18个数字和字母的组合');
				} else if (this.newPassword.length > 18 || this.newPassword.length < 6) {
					this.showToast('密码需为6到18个数字和字母的组合');
				} else {
					console.log('111111:'+this.PWD_ENCRYPTION+','+this.oldPassword+','+this.newPassword);
					var comData0 = {
						index_code: 'index', //
						old_password: md5.hex_md5(this.PWD_ENCRYPTION + this.oldPassword), //秘钥+密码再MD5加密, //
						new_password: md5.hex_md5(this.PWD_ENCRYPTION + this.newPassword), //秘钥+密码再MD5加密 //
					};
					this.showLoading();
					var tempUrl = 'user/updPwd';
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_SSO_SKIN + tempUrl, comData0, data => {
						console.log(tempUrl + JSON.stringify(data));
						this.hideLoading();
							this.personal.passWord0 = this.newPassword;
							util.setPersonal(this.personal);
							this.oldPassword = '';
							this.newPassword = '';
							this.confirmPassword = '';
							this.showToast('密码修改成功');
							setTimeout(function(){
								uni.navigateBack();
							},1500);
					});
				}
			}
		}
	}
	//判断字符串是否为数字和字母组合
	function checkPass(password) {
		var re = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/g;
		if (!re.test(password)) {
			return false;
		} else {
			return true;
		}
	}
</script>

<style>

</style>
