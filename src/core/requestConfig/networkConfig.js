import RuleConfig from './ruleConfig';
class NetworkConfig extends RuleConfig{
    constructor(){
        super();
        //开启规则
        this.start_rule = 'A3';
        //抓取的接口
        this.start_intercept_url = 'customer/elasticsearch/member/comp/001/basic/get';
        //匹配接口的结果参数
        this.start_params = 'result';
        //抓取的表格数据
        this.table_data = [];
        //所有请求的结果
        this.requestResult = null;
        //是否开启插件页面
        this.isStartPlugin = false;
    }
}

export default NetworkConfig;