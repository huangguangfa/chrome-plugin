import { request } from '../../plugin/request';
import { recursionResult } from '../../shared/index';
import NetworkConfig from '../requestConfig/networkConfig';

//和当前Tabs通信
const sendTabsMes = ( data ) =>{
    return new Promise( resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            if(!tabs.length || tabs[0].url === 'chrome://extensions/' ) return resolve({status:true,mes:'刷新成功'});
            chrome.tabs.sendMessage(tabs[0].id, data, function(response){
                resolve(response)
            });
        });
    })
}

//桌面通知
var notifications = ( {title="导出会员列表",message="导出成功"}) =>{
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'logo.png',
        title,
        message
    });
}

window.badge = {
    set:(text="new") =>{
        chrome.browserAction.setBadgeText({text});
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    },
    del:(text="") =>{
        chrome.browserAction.setBadgeText({text});
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    }
}

// chrome.runtime.onInstalled.addListener(function(request, sender, sendResponse){
// 	//切换标签判断插件是否高亮
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'https://huangguangfa.cn'}})
// 					new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: '<all_urls>'}})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// 	//获取当前页
//     chrome.tabs.query({currentWindow: true, active : true}, (tabArr) => {
//         console.log(tabArr);
//     })
// });

// let a = new NetworkConfig();

window.vm = null;
window.networkConfig = new NetworkConfig();
// window.networkConfig = {
//     //规则配置
//     rule_config:{
//         //规则列表
//         rule_list:[
//             //value规则对象 label规则名称
//             { value:'A1',label:'广发网站技术列表' },
//             { value:'A2',label:'优剪会员列表' },
//             { value:'A3',label:'博卡会员列表' },
//             { value:'A4',label:'美咖会员列表' },
//         ],
//         //开启规则
//         start_rule:'A3',
//         //抓取的接口
//         start_intercept_url:"customer/elasticsearch/member/comp/001/basic/get",
//         //匹配接口的结果参数
//         start_params:'result',
//         //规则对象
//         rule_object:{
//             'A1':{
//                 url:"blogs/typelist",
//                 name:'广发网站技术列表',
//                 params:'result',
//                 table_config:[ 
//                     { prop: "typeName",label:"名称",Reg:null  },
//                     { prop: "createdAt",label:"创建时间",Reg:null  },
//                     { prop: "updatedAt",label:"更新时间",Reg:null  }
//                 ]
//             },
//             'A2':{
//                 url:'mgt/memeberValueCard/queryTHStoredValueCard',
//                 name:'优剪会员列表',
//                 params:'result',
//                 table_config:[ 
//                     { prop: "mobile",label:"会员手机号",Reg:null  },
//                     { prop: "uid",label:"会员ID",Reg:null  },
//                     { prop: "id",label:"会员卡号",Reg:null  },
//                     { prop: "nickname",label:"微信昵称",Reg:null  },
//                     { prop: "createTime",label:"开卡时间",Reg:null  }
//                 ]
//             },
//             'A3':{
//                 url:'customer/elasticsearch/member/comp/001/basic/get',
//                 name:'博卡会员列表',
//                 params:'data',
//                 table_config:[ 
//                     { prop: "gba03c",label:"会员名称",Reg:null  },
//                     { prop: "gba08c",label:"会员手机号",Reg:null  },
//                     { prop: "sexText",label:"性别",Reg:null }
//                 ]
//             },
//             'A4':{
//                 url:'yingmei.php/member/memberList',
//                 name:'美咖会员列表',
//                 params:'data',
//                 table_config:[ 
//                     { prop: "truename",label:"会员名称",Reg:'/\>.*?\</g' },
//                     { prop: "phone",label:"会员手机号" ,Reg:null}
//                 ]
//             }
//         }
//     },
//     //抓取的表格数据
//     table_data:[],
//     //所有请求的结果
//     requestResult:null,
//     //是否开启插件页面
//     isStartPlugin:false
// }

// ----------------- bg事件 ---------------------------------------------------------

//bg接收消息处
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    const { type } = request;
    type === 'page_request' && getContentMessage(request,sendResponse)
    type !== 'page_request' && getBrowserActionMessage(request,sendResponse)
});

//接收browserAction页面消息
function getBrowserActionMessage(request,sendResponse){
    const { type,data } = request;
    type === 'update_rule_list' && updateRuleConfig(data,sendResponse);
    type === 'switch_rule' && switchRule(data,sendResponse);
    type === 'del_rule' && delRule(data,sendResponse);
    type === 'edit_rule' && editRule(data,sendResponse);
}

//接收content消息
function getContentMessage(request,sendResponse){
    const { type,response,req_type,postData,method,getData,url } = request.data;
    const { start_intercept_url,start_params  } = networkConfig.rule_config;
    sendResponse('1');
    if( url && url.search(start_intercept_url) > 0  ){
        //这里拿不到vm实例
        const data = recursionResult(start_params,JSON.parse(response));  //美咖
        networkConfig.table_data = handleTableData(data);
        networkConfig.requestResult = {
            type,
            req_type,
            postData,
            method,
            getData,
            url,
            data:JSON.parse(response)
        };
        vm && vm.initPage();
        badge.set();
        // console.log('bg拦截接口详情',data)
    }
}

//监听标签页面的url变化
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    tab.status === "complete" && tab.url && checkCurrentWebObject(tab.url);
    badge.del();
    networkConfig.table_data = [];
});

//监听标签页面切换
const load_page_List = ['huangguangfa.cn','s3.boka.vc','m-test.51yxm.com','a5.meikayun.com']
chrome.tabs.onActivated.addListener(function (activeInfo) {
    const { tabId } = activeInfo;
    badge.del();
    networkConfig.table_data = [];
    chrome.tabs.get(tabId, function(tab) {
        tab.url && checkCurrentWebObject(tab.url,tabId)
    });
});

// ------------------------------------------------------------ 规则维护部分 --------------------------------------------------------------------------------------

//更新规则配置
function updateRuleConfig(data,cb){
    let { rule_config } = networkConfig;
    let { name,url,table_config ,params} = data;
    //如果规则名称已存在、不接受操作
    if(rule_config.rule_list.map( item => item.label).includes( name )) return cb({status:false,mes:'当前名称规则已存在'});
    let id = `A${rule_config.rule_list.length + 1}`;
    //规则列表添加一项
    rule_config.rule_list.push( { value:id,label:name } );
    //规则对象配置添加一项
    rule_config.rule_object[id] = {
        name, url, table_config,params
    }
    cb({status:true,mes:'操作成功！'})
}
//切换拦截规则
function switchRule(r,cb){
    let data = networkConfig.rule_config.rule_object[r];
    if(!data) return cb({status:false,mes:'未找到当前规则拦截名称'});
    networkConfig.rule_config.start_rule = r;
    networkConfig.rule_config.start_intercept_url = data.url;
    networkConfig.rule_config.start_params = data.params;
    networkConfig.table_data = [];
    sendTabsMes({type:'reload'})
    cb({status:true,mes:'切换成功、正在重新刷新浏览器重新拦截接口'})
}
//删除某个规则
function delRule(value,cb){
    let data = networkConfig.rule_config.rule_object[value];
    if(!data) return cb({status:false,mes:'没有可删除的规则'});
    delete networkConfig.rule_config.rule_object[value];
    networkConfig.rule_config.rule_list = networkConfig.rule_config.rule_list.filter( item => item.value !=  value);
    cb({status:true,mes:'删除成功'})
}
//编辑规则
function editRule(data,cb){
    const { edit_rule_name ,name ,url,table_config ,params} = data;
    let rule_object = networkConfig.rule_config.rule_object;
    if(!rule_object[edit_rule_name]) return cb({status:false,mes:'未找到可修改的规则'});
    rule_object[edit_rule_name].url = url;
    rule_object[edit_rule_name].name = name;
    rule_object[edit_rule_name].params = params;
    rule_object[edit_rule_name].table_config = table_config;
    networkConfig.rule_config.rule_list = networkConfig.rule_config.rule_list.map( item => {
        return { value:item.value,  label:item.value === edit_rule_name ? name : item.label }
    })
    cb({status:true,mes:'修改成功！'})
}

//utc时间转北京时间
function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    let T_pos = utc_datetime.indexOf('T');
    let Z_pos = utc_datetime.indexOf('Z');
    let year_month_day = utc_datetime.substr(0,T_pos);
    let hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    let new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
    // 增加8个小时，北京时间比utc时间多八个时区
    let timestamp;
    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;
    timestamp = timestamp+8*60*60;
    // 时间戳转为时间
    let beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return beijing_datetime; 
} 

//默认处理下数据操作
function handleTableData( data ){    
    const { start_rule,rule_object  } = networkConfig.rule_config;
    const table_config = rule_object[start_rule].table_config.filter( item => item.Reg );
    data.forEach( item =>{
        table_config.forEach( ({ prop,Reg }) =>{
            console.log(item[prop].match(Reg))
            item[prop] && ( item[prop] = item[prop].match(Reg)?item[prop].match(Reg)[0].substring(1,item[prop].match(/\>.*?\</g)[0].length -1) : item[prop] )
        })
    })
    return data
}


//刷新页面
var refreshPage = ()=>{
    sendTabsMes({type:'reload'})
}

//校验网站是否属于拦截对象
function checkCurrentWebObject(url,tabId){
    let urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/; 
    //判断当前是否属于需要拦截的网站
    if( url && url.match(urlReg) && load_page_List.includes( url.match(urlReg)[0] ) ){
        networkConfig.isStartPlugin = true;
        //重新写入监听事件、解决初次监听成功因为切换了其他tabs而导致无法在收到bg消息
        url !== 'chrome://extensions/' && tabId && chrome.tabs.executeScript(tabId,{code:"chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){ const { type } = request; type === 'reload' && window.location.reload(); sendResponse({status:true,mes:'刷新成功'})});"},null);
    }else{
        networkConfig.isStartPlugin = false;
    }
    setBrowserActionIcon()
}

//设置BrowserActionIcon
function setBrowserActionIcon(){
    const { isStartPlugin } = networkConfig;
    chrome.browserAction.setIcon({
        path : {
            "48":isStartPlugin ? "/icons/logo.png" : "/icons/logoh.png",
            "64":isStartPlugin ? "/icons/logo.png" : "/icons/logoh.png",
        }
    })
    chrome.browserAction.setPopup({
        popup: isStartPlugin ? '/browserAction/index.html' : '/browserAction/no_plugin.html'
    })
}

// chrome.browserAction.onClicked.addListener(function() {
    // console.log('xasxasxas')
// });


