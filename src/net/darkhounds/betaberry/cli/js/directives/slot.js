angular.module('betaberry.darkhounds.net').directive('slot', [function()     {
    return {
        scope:      {
            item: "="
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/slot.html',
        controller:     ['$scope', 'serviceGame', function($scope, serviceGame) {
            $scope.state    = "hidden";
            $scope.selected = false;
            $scope.danger   = 0;
            
            $scope.play    = function()                                         {
                if ($scope.item.selected) return;
                serviceGame.play([$scope.item.row, $scope.item.col])
            };
            
            $scope.$watch("item", function()                                    {
                $scope.state    = _switchState($scope.item);
                $scope.selected = $scope.item?$scope.item.selected:false;
                $scope.danger   = ($scope.item && $scope.item.danger)?(Math.round(($scope.item.danger/8) * 100)):0;
            }, true);
            
            function _switchState (item)                                        {
                if (!item || item.hidden) return 'hidden';
                return item.token?item.token:'empty';
            }
        }]
    };
}]);
