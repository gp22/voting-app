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

    // send poll data to server.js
    $scope.createPoll = () => {
        const poll = $scope.poll;
        const options = poll.options;
        const length = poll.options.length;
        console.log(poll);

        // remove the last additional option if it was left blank
        if (length > 2 && poll.options[length-1].choice === '') {
            poll.options.pop();
        }

        // send poll to server.js if no fields were left empty
        if (poll.name != '' &&
            options[0].choice != '' &&
            options[1].choice != '') {
            $http.post('/', poll).then(res => {
                console.log(res.data._id);

                /*
                create a response with the url for the new poll
                format: polls/id
                */
            });
        }
    };

    // add another option input field to poll creation form
    $scope.addOption = () => {
        const options = $scope.poll.options;
        const length = options.length;
        // console.log(options[length-1].choice);

        // add another option if the last object in the array is not empty
        if (options[length-1].choice !== '') {
            options.push({ choice: '', score: 0 });
        }
    };
}]);