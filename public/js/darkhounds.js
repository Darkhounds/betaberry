'use strict';

angular.module('core.darkhounds.net', []);

angular.module('core.darkhounds.net').factory('observable', ['$timeout', function($timeout) {
    return {
        create: function(object)                                                {
            var $observable         = object || {}; 
            $observable._listeners  = {};
            $observable.$on         = function(type, callback)                  {
                if (typeof type != "string" || typeof callback != "function") return -1;
                if (!$observable._listeners[type]) $observable._listeners[type] = [];
                $observable._listeners[type].push(callback);

                return function()                                               {
                    if (!$observable._listeners[type]) return;
                    var index       = $observable._listeners[type].indexOf(callback);
                    if (index >= 0 && index < $observable._listeners[type].length) $observable._listeners[type].splice(index, 1);
                    if (!$observable._listeners[type].length) delete $observable._listeners[type];
                };
            };
            
            $observable.$broadcast = function(type)                             {
                var args    = [];
                if (arguments && arguments.length > 1) for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                setTimeout(function()                                           {
                    if ($observable._listeners[type])                           {
                        for (var id in $observable._listeners[type])
                            $observable._listeners[type][id].apply($observable, args);
                    }
                }, 0);
            };
            return $observable;
        }
    };
}]);
