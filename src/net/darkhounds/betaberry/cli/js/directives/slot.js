angular.module('betaberry.darkhounds.net').directive('slot', [function()     {
    return {
        scope:      {
            item: "="
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/slot.html',
        controller:     ['$scope', 'serviceGame', function($scope, serviceGame) {
            $scope.play    = function()                                         {
                console.log($scope.item.row, $scope.item.col);
                serviceGame.play([$scope.item.row, $scope.item.col])
            };
        }]
    };
}]);
