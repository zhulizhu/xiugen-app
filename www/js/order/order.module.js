(function () {
    'use strict';

    angular
        .module('order.module', [
            'order.cart.controller',
            'submit.order.controller',
            'order.list.controller',
            'order.top.up.controller',
            'order.top.sure.controller',
            'delivery.count.controller',
            'delivery.send.controller',
            'refund.details',
            'refund-reason',
            'refund.list',
            'refund.details',
            'go.submit.controller',
            'cart.address.controller',
            'cart.add.address.controller',
            'cart.address.pick.controller',
            'package.pay.controller',
            'ticket.pay.controller'
        ]);
})();
