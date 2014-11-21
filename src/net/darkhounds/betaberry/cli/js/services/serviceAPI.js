angular.module('betaberry.darkhounds.net').factory('serviceAPI', ['observable', 'serviceRemote',
    function(observable, serviceRemote)                                         {
        var service         = observable.create();
        
        service.login       = function(email, password, callback)               {
            var request = serviceRemote.login(email, password);
            request.$on('resolved', function(response)                          {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedin', response.data);
            });
            //
            return service; 
        };
        
        service.logout      = function(callback)                                {
            var request = serviceRemote.logout();
            request.$on('resolved', function(response)                          {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedout', response.data);
            });
            //
            return service;
        };
        
        service.bet         = function(amount, level, callback)                 {
            var request = serviceRemote.bet(amount, level);
            request.$on('resolved', function(response)                          {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedout', response.data);
            });
            //
            return service;
        };
        
//        service.getName     = function()                                        {
//            if (!session) return "";
//            var name    = "";
//            if (session.name)       name += session.name;
//            if (session.lastName)   name += (name?" ":"") + session.lastName;
//            return name;
//        };
//        service.getCredits  = function()                                        {
//            return session?session.credits:0;
//        };
        return service;
    }
]);
