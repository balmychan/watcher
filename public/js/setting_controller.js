angular.module('app').controller("SettingController", ['$scope', '$http', function($scope, $http) {
  var isSending = false;
  $scope.color = {
    red:   255,
    green: 0,
    blue:  0
  };
  $scope.$watch("color", function(color) {
    if (angular.isUndefined(color)) return;
    if (isSending) return;
    var url = '/api/v1/color?red=' + color.red + '&green=' + color.green + '&blue=' + color.blue;
    $http.get(url).then(function() {
      isSending = false;
    }, function() {
      isSending = false;
    });
  }, true);
}]);