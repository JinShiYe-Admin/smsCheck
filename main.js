import Vue from 'vue'
import App from './App'
import {
	post
} from 'commom/request/request.js'
import uView from './third-ui/uview-ui'
import util from './commom/util.js'
import moment from 'moment'
Vue.use(uView);
import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp);
//配置项开始
const GLOBALDATA = {}; //参数对象 用于存全局公共参数
const EnvKey = 3; //1:山东开发 2:广西开发 3:联测 4:云测 5:正式 6性能测试   
Vue.prototype.APPORWECHAT = 1; //app为1，微信里面是2
switch (EnvKey) {
	case 1:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0002'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '100004'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 15; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oatest1010'; //七牛appkey
		break;
	case 2:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0002'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '100004'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 15; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oatest1010'; //七牛appkey
		break;
	case 3:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0001'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '-1'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.INTERFACE_SSO_SKIN = 'https://test.108800.com/ssotoskin/api/skin/'; //单点登录,供PC外皮及APP用户登录,管理
		GLOBALDATA.INTERFACE_SSO_HR = 'https://test.108800.com/ssotohr/api/hr/'; //单点登录,供人事系统使用
		GLOBALDATA.INTERFACE_SUP_HR = 'https://test.108800.com/suptohr/api/hr/'; //单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_SUB = 'https://test.108800.com/ssotosub/api/sub/'; //单点登录,供各子系统用
		GLOBALDATA.INTERFACE_HR_SUB = 'https://test.108800.com/testhrtosub/api/sub/'; //人事接口,供子系统用
		GLOBALDATA.INTERFACE_HR_SKIN = 'https://test.108800.com/testhrtosup/api/skin/'; //人事接口,供APP或PC注册及外皮用
		GLOBALDATA.INTERFACE_OA = 'https://develop309.108800.com/oasubapi/sub/api/'; //oa接口(孔)
		GLOBALDATA.INTERFACE_ITEM = 'https://develop309.108800.com/imsubapi/sub/api/'; //物品管理接口(孔)  http://115.28.11.115:8080/imsubapi/sub/api/
		GLOBALDATA.INTERFACE_BASESUB = 'https://test.108800.com/baseapi/api/baseapi/'; //统一信息接口:考务、家校用(顾)
		GLOBALDATA.INTERFACE_EXAMINATION = 'https://developgx.108800.com:8443/stuzy/api/paper/'; //考务系统接口(蒙)
		GLOBALDATA.INTERFACE_WORK = 'https://developgx.108800.com:8443/stukqsubapi/attendance/'; //学生考勤系统接口(阮)
		GLOBALDATA.INTERFACE_PROGRAMME = 'https://develop309.108800.com/tecrcsubapi/sub/api/'; //日程（孔)
		GLOBALDATA.INTERFACE_ATTENDAND = 'https://develop309.108800.com/tecgpskqsubapi/sub/api/'; //教师考勤（孔)
		GLOBALDATA.INTERFACE_STUXWSUB = 'https://developgx.108800.com:8443/stuxwsubapi/behavior/'; //学生行为（阮) 
		GLOBALDATA.INTERFACE_STUPYSUB = 'https://developgx.108800.com:8443/stuxwsubapi/comment/'; //学生评语（阮)
		GLOBALDATA.INTERFACE_DORM = 'https://developgx.108800.com:8443/stusssubapi/api/app/'; //学生宿舍（阮)
		GLOBALDATA.INTERFACE_STUSCORE = 'https://developgx.108800.com:8443/stuzy/api/stuScore/'; //学生成绩（蒙)
		GLOBALDATA.INTERFACE_ZXKT = "https://developgx.108800.com:8443/resstudysubapi/api"; //智学课堂（廖）
		GLOBALDATA.INTERFACE_KYCP = "https://developgx.108800.com:8443/resentestsubapi/api"; //口语测评（廖）
		GLOBALDATA.INTERFACE_SCHHOME = 'https://test.108800.com/testhsservsubapi/'; //家校互动（顾)
		GLOBALDATA.INTERFACE_SCHHOME_STU = 'https://test.108800.com/testhsservsubapi/'; //家校互动 学生端（顾)
		GLOBALDATA.PARENTS_ATTENDANCE = 'https://developgx.108800.com:8443/stukq/api/app/'; //学生考勤家长端（阮)、行为与评语
		GLOBALDATA.INTERFACE_MARKINGPAPERS = 'https://developgx.108800.com:8443/stuzysubapi/api/admin/'; //考务--阅卷，（蒙)
		GLOBALDATA.STULEAVE_API = 'https://develop309.108800.com/stuleavesubapi/sub/api/'; //学生请假系统(孔)

		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 16; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oatest1010'; //七牛appkey
		break;
	case 4:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0002'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '-1'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.INTERFACE_SSO_SKIN = 'https://test.108800.com/ssotoskin/api/skin/'; //单点登录,供PC外皮及APP用户登录,管理  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_HR = 'https://test.108800.com/ssotohr/api/hr/'; //单点登录,供人事系统使用                  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SUP_HR = 'https://test.108800.com/suptohr/api/hr/'; //单点登录,供人事系统使用                  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_SUB = 'https://test.108800.com/ssotosub/api/sub/'; //单点登录,供各子系统用 			     单点对子系统接口
		GLOBALDATA.INTERFACE_HR_SUB = 'https://test.108800.com/hrtosub/api/sub/'; //人事接口,供子系统用 				     人事对子系统接口
		GLOBALDATA.INTERFACE_HR_SKIN = 'https://test.108800.com/hrtosup/api/skin/'; //人事接口,供APP或PC注册及外皮用        人事对单点及登录皮肤接口
		GLOBALDATA.INTERFACE_OA = 'https://test.108800.com/oasubapi/sub/api/'; //oa接口(孔)
		GLOBALDATA.INTERFACE_ITEM = 'https://test.108800.com/imsubapi/sub/api/'; //物品管理接口(孔)
		GLOBALDATA.INTERFACE_BASESUB = 'https://test.108800.com/baseapi/api/baseapi/'; //统一信息接口:考务、家校用(顾)
		GLOBALDATA.INTERFACE_EXAMINATION = 'https://test.108800.com/stuzy/api/paper/'; //考务系统接口(蒙)
		GLOBALDATA.INTERFACE_WORK = 'https://test.108800.com/stukqsubapi/attendance/'; //学生考勤系统接口(阮)
		GLOBALDATA.INTERFACE_PROGRAMME = 'https://test.108800.com/tecrcsubapi/sub/api/'; //日程（孔)
		GLOBALDATA.INTERFACE_ATTENDAND = 'https://test.108800.com/tecgpskqsubapi/sub/api/'; //教师考勤（孔)
		GLOBALDATA.INTERFACE_STUXWSUB = 'https://test.108800.com/stuxwsubapi/behavior/'; //学生行为（阮) 
		GLOBALDATA.INTERFACE_STUPYSUB = 'https://test.108800.com/stuxwsubapi/comment/'; //学生评语（阮)
		GLOBALDATA.INTERFACE_DORM = 'https://test.108800.com/stusssubapi/api/app/'; //学生宿舍（阮)
		GLOBALDATA.INTERFACE_STUSCORE = 'https://test.108800.com/stuzy/api/stuScore/'; //学生成绩（蒙)
		GLOBALDATA.INTERFACE_ZXKT = "https://test.108800.com/resstudysubapi/api"; //智学课堂（廖）
		GLOBALDATA.INTERFACE_KYCP = "https://test.108800.com/resentestsubapi/api"; //口语测评（廖）
		GLOBALDATA.INTERFACE_SCHHOME = 'https://test.108800.com/hsservsubapi/'; //家校互动（顾)
		GLOBALDATA.INTERFACE_SCHHOME_STU = 'https://test.108800.com/hsservsubapi/'; //家校互动 学生端（顾)
		GLOBALDATA.PARENTS_ATTENDANCE = 'https://test.108800.com/stukq/api/app/'; //学生考勤家长端（阮)、行为与评语
		GLOBALDATA.INTERFACE_MARKINGPAPERS = 'https://test.108800.com/stuzysubapi/api/admin/'; //考务--阅卷，（蒙)
		GLOBALDATA.STULEAVE_API='https://test.108800.com/stuleavesubapi/sub/api/';//学生请假系统(孔)

		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 16; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oatest1010'; //七牛appkey
		break;
	case 5:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0001'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '-1'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.INTERFACE_SSO_SKIN = 'https://sso.108800.com:8443/ssotoskin/api/skin/'; // 单点对登录框接口
		GLOBALDATA.INTERFACE_SSO_HR = 'https://sso.108800.com:8443/ssotohr/api/hr/'; // 单点对人事接口 (gu )
		GLOBALDATA.INTERFACE_SUP_HR = 'https://sso.108800.com/suptohr/api/hr/'; //单点对人事及登录皮肤接口  (zeng)
		GLOBALDATA.INTERFACE_SSO_SUB = 'https://sso.108800.com:8443/ssotosub/api/sub/'; // 单点对子系统接口
		GLOBALDATA.INTERFACE_HR_SUB = 'https://apps.108800.com/hrtosub/api/sub/'; //人事接口,供子系统用 				     人事对子系统接口
		GLOBALDATA.INTERFACE_HR_SKIN = 'https://apps.108800.com/hrtosup/api/skin/'; //人事接口,供APP或PC注册及外皮用        人事对单点及登录皮肤接口
		GLOBALDATA.INTERFACE_OA = 'https://apps.108800.com/oasubapi/sub/api/'; //oa接口(孔)
		GLOBALDATA.INTERFACE_ITEM = 'https://apps.108800.com/imsubapi/sub/api/'; //物品管理接口(孔)
		GLOBALDATA.INTERFACE_BASESUB = 'https://sso.108800.com:8443/baseapi/api/baseapi/'; //统一信息接口:考务、家校用(顾)
		GLOBALDATA.INTERFACE_EXAMINATION = 'https://apps.108800.com/stuzy/api/paper/'; //考务系统接口(蒙)
		GLOBALDATA.INTERFACE_WORK = 'https://apps.108800.com/stukqsubapi/attendance/'; //学生考勤系统接口(阮)
		GLOBALDATA.INTERFACE_PROGRAMME = 'https://apps.108800.com/tecrcsubapi/sub/api/'; //日程（孔)
		GLOBALDATA.INTERFACE_ATTENDAND = 'https://apps.108800.com/tecgpskqsubapi/sub/api/'; //教师考勤（孔)
		GLOBALDATA.INTERFACE_STUXWSUB = 'https://apps.108800.com/stuxwsubapi/behavior/'; //学生行为（阮) 
		GLOBALDATA.INTERFACE_STUPYSUB = 'https://apps.108800.com/stuxwsubapi/comment/'; //学生评语（阮)
		GLOBALDATA.INTERFACE_DORM = 'https://apps.108800.com/stusssubapi/api/app/'; //学生宿舍（阮)
		GLOBALDATA.INTERFACE_STUSCORE = 'https://apps.108800.com/stuzy/api/stuScore/'; //学生成绩（蒙)
		GLOBALDATA.INTERFACE_ZXKT = "https://res.108800.com/resstudysubapi/api"; //智学课堂（廖）
		GLOBALDATA.INTERFACE_KYCP = "https://res.108800.com/resentestsubapi/api"; //口语测评（廖）
		GLOBALDATA.INTERFACE_SCHHOME = 'https://apps.108800.com:8443/hsservsubapi/'; //家校互动（顾)
		GLOBALDATA.INTERFACE_SCHHOME_STU = 'https://apps.108800.com:8443/hsservsubapi/'; //家校互动 学生端（顾)
		GLOBALDATA.PARENTS_ATTENDANCE = 'https://apps.108800.com/stukq/api/app/'; //学生考勤家长端（阮)、行为与评语
		GLOBALDATA.INTERFACE_MARKINGPAPERS = 'https://apps.108800.com/stuzysubapi/api/admin/'; //考务--阅卷，（蒙)
		GLOBALDATA.STULEAVE_API='https://apps.108800.com/stuleavesubapi/sub/api/';//学生请假系统(孔)
		
		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 17; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oafor1010'; //七牛appkey
		break;
	case 6:
		GLOBALDATA.EnvKey = EnvKey;
		GLOBALDATA.PLATFORMCODE = 'PT0002'; //平台代码
		GLOBALDATA.APPCODE = 'schapp#'; //应用系统代码
		GLOBALDATA.UNITCODE = '100001'; //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”

		GLOBALDATA.THIRD_FORMCODE = 'WX'; //第三方平台
		GLOBALDATA.QN_APPID = 16; //七牛appid
		GLOBALDATA.QN_APPKEY = 'oatest1010'; //七牛appkey
		break;
}

Vue.prototype.PRIVACE = 'https://jbsch-pb.zhuxue101.net/formal/privacy/jbxyPrivacy.html'; //用户隐私政策地址
Vue.prototype.QN_PV_NAME = 'jbsch-pv'; //七牛私有空间名
Vue.prototype.QN_PB_NAME = 'jbsch-pb'; //七牛公有空间名
Vue.prototype.QNGETUPLOADTOKEN = 'https://sso.108800.com:8443/qiniuapi/Api/QiNiu/GetUpLoadToKen';
Vue.prototype.QNGETDOWNTOKENFILE =
	'https://sso.108800.com:8443/qiniuapi/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
Vue.prototype.QNGETTOKENDELETE = 'https://sso.108800.com:8443/qiniuapi/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url

Vue.prototype.PWD_ENCRYPTION = '#@_JFnice_@#'; //修改密码时，加密密钥
Vue.prototype.SECRETKEY = 'jsy309'; //sign签名时需要的盐
//配置项结束

//以下内容不需要修改
Vue.prototype.globaData = GLOBALDATA; //参数对象 用于存全局公共参数
Vue.prototype.previewImg = '?imageView2/3/w/150/h/150/q/75/format/png'; //参数对象 用于存全局公共参数
Vue.prototype.requestTask = new Map(); //用于储存页面请求栈
Vue.prototype.showLoading = (requestTitle = '加载中...') => uni.showLoading({
	title: String(requestTitle),
	mask: true
}) //显示加载框
Vue.prototype.hideLoading = () => {
	setTimeout(() => {
		if (Vue.prototype.requestTask.size === 0) {
			uni.hideLoading()
		}
		// if (Vue.prototype.requestTask.size > 0) {
			setTimeout(() => {
				uni.hideLoading()
			}, 15000)
		// }
	}, 100)
} //关闭加载框

//#ifdef H5
if (process.env.NODE_ENV === 'development') { //如果是H5的开发环境，自动加载vconsole
	const vconsole = require('vconsole')
	Vue.prototype.$vconsole = new vconsole() //使用vconsole  APP和小程序端无法使用 
}
// #endif

Vue.prototype.personal = "PERSONAL" //登录用户信息存入storage时key的名称
Vue.prototype.meunList = "MENULIST" //登录用户菜单信息存入storage时key的名称
Vue.prototype.meunListMore = "MENULISTMORE" //登录用户菜单信息存入storage时key的名称
Vue.prototype.tabbarMenu = "TABBARMENU" //点击tabbar时，传菜单内容
// 头像
Vue.prototype.QN_HEADIMG = "headImg/"; //头像
// oa
Vue.prototype.QN_OA_SHIW = "oa/shiw/"; //oa事物
Vue.prototype.QN_OA_GZL = "oa/gzl/"; //oa工作流
Vue.prototype.QN_OA_ZLSJ = "oa/zlsj/"; //oa资料收集
Vue.prototype.QN_OA_TONGZ = "oa/tongz/"; //oa通知
Vue.prototype.QN_OA_GONGG = "oa/gongg/"; //oa公告
Vue.prototype.QN_OA_XIAOL = "oa/xiaol/"; //oa校历
// 学生行为
Vue.prototype.QN_XSXW_KTXW = "xsxw/ktxw/"; //课堂行为
Vue.prototype.QN_XSXW_KWXW = "xsxw/kwxw/"; //课外行为
Vue.prototype.QN_XSXW_XSTH = "xsxw/xsth/"; //学生谈话
// 教师考勤
Vue.prototype.QN_JSKQ_WDKQ = "jskq/wdkq/"; //我的考勤
// 阅卷
Vue.prototype.QN_MARKINGPAPERS = 'yuejuanApp/markingPapers'; //七牛公有空间名
// 口语测评
Vue.prototype.QN_KYCP = "zypt/kouyupingce/"; //口语测评

//----------家校互动短信配置---------start
Vue.prototype.MSG_SMS = {
	SCHOOL: {
		MSG_TYPE: '1-1', //信息类型 - 学校通知
		SMS_TYPE: 'jxhd_tz_unit_stugen', //短信类型 - 学校
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	GRADE: {
		MSG_TYPE: '1-2', //信息类型 - 年级通知
		SMS_TYPE: 'jxhd_tz_grd_stugen', //短信类型 - 年级
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	CLASS: {
		MSG_TYPE: '1-3', //信息类型 - 班级通知
		SMS_TYPE: 'jxhd_tz_cls_stugen', //短信类型 - 班级
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	HOMEWORK: {
		MSG_TYPE: '1-4', //信息类型 - 班级作业
		SMS_TYPE: 'jxhd_tz_cls_stugen', //短信类型 - 班级
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	PERFORMANCE: {
		MSG_TYPE: '1-5', //信息类型 - 在线表现
		SMS_TYPE: 'jxhd_tz_ps_stugen', //短信类型 - 表现
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	SCORE: {
		MSG_TYPE: '1-6', //信息类型 - 成绩通知
		SMS_TYPE: 'jxhd_cj_ps_stugen', //短信类型 - 成绩
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
}
//----------家校互动短信配置---------end

//----------OA短信配置---------start
Vue.prototype.OA_MSG_SMS = {
	SMS_TYPE: 'oa_tz_ps_tec',
	PAYSLIP: {
		MSG_TYPE: 'oa-payslip', //信息类型 - OA工资条
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
	BULLETIN: {
		MSG_TYPE: 'oa-bulletin', //信息类型 - 公告
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
	NOTICE: {
		MSG_TYPE: 'oa-notice', //信息类型 - 通知
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
	AFFAIR: {
		MSG_TYPE: 'oa-affair', //信息类型 - 事务
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
	WORKFLOW: {
		MSG_TYPE: 'oa-workflow', //信息类型 - 工作流
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
	INFOCOLLECT: {
		MSG_TYPE: 'oa-data', //信息类型 - 资料收集
		USER_TYPE: 'YHLX0003', //目标用户类型 - 教师
	},
}
//----------OA短信配置---------end

//----------学生考勤 短信配置---------start
Vue.prototype.STUKQ_MSG_SMS = {
	// INOUTSCH: {
	//    MSG_TYPE: 'ac-inoutsch', //信息类型 - 出入校
	//    USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	// },
	INCLS: {
		MSG_TYPE: 'ac-incls', //信息类型 - 课堂
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
	OUTCLS: {
		MSG_TYPE: 'ac-outcls', //信息类型 - 课外
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
	ASKLEAVE: {
		MSG_TYPE: 'ac-askleave', //信息类型 - 请假
		SMS_TYPE: 'jxhd_kq_ps_stugen', //短信类型 - 请假
		USER_TYPE: 'YHLX0003,YHLX0004,YHLX0005', //目标用户类型 - 老师和家长
	},
	ASKLEAVE_JIAOSHIDAI: {
		MSG_TYPE: 'ac-askleave', //信息类型 - 请假
		SMS_TYPE: 'jxhd_kq_ps_stugen', //短信类型 - 请假
		USER_TYPE: 'YHLX0004', //目标用户类型 - 家长
	},
	// DORM: {
	//    MSG_TYPE: 'ac-dorm', //信息类型 - 宿舍
	//    USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	// },
	// INOUTDORM: {
	//    MSG_TYPE: 'ac-inoutdorm', //信息类型 - 出入宿舍
	//    USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	// },
}
//----------学生考勤 短信配置---------end
//----------学生评语 短信配置---------start
Vue.prototype.REMARK_MSG_SMS = {
	REMARK: {
		MSG_TYPE: 'ac-remark', //信息类型 - 评语
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
}
//----------学生评语 短信配置---------end
//----------学生行为 短信配置---------start
Vue.prototype.ACTION_MSG_SMS = {
	CLSBEHAVIOR: {
		MSG_TYPE: 'ac-clsbehavior', //信息类型 - 课堂行为
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
	OUTCLSBEHAVIOR: {
		MSG_TYPE: 'ac-outclsbehavior', //信息类型 - 课外行为
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
}
//----------学生行为 短信配置---------end
//----------学生宿舍 短信配置---------start
Vue.prototype.DORM_MSG_SMS = {
	DORM: {
		MSG_TYPE: 'ac-dorm', //信息类型 - 宿舍考勤
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
	DORMBEHAVIOR: {
		MSG_TYPE: 'ac-dormbehavior', //信息类型 - 宿舍行为
		USER_TYPE: 'YHLX0004,YHLX0005', //目标用户类型 - 学生家长
	},
}
//----------学生宿舍 短信配置---------end

Vue.prototype.post = post //引入全局请求
Vue.prototype.moment = moment; //全局时间插件
Vue.prototype.getPermissionByPosition = util.getPermissionByPosition //全局获取按钮权限
Vue.prototype.showToast = util.showToast //引入全局Toast
Vue.config.productionTip = false //不知道啥用
App.mpType = 'app'
const app = new Vue({
	...App
})

app.$mount()
