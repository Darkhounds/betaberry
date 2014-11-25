angular.module('betaberry.darkhounds.net').directive('popups', [function()      {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/popups.html',
        controller:     ['$scope', 'serviceMessages', function($scope, serviceMessages) {
            $scope.message = null;
            
            serviceMessages.$on("changed", function(){
                _next();
                $scope.$apply();
            });
            
            $scope.close    = function()                                        {
                serviceMessages.remove($scope.message);
                $scope.message = null;
                _next();
            };
            
            function _next()                                                    {
                $scope.message = $scope.message || serviceMessages.getNext();
                console.log($scope.message);
            }
        }]
    };
}]);
