angular.module('betaberry.darkhounds.net').factory('serviceGame', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();

        var _bet                = null;
        service.hasBetted       = function()                                    {
            return !!_bet;
        };
        service.getBet          = function()                                    {
            return _bet;
        };
        service.getBetAmount    = function()                                    {
            return _bet?_bet.amount:0;
        };
        service.getBetLevel     = function()                                    {
            return _bet?_bet.level:1;
        };
        
        var _slots              = null;
        service.getSlots        = function()                                    {
            return _slots || [];
        };
        
        var _closed             = true;
        service.isClosed        = function()                                    {
            return _closed;
        };

        var _puzzle             = null;
        service.getPuzzle       = function()                                    {
            return _puzzle || [];
        };

        var _gain               = 0;
        service.getGain         = function()                                    {
            return _gain || [];
        };

        serviceAPI.$on('logedin', function(data)                                {
            _bet            = null;
            _closed         = false;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('logedout', function()                                   {
            _bet            = null;
            _closed         = false;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('betted', function(data)                                 {
            _bet            = data;
            _closed         = !_bet;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function(data)                                 {
            _closed         = !_bet || data.closed;
            _puzzle         = data.puzzle || [];
            _slots          = data.slots || [];
            _gain           = data.gain || 0;
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
        
        return service;
    }
]);
