angular.module('app').controller("SettingController", ['$scope', '$http', 'rx', 'observeOnScope', function($scope, $http, rx, observeOnScope) {
  var isSending = false;
  $scope.color = {
    red:   255,
    green: 0,
    blue:  0
  };

  observeOnScope($scope, 'color', true)
    .map(function(change) { return change.newValue })
    .filter(function(color) { console.log(color); return !angular.isUndefined(color); })
    .filter(function(color) { console.log(color); return !isSending })
    .flatMap(function(color) {
      isSending = true;
      return rx.Observable.fromPromise($http({
        url: '/api/v1/color?red=' + color.red + '&green=' + color.green + '&blue=' + color.blue,
        method: "get"
      }));
    })
    .subscribe(function(response) {
      isSending = false;
    });
}]);