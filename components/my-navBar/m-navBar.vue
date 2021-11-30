<template>
	<view>
		<u-navbar-my :title='navItem.text' :titleIcon='navItem.titleIcon?navItem.titleIcon:""' :titleClick="$props.titleClick" :backFlag='navItem.index' :backImg="personInfo.img_url" :custom-back="clickLeftImg">
			<view v-if="icon || text" slot="right" style="display: flex;flex-direction: row;">
				<template v-if="typeof icon ==='string'">
					<view v-if="icon" style="margin: 0 8px;"><uni-icons :type="icon.value?icon.value:icon" :size="icon.style?icon.style.fontSize:18" :color="icon.style?icon.style.color:'#FFFFFF'" @click="$props.iconClick"></uni-icons></view>
				</template>
				<template v-else-if="typeof icon === 'object'">
					<view v-for="(item,index) in icon" :key='item' style="margin: 0 8px;"><uni-icons :type="item.value?item.value:item" :size="item.style?item.style.fontSize:18" :color="item.style?item.style.color:'#FFFFFF'" @click="$props.iconClick[index]"></uni-icons></view>
				</template>
				<template v-if="typeof text ==='string'">
					<view style="margin: 0 8px;" :style="{'color':(text.style?text.style.color:'#FFFFFF'),'font-size':(text.style?text.style.fontSize:'15px')}" @click="$props.textClick">{{text.value?text.value:text}}</view>
				</template>
				<template v-else-if="typeof text === 'object'">
					<view v-for="(item,index) in text" :key='item' style="margin: 0 8px;" :style="{'color':(item.style?item.style.color:'#FFFFFF'),'font-size':(item.style?item.style.fontSize+'px':'15px')}" @click="$props.textClick[index]">{{item.value?item.value:item}}</view>
				</template>
			</view>
		</u-navbar-my>
		<uni-drawer ref="showPersonInfo" mode="left">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view style="text-align: center;" @click="headImg()">
					<image :src="personInfo.img_url"
						style="width: 100px;height: 100px;border-radius: 50%;margin-top: 50px;"></image>
				</view>
				<view style="text-align: center;margin-top: 10px;">{{personInfo.user_name}}</view>
				<view style="height: 15px;background-color: #DCDFE6;margin-top: 30px;"></view>
				<uni-list>
					<!-- <uni-list-item @click="gotoMyData()" title="我的资料" link to=''></uni-list-item>
					<uni-list-item @click="gotoGrades()" title="学习成绩" link to=''></uni-list-item> -->
					<uni-list-item @click="gotoModifyPswd()" title="修改密码" link to=''></uni-list-item>
					<uni-list-item @click="zhuxiao()" title="注销账号" link to=''></uni-list-item>
					<uni-list-item @click="yinsi()" title="用户隐私政策" link to=''></uni-list-item>
					<uni-list-item @click="about()" title="关于" link to=''></uni-list-item>
				</uni-list>
				<view v-if="personInfo.backFlag == 1" class="uni-padding-wrap uni-common-mt">
					<button @click="tuichu()" type="warn">退出登录</button>
				</view>
				<view v-if="personInfo.backFlag == 2"  class="uni-padding-wrap uni-common-mt">
					<button @click="unReg()" type="warn">解除绑定</button>
				</view>
			</scroll-view>
		</uni-drawer>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="确定注销?" content="注销后账号将不可使用，与账号相关的数据也会一并删除，确定注销吗？" :duration="2000"
				:before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		name: 'mynavBar',
		props: {
			personInfo: {
				type: Object,
				default () {
					return {
						img_url: '',
						user_name: '',
						backFlag:0,//1退出登录，2解除绑定
						rightObj:'',//右侧对象
					}
				}
			},
			navItem: {
				type: Object,
				default () {
					return {
						text: '',
						index: 1
					}
				}
			},
			icon:{
				type:[Array,Object,String],
				default(){
					return ''
				}
			},
			iconClick:{
				type:[Array,Object,Function],
				default(){
					return {}
				}
			},
			text:{
				type:[Array,Object,String],
				default(){
					return null
				}
			},
			textClick:{
				type:[Array,Object,Function],
				default(){
					return {}
				}
			},
			titleClick:{
				type:Function,
				default:()=>{}
			}
		},
		methods: {
			unReg:function(){
				var personal = util.getPersonal();
				//不需要加密的数据 
				var comData2 = {
					platform_code: this.globaData.PLATFORMCODE, //平台代码
					app_code: this.globaData.APPCODE, //应用系统代码
					index_code:'index',
					unit_code: personal.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
					access_token:personal.access_token,
					op_user_code:personal.user_code,//用户代码
					thuser_code:personal.openid,//第三方用户代码或账号
					thuser_fromcode:this.globaData.THIRD_FORMCODE,//第三方平台,微信:WX;支付宝:ZFB
				};
				this.showLoading();
				//2.8.第三方账号解绑
				this.post(this.globaData.INTERFACE_HR_SKIN + 'unregister/thuserunreg', comData2, (data0,data2) => {
					if (data2.code == 0) {
						this.hideLoading();
						util.setPersonal({});
						this.$refs.showPersonInfo.close();
						uni.reLaunch({
							url: '/pages/login/index'
						});
					} else {
						this.showToast(data2.msg);
					}
				});
			},
			upLoadImg: function() {
				this.$set(this.personInfo, 'img_url', util.getPersonal().img_url);
			},
			headImg: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/headImg');
			},
			clickLeftImg() {
				if (this.navItem.index == 0) {
					this.$refs.showPersonInfo.open();
				} else if (this.navItem.index > 4 && this.navItem.index < 100) {
					uni.switchTab({url: '/pages/more/index'});
				}else if(this.navItem.index === 100){
					uni.$emit("clickLeft");
					// #ifdef H5
						const pages = getCurrentPages()
						if (pages.length > 1) {
							if(this.navItem.delta){
								uni.navigateBack({delta:this.navItem.delta})
								return
							}else{
								uni.navigateBack({delta:1})
								return;
							}
						}else{
							//使用vue-router返回上一级
							let a = this.$router.go(-1)
							return;
						}
					// #endif
					// #ifdef APP-PLUS
						if(this.navItem){
							uni.navigateBack({delta:this.navItem.delta})
							return
						}else{
							uni.navigateBack({delta:1})
							return;
						}
						
					// #endif
					// this.$router.go(-1)
				}
			},
			closeDrawer() {
				this.$refs.showPersonInfo.close();
			},
			gotoMyData: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/mydata/index');
			},
			gotoGrades: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/grades/index');
			},
			gotoModifyPswd: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/modifyPswd');
			},
			zhuxiao: function() {
				this.$refs.showPersonInfo.close();
				this.$refs.popup.open();
			},
			yinsi: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/privace');
			},
			about: function() {
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/about');
			},
			close() {
				this.$refs.popup.close();
			},
			confirm(value) {
				this.$refs.popup.close();
				var personal = util.getPersonal();
				//不需要加密的数据
				var comData0 = {
					index_code: 'index',
					op_user_code: personal.user_code,
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_HR_SKIN + 'unregister', comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						util.setPersonal({});
						uni.reLaunch({
							url: '/pages/login/index'
						});
					} else {
						this.showToast(data.msg);
					}
				});
			},
			tuichu() {
				var personal = util.getPersonal();
				if (personal) { //多次点击按钮，personal为null
					console.log("personal: " + JSON.stringify(personal));
					var comData0 = {
						platform_code: personal.platform_code, //平台代码
						app_code: personal.app_code, //应用系统代码
						unit_code: personal.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						index_code: 'index',
						access_token: personal.access_token
					};
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_SSO_SKIN + 'session/removeSession', comData0, data => {
						this.hideLoading();
						util.setPersonal({});
						this.$refs.showPersonInfo.close();
						uni.reLaunch({
							url: '/pages/login/index'
						});
					});
				}
			}
		}
	}
</script>

<style>
</style>
