angular.module('betaberry.darkhounds.net').directive('profile', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/profile.html',
        controller:     ['$scope', 'serviceSession', 'serviceGame', 'serviceMessages', function($scope, serviceSession, serviceGame, serviceMessages) {
            $scope.isLogged     = serviceSession.isOpen();
            $scope.username     = "test@test.com";
            $scope.password     = "1234567";
            $scope.name         = "";
            $scope.name         = "";
            $scope.credits      = serviceSession.getCredits();
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged = serviceSession.isOpen();
                $scope.name     = serviceSession.getName();
                // $scope.credits  = (serviceGame.hasBetted() && serviceGame.isClosed())?serviceSession.getCredits():$scope.credits;
                $scope.credits  = (!serviceGame.hasBetted() || serviceGame.isClosed())?serviceSession.getCredits():$scope.credits;
                $scope.$apply();
            });
            
            $scope.login    = function()                                        {
                serviceSession.login($scope.username, $scope.password)
            };

            $scope.logout   = function()                                        {
                serviceSession.logout()
            };

            $scope.help     = function()                                        {
                serviceMessages.add('help');
            };

        }]
    };
}]);
