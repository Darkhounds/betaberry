angular.module('betaberry.darkhounds.net').factory('serviceGame', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();

        var _bet            = null;
        var _slots          = null;
        serviceAPI.$on('betted', function(data)                                 {
            _bet = data;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function()                                     {
            _slots = null;
            service.$broadcast('changed');
        });
        
        service.bet         = function(amount, level, callback)                 {
            serviceAPI.bet(amount, level, callback);
        };

        service.getBet      = function()                                        {
            return _bet;
        };
        service.getBetAmount      = function()                                  {
            return _bet?_bet.amount:0;
        };
        service.getBetLevel      = function()                                   {
            return _bet?_bet.level:1;
        };
        service.getSlots    = function()                                        {
            return _slots;
        };
        
        return service;
    }
]);
