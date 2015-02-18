'use strict';

angular.module('signal', ['ui.router'])
    .value('host', 'http://localhost:3000/')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        // pushState enable(need setting server rewrite)
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html'
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'views/setting.html'
            });
    })
    .factory('instanceCtrl', function ($http,host) {
        return {
            list: function () {
                return $http.get(host + 'instance');
            },
            start: function (id) {
                console.log("START:" + id);
                //return $http.get(host + 'instance/start/' + id);
                return $http.get(host + 'instance/test2');
            },
            stop: function (id) {
                console.log("STOP:" + id);
                return $http.get(host + 'instance/stop/' + id);
            }
        }
    })
    .factory('authCtrl', function ($http, $q, $timeout, host) {
        return {
            isloggedin: function () {
                // var deferred = $q.defer();
                return $http.get(host + 'auth/loggedin');
            },
            logout: function(){
                return $http.get(host + 'auth/logout');
            }
        }
    })
    .factory('UserData', function(){
        return { Name: ''};
    })
    .controller('common', function (authCtrl,UserData, $scope,$location,$state) {
        $scope.logout = function(){
            authCtrl.logout().then(function(res){
                UserData.Name = "";
                $scope.username = "";
                $state.go($state.current, {}, {reload: true});
            });
        };
        // TODO これは全jsで使うので共通化(fatory?
        $scope.isloggedin = function(){
            authCtrl.isloggedin().then(function(res){
                //console.table(res);
                // TODO 直接FBのデータを使わず、システム内のDBから引く
                UserData.Name = res.data.displayName;
                $scope.username = UserData.Name;
            });
        };
        $scope.isloggedin();
    });
