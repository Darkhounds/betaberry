angular.module('betaberry.darkhounds.net').factory('serviceAPI', ['observable', 'serviceRemote', 'serviceMessages',
    function(observable, serviceRemote, serviceMessages)                        {
        var service         = observable.create();
        
        service.login       = function(email, password, callback)               {
            var request     = serviceRemote.login(email, password, function(response){
                if (callback && typeof callback === "function") callback(response);
                if (response.error) serviceMessages.add('error', response.error.msg);
                else service.$broadcast('logedin', response.data);
            });
            //
            return service; 
        };
        
        service.logout      = function(callback)                                {
            var request     = serviceRemote.logout(function(response)           {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedout', response.data);
            });
            //
            return service;
        };
        
        service.bet         = function(amount, level, callback)                 {
            var request     = serviceRemote.bet(amount, level, function(response) {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('betted', response.data);
            });
            //
            return service;
        };

        service.play        = function(cell, callback)                          {
            var request     = serviceRemote.play(cell, function(response)       {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('played', response.data);
            });
            //
            return service;
        };
        
        return service;
    }
]);
