'use strict';

// Define the `showPollController` controller on the `showPoll` module
angular
    .module('showPoll')
    .component('showPoll', {
        templateUrl: '/show-poll/show-poll.template.html',
        controller: function showPollController(Auth, $routeParams, $http) {

            this.poll = {};
            // Store the index of the selected option
            this.selection = undefined;

            // Get the poll to show from the database
            $http.get(`/api/polls/${$routeParams.id}`).then(res => {
                this.poll = res.data;
            });

            // use Auth.isLoggedIn() to determine if user is logged in
            this.isLoggedIn = function() {
                return Auth.isLoggedIn();
            }

            // Increment score value on the selected poll option
            // and update it in the database
            this.submitPoll = () => {
            if (this.selection != undefined) {
                    const index = this.selection;
                    const option = this.poll.options[index];
                    const id = option._id;
                    option.score += 1;

                    $http.put(`/polls/${id}`, option).then(res => {
                        console.log(res.data);
                    });
                }
            };
        }
    });