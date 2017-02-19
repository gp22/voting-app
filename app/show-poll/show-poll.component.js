'use strict';

// Define the `votingAppController` controller on the `votingApp` module
angular.
    module('showPoll').
    component('showPoll', {
        templateUrl: '/show-poll/show-poll.template.html',
        controller: function showPollController($routeParams, $http) {

            this.poll = {};

            $http.get(`/api/polls/${$routeParams.id}`).then(res => {
                this.poll = res.data;
                console.log(this.poll);
            });


        //     this.poll = {
        //         name: { name: '' },
        //         options: [
        //             {
        //                 name: '',
        //                 score: 0
        //             },
        //             {
        //                 name: '',
        //                 score: 0
        //             }
        //         ]
        //     };

        //     // send poll data to server.js
        //     this.createPoll = () => {
        //         const poll = this.poll;
        //         const options = poll.options;
        //         const length = options.length;

        //         // remove the last additional option if it was left blank
        //         if (length > 2 && poll.options[length-1].name === '') {
        //             poll.options.pop();
        //         }

        //         // send poll to server.js if no fields were left empty
        //         if (poll.name.name != '' &&
        //             options[0].name != '' &&
        //             options[1].name != '') {
        //             $http.post('/polls', poll).then(res => {
        //                 console.log(res.data);

        //                 /*
        //                 create a response with the url for the new poll
        //                 format: polls/id
        //                 */
        //             });
        //         }
        //     };

        //     // add another option input field to poll creation form
        //     this.addOption = () => {
        //         const options = this.poll.options;
        //         const length = options.length;

        //         // add an option if the last object in the array is not empty
        //         if (options[length-1].name !== '') {
        //             options.push({ name: '', score: 0 });
        //         }
        //     };
        }
    });