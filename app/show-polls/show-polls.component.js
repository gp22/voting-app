'use strict';

// Define the `showPollsController` controller on the `showPolls` module
angular
    .module('showPolls')
    .component('showPolls', {
        templateUrl: '/show-polls/show-polls.template.html',
        controller: function showPollsController($routeParams, $http) {

            this.polls = {};

            // Get the poll to show from the database
            $http.get('/api/polls').then(res => {
                this.polls = res.data;
            });
        }
    });