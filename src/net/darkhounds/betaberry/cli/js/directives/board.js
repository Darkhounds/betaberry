angular.module('betaberry.darkhounds.net').directive('board', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/board.html',
        controller:     ['$scope', 'serviceSession', 'serviceGame', function($scope, serviceSession, serviceGame) {
            $scope.rows = [];
            
            _resetRows();
            
            function _resetRows(slots)                                          {
                for (var i = 0; i < 6; i++)                                     {
                    if (!$scope.rows[i]) $scope.rows[i] = [];
                    for (var j = 0; j < 6; j++)                                 {
                        if ($scope.rows[i][j]) $scope.rows[i][j].token = '';
                        else $scope.rows[i][j] = {row: i, col:j, token: ''};
                    }
                }
                //
                for (var k in slots) $scope.rows[slots[k][0]][slots[k][1]].token = slots[k][3];
            }

            $scope.isLogged     = serviceSession.isOpen();
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged = serviceSession.isOpen();
                $scope.$apply();
            });

            $scope.hasBetted     = !!serviceGame.getBet();

            serviceGame.$on('changed', function()                               {
                $scope.hasBetted = !!serviceGame.getBet();
                $scope.$apply();
            });
            
            serviceGame.$on('changed', function()                               {
                _resetRows(serviceGame.getSlots());
                $scope.$apply();
            });
            
            $scope.bet    = function()                                          {
                serviceGame.bet($scope.amount, $scope.level);
            };

            $scope.play   = function(row, col)                                  {
                serviceGame.play([row, col]);
            };
        }]
    };
}]);
