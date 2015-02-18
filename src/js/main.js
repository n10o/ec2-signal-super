angular.module('signal')
    .controller('MainCtrl', function (instanceCtrl, authCtrl, $scope) {
        $scope.title = "Main Page";
        $scope.showLoading = true;

        $scope.clickRow = function (id) {
            console.log(id);
            instanceCtrl.start(id)
                .success(function (data) {
                    console.log("success");
                    console.log(data);
                    // Print alert success
                })
                .error(function (data, status) {
                    console.log("auth error");
                    //console.log(data); //Unauthorized
                    console.log(status); // 401
                    // Print alert Unauthorized
                });
        };

        $scope.listInstance = function () {
            $scope.showLoading = true;
            instanceCtrl.list().then(function (res) {
                $scope.instanceList = res.data.InstanceDescriptions;
                $scope.showLoading = false;
            });
        };

        $scope.listInstance();
    });
