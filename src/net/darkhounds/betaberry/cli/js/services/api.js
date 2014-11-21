angular.module('betaberry.darkhounds.net').factory('api', ['observable',
    function(observable)                                                        {
        var service         = observable.create();
        
        var session         = null;
        service.login       = function(email, password, callback)               {
            // TODO: Do the actual http request to the server API
            //
            var response            = null;
            if (session) response   = {error:{code:'sessionNotClosed', msg:'Session Not Closed!'}};
            else                                                                {
                session             =
                response            = {name: "Jhon", lastName:"Doe", credits:1000};
            }
            //
            if (callback && typeof callback === "function") callback(response);
            service.$broadcast('api.login', response);
            //
            return service; 
        };
        service.logout      = function(callback)                                {
            // TODO: Do the actual http request to the server API
            //
            var response            = null;
            if (!session) response  = {error:{code:'sessionNotOpened', msg:'Session Not Opened!'}};
            else                                                                {
                session             = null;
                response            = {};
            }
            //
            if (callback && typeof callback === "function") callback(response);
            service.$broadcast('api.logout', response);
            //
            return service;
        };
        service.getName     = function()                                        {
            if (!session) return "";
            var name    = "";
            if (session.name)       name += session.name;
            if (session.lastName)   name += (name?" ":"") + session.lastName;
            return name;
        };
        service.getCredits  = function()                                        {
            return session?session.credits:0;
        };

        var bet             = null;
        var _puzzle         = null;
        service.bet         = function(amount, level, callback)                  {
            // TODO: Do an actual server API request
            
            var response            = null;
            if (!session) response  = {error: {code: "sessionClosed", msg: "Session Closed!"}};
            else if (bet) response  = {error: {code: "betOpened", msg: "Bet Already Opened!"}};
            else if (session.credits < amount) response = {error: {code: "betToHigh", msg: "Bet is To High"}};
            else if (level < 1 || level > 4) response = {error: {code: "betInvalidLevel", msg: "Bet has an invalid level"}};
            else                                                                {
                bet      =
                response = {amount: amount, level: level};
                _puzzle = _createPuzzle();
            }
            
            if (callback && typeof callback === "function") callback(response);
            service.$broadcast('api.bet', response);
        };
        
        function _createPuzzle()                                                {
            return null;
        }
        


//        function validateEmail (email)                                          {
//            var pattern  = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//            return pattern.test(email);
//        };
//        
//        function validatePassword (password)                                    {
//            return password.length > 6;
//        };
        
        return service;
    }
]);
