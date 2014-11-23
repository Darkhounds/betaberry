angular.module('betaberry.darkhounds.net').directive('board', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/board.html',
        controller:     ['$scope', 'serviceSession', 'serviceGame', function($scope, serviceSession, serviceGame) {
            $scope.amount       = 10;
            $scope.isLogged     = serviceSession.isOpen();
            $scope.hasBetted    = serviceGame.hasBetted();
            $scope.isOver       = serviceGame.isClosed();
            $scope.gain         = serviceGame.getGain();
            $scope.rows         = [];
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged     = serviceSession.isOpen();
                $scope.hasBetted    = false;
                $scope.isOver       = false;
                $scope.gain         = 0;
                $scope.$apply();
            });

            serviceGame.$on('changed', function()                               {
                $scope.hasBetted    = serviceGame.hasBetted();
                $scope.isOver       = serviceGame.isClosed();
                $scope.gain         = serviceGame.getGain();
                
                _updateRows($scope.rows, serviceGame.getSlots(), serviceGame.getPuzzle());
                $scope.$apply();
            });
            
            $scope.bet    = function(amount, level)                             {
                serviceGame.bet(amount, level);
            };

            $scope.play   = function(row, col)                                  {
                serviceGame.play([row, col]);
            };
            //
            function _updateRows(rows, slots, puzzle)                           {
                // Create the slots or mark them by default as hidden and hide
                // their token
                for (var i = 0; i < 5; i++)                                     {
                    if (!rows[i]) rows[i] = [];
                    for (var j = 0; j < 5; j++)                                 {
                        if (rows[i][j])                                         {
                            rows[i][j].hidden    = true;
                            rows[i][j].selected  = false;
                            rows[i][j].token     = '';
                        } else rows[i][j] = {row: i, col:j, hidden:true, selected: false, token: ''};
                    }
                }
                //
                // If a selection of slots has been made then then select them,
                // mark them as visible and disclose their token
                for (var k in slots)                                            {
                    var slot        = rows[slots[k][0]][slots[k][1]];
                    slot.token      = slots[k][2];
                    slot.danger     = slots[k][3];
                    slot.hidden     = false;
                    slot.selected   = true;
                }
                //
                // If the puzzle has been disclosed then mark all the slots as
                // visible and show their token
                for (var k in puzzle)                                           {
                    var slot        = rows[puzzle[k][0]][puzzle[k][1]];
                    slot.token      = puzzle[k][2];
                    slot.hidden     = false;
                }
                //
            }
            _updateRows($scope.rows);
        }]
    };
}]);
