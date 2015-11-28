var app = angular.module("app", [
  'ngMaterial',
  'ui.router'
]);

app.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('watch', {
      url: "/watch",
      templateUrl: "/view/watch.html",
      controller: "WatchController"
    })
    .state('setting', {
      url: "/setting",
      templateUrl: "/view/setting.html",
      controller: "SettingController"
    });
}]);