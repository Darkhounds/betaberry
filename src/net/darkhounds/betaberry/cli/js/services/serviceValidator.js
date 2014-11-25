angular.module('betaberry.darkhounds.net').factory('serviceValidator', ['observable',
    function(observable)                                                        {
        var service             = observable.create();
    
        service.checkEmail      = function(email)                               {
            var pattern  = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return pattern.test(email);
        };
    
        service.checkPassword   = function(password)                            {
            return password.length > 6;
        };
    
        return service;
    }
]);
