'use strict';

// Define the votingApp module
const votingApp = angular.module('votingApp', []);

// Define the `votingAppController` controller on the `votingApp` module
votingApp.controller('votingAppController', ['$scope', '$http', ($scope, $http) => {

    $scope.poll = {
        name:
        option1:
        option2:
    };

    $scope.createPoll = () => {
        console.log($scope.poll)
    };

    $http.get('/').then(res => {
        console.log('I got the data I requested');
    });
}]);