<!-- 
打包说明
1、按需修改mainfest.json 里的版本号
3、修改main.js 文件的以下内容：
	EnvKey
 -->

#### 页面方法
```javascript
//showLoading  hideLoading  showToast
this.showLoading(title:String = "加载中...");
this.showToast(title:String = "")
this.hideLoading();

//时间格式化
this.moment().format('YYYY-MM-DD HH:mm:sss')

//获取全局公共参数
const globaData = this.globaData

//获取登录用户信息
const personal =util.getPersonal();

//获取tabbar
this.tabbar = util.getMenu();

//获取当前tab的菜单参数，主要是获取index_code
let tempMenu;
if (util.getMenuMore().length==0) {
	tempMenu = util.getTabbarMenu();
} else{
	tempMenu = util.getPageData(option);
}

//对象数组排序
let yearArray=[{text:"2019-2020",value:"2019-2020"},{text:"2020-2021",value:"2020-2021"}]
yearArray.sort(util.compare('value',0));

//页面跳转
util.openwithData(pageUrl,data,{
	refresh(data){//子页面调用父页面需要的方法
		console.log(data)
	}
})

//子页面给父页面传值
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('refresh', {data: 'test'});

//子页面获取父页面传入的data数据
onLoad: function(option) {
	const itemData = util.getPageData(option);
	console.log(itemData)
},

/**
 * post 请求
 * 注：responseData 为返回的对象 {"msg":"成功","code":"0000","data":{},"state":"ok"} data一层里面的内容
 * 如果想获取data外层整个返回参数，请使用response
 */

let comData={
	stu_code:personal.user_code,
	index_code:this.index_code,
}
this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,(responseData,response)=>{
	console.log(response)
},error=>{
	console.log(error)
})

//获取按钮权限
this.getPermissionByPosition("add,delete",tempMenu.access.split("#")[1],response=>{
	console.log("response: ",response);
})

//获取Vue 环境变量
process.env.NODE_ENV  "development":"production"

//自定义navbar 右上方显示文字 的方法
view：
<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
或 显示多个
<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navRightBtn" :textClick="navRightCallback"></mynavBar>
script vue：
单个按钮不需要传数组
navRightBtn:['全选','反选','确定'] //文字数组 
navRightBtn:[{value:'全选',style:{fontSize:15,color:'#00CFBD'}},{value:'反选',style:{fontSize:15,color:'#00CFBD'}},{value:'确定',style:{fontSize:15,color:'#00CFBD'}}] //对象数组  传入文字的内容、大小和颜色 
navRightCallback:[Function1,Function2,Function3] //方法数组

//自定义tabbar 右上方显示图标 的方法
<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick"></mynavBar>
或 显示多个
<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="navRightBtn" :iconClick="navRightCallback"></mynavBar>
script vue：
单个按钮不需要传数组
navRightBtn:['plusempty','add','delete'] //图标数组  只能出入uniapp 官方 demo  图标示例里的图标
navRightBtn:[{value:'plusempty',style:{fontSize:15,color:'#00CFBD'}},{value:'cart',style:{fontSize:15,color:'#00CFBD'}}] //对象数组  传入图标的内容、大小和颜色 
navRightCallback:[Function1,Function2,Function3] //方法数组

//标题栏中间字体添加点击事件
<mynavBar ref="mynavBar" :titleClick="titleClick" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
//标题栏中间字体添加图标
this.tabBarItem.titleIcon='arrowdown'
或
this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:30,color:'#000'}}
//获取七牛下载Token
this.showLoading();
let getDownToken = {
	appId: this.globaData.QN_APPID, //int 必填 项目id
	appKey: this.globaData.QN_APPKEY,
	urls: [this.audioUrl] //array 必填 需要获取下载token文件的路径
}
cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data) => {
	this.hideLoading();
	const tempArr = [];
	for (let i = 0; i < data.Data.length; i++) {
		let tempM = data.Data[i];
		tempArr.push(tempM.Value);
	}
	util.openFile(tempArr[0]);
});

//使用原生navbar page.json内新建页面style 下拉刷新配置参数
 "style" :                                                                                    
{
	"navigationBarTitleText": "",
	"enablePullDownRefresh": true,
	"app-plus": {
		"pullToRefresh": {
			"support": true,
			"style": "circle",
			"offset":"0px"
		}
	},
	"h5":{
		"pullToRefresh":{
			"offset":"0px"
		}
	}
}
//使用自定义navbar时  新建页面style 下拉刷新配置参数
 "style" :                                                                                    
{
	"navigationStyle": "custom", // 隐藏系统导航栏
	"navigationBarTitleText": "",
	"enablePullDownRefresh": true,
	"app-plus": {
		"pullToRefresh": {
			"support": true,
			"style": "circle",
			"offset":"76px"
		}
	},
	"h5":{
		"pullToRefresh":{
			"offset":"44px"
		}
	}
}

```

#### 模块说明
包名|说明|App|Api|流程|文档是否完成
-|-|-|-|-
examination|考务系统-成绩分析|Liu|Meng(广西)|开发|文档完成
examination|考务系统-班级成绩趋势|Zhao|廖(广西)|开发|文档完成
kouYuCePing|口语测评|Zhao|Meng(广西)|开发|文档完成
leave|学生请假管理|Liu|Kong|开发|待补
markingPapers|阅卷|zhao|meng|文档完成
oa|OA系统|zhao|Kong|正式|文档完成
parents_attendance|学生考勤家长端|zhao|阮本伟|正式|文档完成
programme|日程|Zhao|Kong|正式|文档完成
register|注册|zhao|meng|文档完成
schapp_item|物品管理|Liu|Kong|开发|文档完成
schapp_work|学生考勤|Liu|Ruan(广西)|开发|文档完成
schhome|家校互动 教师端|Liu|Meng(广西)|开发|文档完成
schhome_stu|家校互动 学生端|Liu|Gu|开发|文档完成
stu_behavior|学生行为|Liu|Ruan(广西)|开发|文档完成
stu_actionComment|行为与评语(学生/家长端)|Liu|Ruan(广西)|开发|文档完成
stu_comment|学生评语|Liu|Ruan(广西)|开发|文档完成
schhome_dorm|学生宿舍 学生端|Liu|Meng(广西)|开发|文档完成
student_performance|学生成绩|Zhao|Meng(广西)|开发|文档完成
teachercAttendance|教师考勤|Liu|Kong|开发|文档完成
zhiXueKeTang|智学课堂|zhao|廖建鹏|文档完成