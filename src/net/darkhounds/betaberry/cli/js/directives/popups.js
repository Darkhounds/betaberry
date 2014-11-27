angular.module('betaberry.darkhounds.net').directive('popups', [function()      {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/popups.html',
        controller:     ['$scope', "$element", 'serviceMessages', function($scope, $element, serviceMessages) {
            $scope.message = null;
            
            serviceMessages.$on("changed", function(){
                _next();
                $scope.$apply();
            });
            
            $scope.close    = function()                                        {
                serviceMessages.remove($scope.message);
                _next();
            };
            
            var _tween = null;
            function _next()                                                    {
                var msg     = serviceMessages.getNext();
                _tween      = TweenMax.to($element, 0.2, {autoAlpha:msg?1:0, ease:Linear.easeNone});
                $scope.message = msg || $scope.message; 
            }
        }]
    };
}]);
