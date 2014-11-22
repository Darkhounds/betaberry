angular.module('betaberry.darkhounds.net').directive('profile', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/profile.html',
        controller:     ['$scope', 'serviceSession', function($scope, serviceSession) {
            $scope.isLogged     = serviceSession.isOpen();
            $scope.name         = "";
            $scope.credits      = serviceSession.isOpen();
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged = serviceSession.isOpen();
                $scope.name     = serviceSession.getName();
                $scope.credits  = serviceSession.getCredits();
                $scope.$apply();
            });
            
            $scope.login    = function()                                        {
                serviceSession.login($scope.username, $scope.password)
            };

            $scope.logout   = function()                                        {
                serviceSession.logout()
            };
            
        }]
    };
}]);
