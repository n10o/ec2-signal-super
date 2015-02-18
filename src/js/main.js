angular.module('signal')
    .controller('MainCtrl', function (instanceCtrl, authCtrl, $scope, $timeout) {
        $scope.title = "Main Page";
        $scope.showLoading = true;
        $scope.alerts = [];
        $scope.radioModal = "dev";

        $scope.clickRow = function (id) {
            console.log(id);
            instanceCtrl.start(id)
                .success(function (data) {
                    console.log("success");
                    console.log(data);
                    // Print alert success
                })
                .error(function (data, status) {
                    //console.log(data); //Unauthorized
                    console.log(status); // 401
                    $scope.addAlert(data + ":" + status + " Please login.", 'danger');
                });
        };

        $scope.listInstance = function () {
            $scope.showLoading = true;
            instanceCtrl.list().then(function (res) {
                $scope.instanceList = res.data.InstanceDescriptions;
                $scope.showLoading = false;
            });
        };

        $scope.addAlert = function (msg, type) {
            $scope.alerts.push({type: type, msg: msg});
            $timeout(function () {
                $scope.closeAlert(0);
            }, 3000);
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.listInstance();
    });
