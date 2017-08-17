/**
 * 易客商城
 * @param uid
 * @param openid
 * @constructor
 */
function YikeShop(url) {
    this.url = url;
}

YikeShop.prototype = {
    constructor: YikeShop,
    /**
     * 基础查询函数
     * @param action
     * @returns {AV.Promise}
     */
    query: function(action, payload) {
        var self = this;
        var promise = new AV.Promise();
        payload = payload || {};
        payload.token = TOKEN;
        var req = {
            'url': self.url + action,
            'data': payload,
            'dataType': 'json'
        };

        $.ajax({
            'url': req.url,
            'data': req.data,
            'type' : 'post',
            'beforeSend': function(xhr) { xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')},
             success:function(data){
                if (data.code != 1) {
                    if (data.msg) {
                        //toast(data.msg);
                    }
                    // if (data.code == -1) {
                    //     location.href = '#/login';
                    // }
                    promise.reject(data);
                } else if(data.code==1) {
                    promise.resolve(data);
                }else{
                    promise.reject(data);
                }
            },
            error: function(i, data){
               // toast('服务信息出错!');
                promise.reject(data);
            }
        });

        return promise;
    }
};

var yikeShop = new YikeShop(API_URL);
