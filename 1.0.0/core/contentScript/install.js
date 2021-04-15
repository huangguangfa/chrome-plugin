/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/contentScript/install.js":
/*!*******************************************!*\
  !*** ./src/core/contentScript/install.js ***!
  \*******************************************/
/***/ (() => {

eval("//bg通知content页面刷新操作\r\nchrome.runtime.onMessage.addListener(function(request, sender, sendResponse){\r\n    const { type } = request;\r\n    type === 'reload' && window.location.reload();\r\n    sendResponse({status:true,mes:'刷新成功'})\r\n});\r\n//利用js事件循环机制去最后执行重写操作\r\nsetTimeout(() => {\r\n    const script = document.createElement('script');\r\n    script.setAttribute('type', 'text/javascript');\r\n    script.setAttribute('src', chrome.extension.getURL('/core/contentScript/network.js'));\r\n    document.head.appendChild(script);\r\n});\r\nconst sendBgMessage = (data) =>{\r\n    chrome.runtime.sendMessage({ type:'page_request',data}, function(response) {\r\n        // console.log('后台的回复：' + response);\r\n    });\r\n}\r\n\r\n//接收inject页面消息\r\nwindow.addEventListener(\"message\", function(e){\r\n    const { data } = e;\r\n    sendBgMessage(data)\r\n}, false);\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://chrome-plugin/./src/core/contentScript/install.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/core/contentScript/install.js"]();
/******/ 	
/******/ })()
;