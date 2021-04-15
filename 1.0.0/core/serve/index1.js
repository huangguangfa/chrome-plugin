/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/serve/index.js":
/*!*********************************!*\
  !*** ./src/core/serve/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _plugin_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../plugin/request */ \"./src/plugin/request.js\");\n\r\n\r\n//和当前Tabs通信\r\nconst sendTabsMes = ( data ) =>{\r\n    return new Promise( resolve => {\r\n        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){\r\n            if(!tabs.length || tabs[0].url === 'chrome://extensions/' ) return resolve({status:true,mes:'刷新成功'});\r\n            chrome.tabs.sendMessage(tabs[0].id, data, function(response){\r\n                resolve(response)\r\n            });\r\n        });\r\n    })\r\n}\r\n\r\n//桌面通知\r\nvar notifications = ( {title=\"导出会员列表\",message=\"导出成功\"}) =>{\r\n    chrome.notifications.create(null, {\r\n        type: 'basic',\r\n        iconUrl: 'logo.png',\r\n        title,\r\n        message\r\n    });\r\n}\r\n\r\nvar badge = {\r\n    set:(text=\"new\") =>{\r\n        chrome.browserAction.setBadgeText({text});\r\n        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});\r\n    },\r\n    del:(text=\"\") =>{\r\n        chrome.browserAction.setBadgeText({text});\r\n        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});\r\n    }\r\n}\r\n\r\n// chrome.runtime.onInstalled.addListener(function(request, sender, sendResponse){\r\n// \t//切换标签判断插件是否高亮\r\n// \tchrome.declarativeContent.onPageChanged.removeRules(undefined, function(){\r\n// \t\tchrome.declarativeContent.onPageChanged.addRules([\r\n// \t\t\t{\r\n// \t\t\t\tconditions: [\r\n// \t\t\t\t\t// new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'https://huangguangfa.cn'}})\r\n// \t\t\t\t\tnew chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: '<all_urls>'}})\r\n// \t\t\t\t],\r\n// \t\t\t\tactions: [new chrome.declarativeContent.ShowPageAction()]\r\n// \t\t\t}\r\n// \t\t]);\r\n// \t});\r\n// \t//获取当前页\r\n//     chrome.tabs.query({currentWindow: true, active : true}, (tabArr) => {\r\n//         console.log(tabArr);\r\n//     })\r\n// });\r\n\r\nconst vm = null;\r\nconst networkConfig = {\r\n    //规则配置\r\n    rule_config:{\r\n        //规则列表\r\n        rule_list:[\r\n            //value规则对象 label规则名称\r\n            { value:'A1',label:'广发网站技术列表' },\r\n            { value:'A2',label:'优剪会员列表' },\r\n            { value:'A3',label:'博卡会员列表' },\r\n            { value:'A4',label:'美咖会员列表' },\r\n        ],\r\n        //开启规则\r\n        start_rule:'A3',\r\n        //抓取的接口\r\n        start_intercept_url:\"customer/elasticsearch/member/comp/001/basic/get\",\r\n        //匹配接口的结果参数\r\n        start_params:'result',\r\n        //规则对象\r\n        rule_object:{\r\n            'A1':{\r\n                url:\"blogs/typelist\",\r\n                name:'广发网站技术列表',\r\n                params:'result',\r\n                table_config:[ \r\n                    { prop: \"typeName\",label:\"名称\",Reg:null  },\r\n                    { prop: \"createdAt\",label:\"创建时间\",Reg:null  },\r\n                    { prop: \"updatedAt\",label:\"更新时间\",Reg:null  }\r\n                ]\r\n            },\r\n            'A2':{\r\n                url:'mgt/memeberValueCard/queryTHStoredValueCard',\r\n                name:'优剪会员列表',\r\n                params:'result',\r\n                table_config:[ \r\n                    { prop: \"mobile\",label:\"会员手机号\",Reg:null  },\r\n                    { prop: \"uid\",label:\"会员ID\",Reg:null  },\r\n                    { prop: \"id\",label:\"会员卡号\",Reg:null  },\r\n                    { prop: \"nickname\",label:\"微信昵称\",Reg:null  },\r\n                    { prop: \"createTime\",label:\"开卡时间\",Reg:null  }\r\n                ]\r\n            },\r\n            'A3':{\r\n                url:'customer/elasticsearch/member/comp/001/basic/get',\r\n                name:'博卡会员列表',\r\n                params:'data',\r\n                table_config:[ \r\n                    { prop: \"gba03c\",label:\"会员名称\",Reg:null  },\r\n                    { prop: \"gba08c\",label:\"会员手机号\",Reg:null  },\r\n                    { prop: \"sexText\",label:\"性别\",Reg:null }\r\n                ]\r\n            },\r\n            'A4':{\r\n                url:'yingmei.php/member/memberList',\r\n                name:'美咖会员列表',\r\n                params:'data',\r\n                table_config:[ \r\n                    { prop: \"truename\",label:\"会员名称\",Reg:'/\\>.*?\\</g' },\r\n                    { prop: \"phone\",label:\"会员手机号\" ,Reg:null}\r\n                ]\r\n            }\r\n        }\r\n    },\r\n    //抓取的表格数据\r\n    table_data:[],\r\n    //所有请求的结果\r\n    requestResult:null,\r\n    //是否开启插件页面\r\n    isStartPlugin:false\r\n}\r\n\r\nconsole.log(networkConfig)\r\n\r\n// ----------------- bg事件 ---------------------------------------------------------\r\n\r\n//bg接收消息处\r\nchrome.runtime.onMessage.addListener(function(request, sender, sendResponse){\r\n    const { type } = request;\r\n    type === 'page_request' && getContentMessage(request,sendResponse)\r\n    type !== 'page_request' && getBrowserActionMessage(request,sendResponse)\r\n});\r\n\r\n//接收browserAction页面消息\r\nfunction getBrowserActionMessage(request,sendResponse){\r\n    const { type,data } = request;\r\n    type === 'update_rule_list' && updateRuleConfig(data,sendResponse);\r\n    type === 'switch_rule' && switchRule(data,sendResponse);\r\n    type === 'del_rule' && delRule(data,sendResponse);\r\n    type === 'edit_rule' && editRule(data,sendResponse);\r\n}\r\n\r\n//接收content消息\r\nfunction getContentMessage(request,sendResponse){\r\n    const { type,response,req_type,postData,method,getData,url } = request.data;\r\n    const { start_intercept_url,start_params  } = networkConfig.rule_config;\r\n    sendResponse('1');\r\n    if( url && url.search(start_intercept_url) > 0  ){\r\n        //这里拿不到vm实例\r\n        const data = recursionResult(start_params,JSON.parse(response));  //美咖\r\n        networkConfig.table_data = handleTableData(data);\r\n        networkConfig.requestResult = {\r\n            type,\r\n            req_type,\r\n            postData,\r\n            method,\r\n            getData,\r\n            url,\r\n            data:JSON.parse(response)\r\n        };\r\n        vm && vm.initPage();\r\n        badge.set();\r\n        // console.log('bg拦截接口详情',data)\r\n    }\r\n}\r\n\r\n//监听标签页面的url变化\r\nchrome.tabs.onUpdated.addListener(function (id, info, tab) {\r\n    tab.status === \"complete\" && tab.url && checkCurrentWebObject(tab.url);\r\n    badge.del();\r\n    networkConfig.table_data = [];\r\n});\r\n\r\n//监听标签页面切换\r\nconst load_page_List = ['huangguangfa.cn','s3.boka.vc','m-test.51yxm.com','a5.meikayun.com']\r\nchrome.tabs.onActivated.addListener(function (activeInfo) {\r\n    const { tabId } = activeInfo;\r\n    badge.del();\r\n    networkConfig.table_data = [];\r\n    chrome.tabs.get(tabId, function(tab) {\r\n        tab.url && checkCurrentWebObject(tab.url,tabId)\r\n    });\r\n});\r\n\r\n// ------------------------------------------------------------ 规则维护部分 --------------------------------------------------------------------------------------\r\n\r\n//更新规则配置\r\nfunction updateRuleConfig(data,cb){\r\n    let { rule_config } = networkConfig;\r\n    let { name,url,table_config ,params} = data;\r\n    //如果规则名称已存在、不接受操作\r\n    if(rule_config.rule_list.map( item => item.label).includes( name )) return cb({status:false,mes:'当前名称规则已存在'});\r\n    let id = `A${rule_config.rule_list.length + 1}`;\r\n    //规则列表添加一项\r\n    rule_config.rule_list.push( { value:id,label:name } );\r\n    //规则对象配置添加一项\r\n    rule_config.rule_object[id] = {\r\n        name, url, table_config,params\r\n    }\r\n    cb({status:true,mes:'操作成功！'})\r\n}\r\n//切换拦截规则\r\nfunction switchRule(r,cb){\r\n    let data = networkConfig.rule_config.rule_object[r];\r\n    if(!data) return cb({status:false,mes:'未找到当前规则拦截名称'});\r\n    networkConfig.rule_config.start_rule = r;\r\n    networkConfig.rule_config.start_intercept_url = data.url;\r\n    networkConfig.rule_config.start_params = data.params;\r\n    networkConfig.table_data = [];\r\n    sendTabsMes({type:'reload'})\r\n    cb({status:true,mes:'切换成功、正在重新刷新浏览器重新拦截接口'})\r\n}\r\n//删除某个规则\r\nfunction delRule(value,cb){\r\n    let data = networkConfig.rule_config.rule_object[value];\r\n    if(!data) return cb({status:false,mes:'没有可删除的规则'});\r\n    delete networkConfig.rule_config.rule_object[value];\r\n    networkConfig.rule_config.rule_list = networkConfig.rule_config.rule_list.filter( item => item.value !=  value);\r\n    cb({status:true,mes:'删除成功'})\r\n}\r\n//编辑规则\r\nfunction editRule(data,cb){\r\n    const { edit_rule_name ,name ,url,table_config ,params} = data;\r\n    let rule_object = networkConfig.rule_config.rule_object;\r\n    if(!rule_object[edit_rule_name]) return cb({status:false,mes:'未找到可修改的规则'});\r\n    rule_object[edit_rule_name].url = url;\r\n    rule_object[edit_rule_name].name = name;\r\n    rule_object[edit_rule_name].params = params;\r\n    rule_object[edit_rule_name].table_config = table_config;\r\n    networkConfig.rule_config.rule_list = networkConfig.rule_config.rule_list.map( item => {\r\n        return { value:item.value,  label:item.value === edit_rule_name ? name : item.label }\r\n    })\r\n    cb({status:true,mes:'修改成功！'})\r\n}\r\n\r\n//utc时间转北京时间\r\nfunction utc2beijing(utc_datetime) {\r\n    // 转为正常的时间格式 年-月-日 时:分:秒\r\n    let T_pos = utc_datetime.indexOf('T');\r\n    let Z_pos = utc_datetime.indexOf('Z');\r\n    let year_month_day = utc_datetime.substr(0,T_pos);\r\n    let hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);\r\n    let new_datetime = year_month_day+\" \"+hour_minute_second; // 2017-03-31 08:02:06\r\n    // 增加8个小时，北京时间比utc时间多八个时区\r\n    let timestamp;\r\n    // 处理成为时间戳\r\n    timestamp = new Date(Date.parse(new_datetime));\r\n    timestamp = timestamp.getTime();\r\n    timestamp = timestamp/1000;\r\n    timestamp = timestamp+8*60*60;\r\n    // 时间戳转为时间\r\n    let beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, \"-\").replace(/日/g, \" \");\r\n    return beijing_datetime; \r\n} \r\n\r\n//默认处理下数据操作\r\nfunction handleTableData( data ){    \r\n    const { start_rule,rule_object  } = networkConfig.rule_config;\r\n    const table_config = rule_object[start_rule].table_config.filter( item => item.Reg );\r\n    data.forEach( item =>{\r\n        table_config.forEach( ({ prop,Reg }) =>{\r\n            console.log(item[prop].match(Reg))\r\n            item[prop] && ( item[prop] = item[prop].match(Reg)?item[prop].match(Reg)[0].substring(1,item[prop].match(/\\>.*?\\</g)[0].length -1) : item[prop] )\r\n        })\r\n    })\r\n    return data\r\n}\r\n//递归找到接口对应参数\r\nfunction recursionResult( flag,obj ){\r\n    let result = null;\r\n    for( let key in obj ){\r\n        if( Object.prototype.toString.call(obj[key]) === '[object Object]' && JSON.stringify(obj[key]) !== '{}' ){\r\n            result = recursionResult(flag,obj[key])\r\n        }\r\n        if( key === flag && Array.isArray(obj[key]) ){  \r\n            result = obj[key];\r\n        }\r\n    }\r\n    return result;\r\n}\r\n//刷新页面\r\nvar refreshPage = ()=>{\r\n    sendTabsMes({type:'reload'})\r\n}\r\n\r\n//校验网站是否属于拦截对象\r\nfunction checkCurrentWebObject(url,tabId){\r\n    let urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?/; \r\n    //判断当前是否属于需要拦截的网站\r\n    if( url && url.match(urlReg) && load_page_List.includes( url.match(urlReg)[0] ) ){\r\n        networkConfig.isStartPlugin = true;\r\n        //重新写入监听事件、解决初次监听成功因为切换了其他tabs而导致无法在收到bg消息\r\n        url !== 'chrome://extensions/' && tabId && chrome.tabs.executeScript(tabId,{code:\"chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){ const { type } = request; type === 'reload' && window.location.reload(); sendResponse({status:true,mes:'刷新成功'})});\"},null);\r\n    }else{\r\n        networkConfig.isStartPlugin = false;\r\n    }\r\n    setBrowserActionIcon()\r\n}\r\n\r\n//设置BrowserActionIcon\r\nfunction setBrowserActionIcon(){\r\n    const { isStartPlugin } = networkConfig;\r\n    chrome.browserAction.setIcon({\r\n        path : {\r\n            \"48\":isStartPlugin ? \"/icons/logo.png\" : \"/icons/logoh.png\",\r\n            \"64\":isStartPlugin ? \"/icons/logo.png\" : \"/icons/logoh.png\",\r\n        }\r\n    })\r\n    chrome.browserAction.setPopup({\r\n        popup: isStartPlugin ? '/browserAction/index.html' : '/browserAction/no_plugin.html'\r\n    })\r\n}\r\n\r\n//点击图标触发的事件\r\n// const browserActionOnclick = ( pageUrl ) =>{\r\n//     console.log(pageUrl)\r\n//     chrome.browserAction.onClicked.addListener(function() {\r\n//         chrome.browserAction.setPopup({\r\n//             popup:pageUrl\r\n//         })\r\n//     });\r\n// }\r\n\r\n// chrome.browserAction.onClicked.addListener(function() {\r\n    // console.log('xasxasxas')\r\n// });\r\n\r\n\r\n\n\n//# sourceURL=webpack://chrome-plugin/./src/core/serve/index.js?");

/***/ }),

/***/ "./src/plugin/request.js":
/*!*******************************!*\
  !*** ./src/plugin/request.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"request\": () => (/* binding */ request)\n/* harmony export */ });\n//扩展方法、后期与后台通信操作\r\nfunction request(option) {\r\n    if (String(option) !== '[object Object]') return undefined;\r\n    option.method = option.method ? option.method.toUpperCase() : 'GET';\r\n    option.data = option.data || {};\r\n    var formData = [];\r\n    for (var key in option.data) {\r\n        formData.push(''.concat(key, '=', option.data[key]))\r\n    }\r\n    option.data = formData.join('&')\r\n  \r\n    if (option.method === 'GET') {\r\n        option.url += location.search.length === 0 ? ''.concat('?', option.data) : ''.concat('&', option.data)\r\n    }\r\n  \r\n    var xhr = new XMLHttpRequest()\r\n    xhr.responseType = option.responseType || 'json'\r\n    xhr.onreadystatechange = function () {\r\n        if (xhr.readyState === 4) {\r\n            if (xhr.status === 200) {\r\n                if (option.success && typeof option.success === 'function') {\r\n                    option.success(xhr.response)\r\n                }\r\n            } else {\r\n                if (option.error && typeof option.error === 'function') {\r\n                    option.error()\r\n                }\r\n            }\r\n        }\r\n    }\r\n    xhr.open(option.method, option.url, true)\r\n    if (option.method === 'POST') {\r\n        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')\r\n    }\r\n    xhr.send(option.method === 'POST' ? option.data : null)\r\n}\n\n//# sourceURL=webpack://chrome-plugin/./src/plugin/request.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/core/serve/index.js");
/******/ 	
/******/ })()
;