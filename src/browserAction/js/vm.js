const app = chrome.extension.getBackgroundPage();
//type发送的类型 data发送的数据
const sendMes = (type,data) =>{
    return new Promise( resolve =>{
        chrome.runtime.sendMessage( { type,data }, (res)=> {  resolve(res) });
    })
}

const vm = new Vue({
    el: '#app',
    data: {
        tableConfig:[],
        tableData: [],
        del_list:[],
        is_configuration_ules:false,
        //定义规则
        config:{
            name:null,          //拦截的名称
            url:null,           //拦截的url
            params:null, //接口展示字段
            isAdd:true, //是否新增操作
            edit_rule_name:null, //编辑的规则key
            table_config:[     //设置表头配置
                { prop: null,label:null,Reg:null },
                { prop: null,label:null,Reg:null },
                { prop: null,label:null,Reg:null } 
            ]
        },
        //规则列表
        rule_list:[],
        start_rule:"",
        //抓取的结果
        isJosnShow:false,
        isJsonString:false,
        jsonResultData:null
    },
    created(){
        this.initPage();
        app.badge.del();
    },
    methods:{
        initPage(){
            const { start_rule,rule_object,rule_list,table_data,requestResult } = app.networkConfig;
            //当前规则
            this.start_rule = start_rule;
            //表格参数
            this.tableConfig = rule_object[start_rule].table_config;
            //规则列表
            this.rule_list = rule_list;
            //获取表格数据
            this.tableData = table_data;
            //获取抓取的结果
            this.jsonResultData = this.jsonFormat(requestResult)
        },
        //删除某个规则
        async delRuleRow(data){
            const { value } = data;
            if( value === this.start_rule ) return this.$message.error('当前规则正在启动不能删除！')
            const { status, mes } = await sendMes('del_rule',value)
            !status && this.$message.error(mes);
            if(status) { this.$message.success(mes); this.initPage(); this.$refs.rule_list_ref.blur() }
        },
        // 切换规则
        async switchRule( res ){
            const { status, mes } = await sendMes('switch_rule',res);
            !status && this.$message.error(mes);
            status && this.$message.success(mes);
            if(status) this.initPage()
        },
        //刷新页面
        refreshPage(){
            app.refreshPage()
            this.isJosnShow = false;
            this.tableData = [];
        },
        //编辑规则
        editRule( data ){
            const { value } = data;
            if( value === this.start_rule ) return this.$message.error('当前规则正在启动不能编辑！')
            const { url,name, table_config,params} = app.networkConfig.rule_config.rule_object[value];
            this.config.isAdd = false;
            this.config.params = params;
            this.config.name = name;
            this.config.url = url;
            this.config.edit_rule_name = value;
            this.config.table_config = table_config;
            this.is_configuration_ules = true;
            this.$refs.rule_list_ref.blur()
        },
        handleeExport(){
            if(!this.del_list.length ) return this.$message.error('请勾选需要导出的数据');
            this.exports('导出列表',this.del_list);
        },
        uploadRow(index,data){  
            this.exports(`导出第${index+1}条数据`,[data])
        },
        exports(fileName,excel_data){
            //excel表头
            const excelHade = this.tableConfig.map( item => item.label )
            //遍历
            const exceLable = this.tableConfig.map( item => item.prop );
            const excelContent = excel_data.map( item => {
                const row_data = [];
                exceLable.forEach( Lable => row_data.push(item[Lable]) )
                return row_data
            })
            let option={
                fileName,
                datas:[ { sheetData:excelContent,  sheetHeader:excelHade } ]
            };
            let toExcel = new ExportJsonExcel(option);
            toExcel.saveExcel();
            // this.$message.success('导出成功');
            app.notifications({title:'导出会员列表',message:'导出成功！！！'})
            this.$refs.ref_table.clearSelection()
        },
        //批量删除
        delMore(){
            if(!this.del_list.length ) return this.$message.error('批量删除操作至少勾选一个');
            this.$confirm('确定执行批量删除操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                this.del_list.forEach( item => this.delleItem(item._index) )
                this.del_list = [];
                this.$message.success('操作成功');
            }).catch( () =>{});
        },  
        //单个删除
        delleItem(cur_index,status){
            this.tableData = this.tableData.filter( ( item,index ) =>  index !== cur_index );
            status &&  this.$message.success('操作成功');
        },
        tableRowClassName({row, rowIndex}) {
            if(!rowIndex) return;
            row._index = rowIndex;
            if( rowIndex % 2 === 1 ) return 'cu-row';
        },
        //规则配置
        async submit(){
            const { name,url,isAdd } = this.config;
            this.config.table_config = this.config.table_config.filter( item => item.prop && item.label )
            if( !name || !url || !this.config.table_config.length){ return this.$message.error('页面参数不能为空与必须有一个接口配置参数！') }
            let code = isAdd ? 'update_rule_list' : 'edit_rule'
            const { status, mes } = await sendMes(code,this.config);
            if(!status) return this.$message.error(mes);
            status && this.$message.success(mes)
            this.initPage()
            this.is_configuration_ules = false;
        },
        //清除新增规则参数配置
        clearRuleParams(){
            this.config = {
                name:null,         
                url:null,     
                params:null,      
                table_config:[    
                    { prop: null,label:null },
                    { prop: null,label:null },
                    { prop: null,label:null } 
                ]
            }
        },
        addRow(){
            this.config.table_config.push({ prop: null,label:null,Reg:null })
            this.$nextTick(() => {
                const div =  this.$refs.table_config;
                div.scrollTop = div.scrollHeight - 300;
            })
        },
        switchDataShow(){
            this.isJosnShow = !this.isJosnShow;
        },
        //json转换
        jsonFormat(jsonTemp) {
            let json = ''
            try {
                // stringify 时需指定缩进否则不会显示换行。为了防止传入的string没有指定 在此统一执行一遍
                if (typeof jsonTemp != 'string') {
                    json = JSON.stringify(jsonTemp, undefined, 2);
                } else {
                    json = JSON.stringify(JSON.parse(jsonTemp), undefined, 2)
                }
                let jsonObj = JSON.parse(json);
                if (typeof jsonObj === 'object') {
                    this.isJsonString = false
                    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
                            let cls = 'number';
                            if (/^"/.test(match)) {
                                if (/:$/.test(match)) {
                                cls = 'key';
                                } else {
                                cls = 'string';
                                }
                            } else if (/true|false/.test(match)) {
                                cls = 'boolean';
                            } else if (/null/.test(match)) {
                                cls = 'null';
                            }
                            return '<span class="' + cls + '">' + match + '</span>';
                        });
                } else {
                    this.isJsonString = true
                    return jsonTemp
                }
            } catch (e) {
              this.isJsonString = true
              return jsonTemp
            }
        }
    }
})
app.vm = vm;