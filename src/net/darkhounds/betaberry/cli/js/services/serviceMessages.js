angular.module('betaberry.darkhounds.net').factory('serviceMessages', ['observable',
    function(observable)                                                        {
        var service     = observable.create();
        
        var _messages   = [];
        
        service.add     = function(type, text, callback)                        {
            var message = {type: type, text: text, end: callback, callback: function ()  {
                service.remove(message, arguments);
            }};
            _messages.push(message);
            this.$broadcast("changed", message);
        };

        service.getNext     = function()                                        {
            return _messages.length?_messages[0]:null;
        };

        service.getCount    = function()                                        {
            return _messages.length;
        };

        service.remove  = function(message, args)                               {
            var id      = _messages.indexOf(message); if (id < 0) return;
            if (typeof message.end === "function") message.end.apply(this, args)
            _messages.splice(id, 1);
        };
        
        return service;
    }
]);
