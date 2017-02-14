'use strict';

// Define the `votingAppController` controller on the `votingApp` module
angular.
    module('votingApp').
    component('newPollForm', {
        template:
            '<div class="container">' +
                '<div class="row col-lg-6 col-lg-offset-3 text-center">' +
                    '<h1>New Poll</h1>' +
                        '<div class="form-group">' +
                            '<input class="form-control" type="text" placeholder="Poll Name" ng-model="$ctrl.poll.name">' +
                        '</div>' +
                    '<hr>' +
                    '<h3>Options</h3>' +
                    '<div ng-repeat="option in $ctrl.poll.options">' +
                        '<div class="form-group">' +
                            '<input class="form-control" type="text" placeholder="Option" ng-model="option.choice">' +
                        '</div>' +
                    '</div>' +
                        '<div class="form-group">' +
                            '<button class="btn btn-primary btn-block" ng-click="$ctrl.addOption()">Add Option</button>' +
                        '</div>' +
                    '<div class="form-group">' +
                        '<button class="btn btn-success btn-block" ng-click="createPoll()">Create Poll</button>' +
                    '</div>' +
                '</div>' +
            '</div>',
        controller: function newPollFormController($http) {

            this.poll = {
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
            this.createPoll = () => {
                // const poll = $scope.poll;
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
            this.addOption = () => {
                const options = this.poll.options;
                const length = options.length;
                // console.log(options[length-1].choice);

                // add an option if the last object in the array is not empty
                if (options[length-1].choice !== '') {
                    options.push({ choice: '', score: 0 });
                }
            };
        }
    });