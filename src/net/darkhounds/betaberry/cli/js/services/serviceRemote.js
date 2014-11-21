angular.module('betaberry.darkhounds.net').factory('serviceRemote', ['observable',
    function(observable)                                                        {
        var service         = {};

        var _sessionMockup  = null;
        service.login       = function(email, password, callback)               {
            // TODO: Do the actual http request to the server API
            //
            var request            = observable.create({response:{data: null, error: null}});
            if (_sessionMockup) request.response.error = {code:'sessionNotClosed', msg:'Session Not Closed!'};
            else                                                                {
                _sessionMockup          = 
                request.response.data   = {name: "Jhon", lastName:"Doe", credits:1000};
            }
            //
            if (callback && typeof callback === "function") callback(request.response);
            request.$broadcast('resolved', request.response);
            //
            return request;
        };
        
//        function validateEmail (email)                                          {
//            var pattern  = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//            return pattern.test(email);
//        };
//      
//        function validatePassword (password)                                    {
//            return password.length > 6;
//        };
        
        service.logout      = function(callback)                                {
            // TODO: Do the actual http request to the server API
            //
            var request            = observable.create({response:{data: null, error: null}});
            if (!_sessionMockup) request.response.error  = {code:'sessionNotOpened', msg:'Session Not Opened!'};
            else                                                                {
                _sessionMockup          = null;
                request.response.data   = {};
            }
            //
            if (callback && typeof callback === "function") callback(request.response);
            request.$broadcast('resolved', request.response);
            //
            return request;
        };
        
        var _betMockup      = null;
        var _puzzleMockup   = null;
        service.bet         = function(amount, level, callback)                 {
            // TODO: Do an actual server API request

            var request            = observable.create({response:{data: null, error: null}});
            if (!_sessionMockup) request.response.error = {code: "sessionClosed", msg: "Session Closed!"};
            else if (_betMockup) request.response.error = {code: "betOpened", msg: "Bet Already Opened!"};
            else if (_sessionMockup.credits < amount) request.response.error = {code: "betToHigh", msg: "Bet is To High"};
            else if (level < 1 || level > 4) request.response.error = {code: "betInvalidLevel", msg: "Bet has an invalid level"};
            else                                                                {
                _puzzleMockup           = _createPuzzle();
                _betMockup              =
                request.response.data   = {amount: amount, level: level};
            }
            
            if (callback && typeof callback === "function") callback(request.response);
            request.$broadcast('resolved', request.response);
            
            return request;
        };

        function _createPuzzle()                                                {
            return null;
        }
        
        
        return service;
    }
]);
