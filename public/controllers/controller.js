'use strict';

const myApp = angular.module('myApp', []);
myApp.controller('appcontrol', ['$scope', '$http', ($scope, $http) => {

    $http.get('/').then(res => {
        console.log('I got the data I requested');
    });
}]);