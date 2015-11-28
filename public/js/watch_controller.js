angular.module('app').controller("WatchController", ['$scope', '$http', function($scope, $http) {
  $scope.state = {
    isWatching: false,
    isAlert: false
  };
  var conn;
  $scope.$watch("state.isWatching", function(isWatching) {
    if (angular.isUndefined(isWatching)) return;
    console.log("isWatching change" + isWatching);
    if (isWatching) {
      if (conn) return;
      conn = new WebSocket('ws://localhost:8888');
      conn.onopen = function () {
        console.log('WebSocket opened!!');
      };
      conn.onerror = function (error) {
        console.log('WebSocket error' + error);
      };
      conn.onmessage = function (e) {
        $scope.$apply(function() {
          var data = JSON.parse(e.data);
          console.log('receive message' + data);
          $scope.state.isAlert = data.isAlert;
        });
      };
    }
  });
}]);