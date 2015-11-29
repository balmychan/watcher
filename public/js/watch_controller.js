angular.module('app').controller("WatchController", ['$scope', '$http', 'rx', function($scope, $http, rx) {
  $scope.state = {
    isWatching: false,
    isAlert: false
  };
  var conn;

  getHistories();

  function getHistories() {
    return rx.Observable
      .fromPromise($http({
        url: '/api/v1/alert_histories',
        method: "get"
      }))
      .map(function(response) { return response.data; })
      .subscribe(function(items) {
        $scope.histories = items;
      });
  }

  $scope.$watch("state.isWatching", function(isWatching) {
    if (angular.isUndefined(isWatching)) return;
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
          $scope.state.isAlert = data.isAlert;
          getHistories();
        });
      };
    }
  });
}]);