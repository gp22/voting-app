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
                // console.log(this.polls);
            });

            // Increment score value on the selected poll option
            // and update it in the database
            // this.submitPoll = () => {
            // if (this.selection != undefined) {
            //         const index = this.selection;
            //         const option = this.poll.options[index];
            //         const id = option._id;
            //         option.score += 1;

            //         $http.put(`/polls/${id}`, option).then(res => {
            //             console.log(res.data);
            //         });
            //     }
            // };
        }
    });