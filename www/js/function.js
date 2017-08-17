//申请一个全局变量
var ShopPublic={
    myReg:'',
    formData:'',
    pwdReg:''
};
ShopPublic.myReg=/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
//ShopPublic.pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
ShopPublic.formData=function formData(phone,code,code2,op,password,phoneTwo){
    if(phone == '' ||phone == null){
        toast('请先输入手机号');
        return false;
    }else if(!ShopPublic.myReg.test(phone)||phone.length<11){
        toast('请输入正确手机号');
        return false;
    }
    if(op){
        if (code == '' || code == null) {
            toast('请先输入验证码');
            return false;
        }else if(code2!=code){
            toast('请输入正确验证码');
            return false;
        }
        if(op==2){
            if (password == '' || password == null) {
                toast('请先输入密码');
                return false;
            } else if (password.length<6) {
               toast('密码长度至少6位!');
               return false;
            } else if (phoneTwo != phone) {
                toast('两次手机号不一致');
                return false;
            }
        }
        else if(op==3){
            if (password == '' || password == null) {
                toast('请先输入新手机号');
                return false;
            } else if (!ShopPublic.myReg.test(password)) {
                toast('请输入正确手机号');
                return false;
            } else if (phoneTwo != phone) {
                toast('两次手机号不一致');
                return false;
            }
        }
    }
    return true;
}
//格式化日期
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
//查询函数
/** mod 接口
 * op 操作
 * data 数据
 * fn 回调函数
 * efn 失败回调
 * */
function  pollQuery(mod,token,data,fn,efn,nSign){
    if(token&&token.length>5) {
        var payload = {};
        if (data) {
            payload = data;
        }
        yikeShop.query(mod, payload)
            .then(function (data) {
                fn(data);
            })
            .catch(function (data) {
                efn(data);
            });
       return false;
    }else{
       nSign();
    }
}