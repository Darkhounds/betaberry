angular.module('betaberry.darkhounds.net').factory('serviceSession', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();
        
        var _session        = null;
        serviceAPI.$on('logedin', function(data)                                {
            _session = data;
            service.$broadcast('changed');
        });
        serviceAPI.$on('logedout', function()                                   {
            _session = null;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function(data)                                 {
            if (!_session) retun;
            _session.credits = data.credits;
            service.$broadcast('changed');
        });
        
        service.login       = function(email, password, callback)               {
            serviceAPI.login(email, password, callback);
            return service;
        };
        
        service.logout      = function(callback)                                {
            serviceAPI.logout(callback);
            return service;
        };
        
        service.getName     = function()                                        {
            if (!_session) return "";
            var name    = "";
            if (_session.name)       name += _session.name;
            if (_session.lastName)   name += (name?" ":"") + _session.lastName;
            return name;
        };
        service.getCredits  = function()                                        {
            return _session?_session.credits:0;
        };
        
        return service;
    }
]);
