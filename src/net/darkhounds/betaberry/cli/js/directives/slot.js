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
            
            $scope.play    = function()                                         {
                serviceGame.play([$scope.item.row, $scope.item.col])
            };
            
            $scope.$watch("item", function()                                    {
                $scope.state    = _switchState($scope.item);
                $scope.selected = $scope.item?$scope.item.selected:false;
            }, true);
            
            function _switchState (item)                                        {
                if (!item || item.hidden) return 'hidden';
                return item.token?item.token:'empty';
            }
        }]
    };
}]);
