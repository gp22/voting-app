'use strict';

// Define the votingApp module
const votingApp = angular.module('votingApp', []);

// Define the `votingAppController` controller on the `votingApp` module
votingApp.controller('votingAppController', ['$scope', '$http', ($scope, $http) => {

    $scope.poll = {
        name: '',
        options: [
            {
                choice: '',
                score: 0
            },
            {
                choice: '',
                score: 0
            }
        ]
    };

    $scope.createPoll = () => {
        console.log($scope.poll);
        $http.post('/', $scope.poll).then(res => {
            console.log(res.data);
        });
    };

    $scope.addOption = () => {
        const length = $scope.poll.options.length;
        console.log($scope.poll.options[length-1].choice);

        // add another option if the last object in the array is not empty
        if ($scope.poll.options[length-1].choice !== '') {
            $scope.poll.options.push({ choice: '', score: 0 });
        }
    };

    // $http.get('/').then(res => {
    //     console.log('I got the data I requested');
    // });
}]);