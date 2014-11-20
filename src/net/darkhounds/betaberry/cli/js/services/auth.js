angular.module('betaberry.darkhounds.net').factory('auth', ['observable',
    function(observable)                                                        {
        var service         = observable.create();
        
        
        
        
        service.login   = function(email, password)                             {
            //
            var validEmail      = validateEmail(email);
            var validPassword   = validatePassword(password);
            if (!validEmail)    service.$broadcast('auth.error.email', {code: "EmailBadFormat", msg:"Email format is invalid"});
            if (!validPassword) service.$broadcast('auth.error.password', {code: "PasswordBadFormat", msg:"Password format is invalid"});
            if (validEmail && validPassword) service.$broadcast('auth.login', {name: "Jhon", lastName:"Doe", credits:1000});
            //
            return service; 
        };

        function validateEmail (email)                                          {
            var pattern  = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return pattern.test(email);
        };

        function validatePassword (password)                                    {
            return password.length > 6;
        };

        return service;
    }
]);
