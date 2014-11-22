angular.module('betaberry.darkhounds.net').factory('serviceGame', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();

        var _bet            = null;
        var _slots          = null;
        var _closed         = true;
        serviceAPI.$on('betted', function(data)                                 {
            _bet            = data;
            _closed         = !_bet;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function(data)                                 {
            _closed = !_bet || data.closed;
            _slots  = data.slots;
            service.$broadcast('changed');
        });
        
        service.bet         = function(amount, level, callback)                 {
            serviceAPI.bet(amount, level, callback);
            return service;
        };
        
        service.play        = function(cell, callback)                          {
            serviceAPI.play(cell, callback);
            return service;
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
        service.getClosed    = function()                                       {
            return _closed;
        };
        
        return service;
    }
]);
