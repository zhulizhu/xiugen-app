/**
 * Created by frank on 2016/9/5.
 */
(function () {
    'use strict';

    angular
        .module('user.module', ['user.register.controller','user.verification.email.controller','user.login.controller','user.scheme.controller','user.modification.password.controller',
        'user.reset.password.controller','user.recharge.controller','user.bind.phone.controller','user.linked.phone.controller','user.add.address.controller','user.consignee.controller',
         'user.verify.controller','user.forget.controller','user.mycode.controller', 'user.modify.address.controller','user.mypackage.controller','user.mylike.controller','user.myhobby.controller',
         'user.integral.controller','user.myinfo.controller','user.mylevel.controller','user.reset.username.controller','user.ticket.controller','user.reset.phone.controller']);
}());
