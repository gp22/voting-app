'use strict';

// Define the `editPollFormController` controller on the `editPollForm` module
angular
    .module('editPollForm')
    .component('editPollForm', {
        templateUrl: '/edit-poll-form/edit-poll-form.template.html',
        controller: function editPollFormController($routeParams, $http) {

            this.poll = {};

            // Get the poll to edit from the database
            $http.get(`/api/polls/${$routeParams.id}`).then(res => {
                this.poll = res.data;
                // console.log(this.poll);
            });

            // // send poll data to server.js
            // this.createPoll = () => {
            //     const poll = this.poll;
            //     const options = poll.options;
            //     const length = options.length;

            //     // remove the last additional option if it was left blank
            //     if (length > 2 && poll.options[length-1].name === '') {
            //         poll.options.pop();
            //     }

            //     // send poll to server.js if no fields were left empty
            //     if (poll.name.name != '' &&
            //         options[0].name != '' &&
            //         options[1].name != '') {
            //         $http.post('/polls', poll).then(res => {
            //             console.log(res.data);
            //         });
            //     }
            // };

            // add another option input field to poll creation form
            this.addOption = () => {
                const options = this.poll.options;
                const length = options.length;

                // add an option if the last object in the array is not empty
                if (options[length-1].name !== '') {
                    options.push({ name: '', score: 0 });
                }
            };
        }
    });