//bg通知content页面刷新操作
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    const { type } = request;
    type === 'reload' && window.location.reload();
    sendResponse({status:true,mes:'刷新成功'})
});
//利用js事件循环机制去最后执行重写操作
setTimeout(() => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL('/core/contentScript/network.js'));
    document.head.appendChild(script);
});
const sendBgMessage = (data) =>{
    chrome.runtime.sendMessage({ type:'page_request',data}, function(response) {
        // console.log('后台的回复：' + response);
    });
}

//接收inject页面消息
window.addEventListener("message", function(e){
    const { data } = e;
    sendBgMessage(data)
}, false);



