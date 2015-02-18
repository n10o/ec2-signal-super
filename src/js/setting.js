angular.module('signal')
    .controller('SettingCtrl', function (UserData,$scope) {
        $scope.title = "Setting Page";
        $scope.username = UserData.Name;
    });
