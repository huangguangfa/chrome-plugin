class RuleConfig{
    constructor(){
        //value规则对象 label规则名称
        this.rule_list = [
            { value:'A1',label:'广发网站技术列表' },
            { value:'A2',label:'优剪会员列表' },
            { value:'A3',label:'博卡会员列表' },
            { value:'A4',label:'美咖会员列表' },
        ]
        this.rule_object = {
            'A1':{
                url:"blogs/typelist",
                name:'广发网站技术列表',
                params:'result',
                table_config:[ 
                    { prop: "typeName",label:"名称",Reg:null  },
                    { prop: "createdAt",label:"创建时间",Reg:null  },
                    { prop: "updatedAt",label:"更新时间",Reg:null  }
                ]
            },
            'A2':{
                url:'mgt/memeberValueCard/queryTHStoredValueCard',
                name:'优剪会员列表',
                params:'result',
                table_config:[ 
                    { prop: "mobile",label:"会员手机号",Reg:null  },
                    { prop: "uid",label:"会员ID",Reg:null  },
                    { prop: "id",label:"会员卡号",Reg:null  },
                    { prop: "nickname",label:"微信昵称",Reg:null  },
                    { prop: "createTime",label:"开卡时间",Reg:null  }
                ]
            },
            'A3':{
                url:'customer/elasticsearch/member/comp/001/basic/get',
                name:'博卡会员列表',
                params:'data',
                table_config:[ 
                    { prop: "gba03c",label:"会员名称",Reg:null  },
                    { prop: "gba08c",label:"会员手机号",Reg:null  },
                    { prop: "sexText",label:"性别",Reg:null }
                ]
            },
            'A4':{
                url:'yingmei.php/member/memberList',
                name:'美咖会员列表',
                params:'data',
                table_config:[ 
                    { prop: "truename",label:"会员名称",Reg:'/\>.*?\</g' },
                    { prop: "phone",label:"会员手机号" ,Reg:null}
                ]
            }
        }
    }
}

export default RuleConfig;