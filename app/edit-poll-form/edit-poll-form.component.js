'use strict';

// Define the `editPollFormController` controller on the `editPollForm` module
angular
    .module('editPollForm')
    .component('editPollForm', {
        templateUrl: '/edit-poll-form/edit-poll-form.template.html',
        controller: function editPollFormController($routeParams, $http) {

            const id = $routeParams.id;
            this.poll = {};

            // Get the poll to edit from the database
            $http.get(`/api/polls/${id}`).then(res => {
                this.poll = res.data;
            });

            // // send updated poll data to the EDIT route of server.js
            this.createPoll = () => {
                let poll = this.poll;
                const options = poll.options;
                const length = options.length;
                // tell the UPDATE route in server.js that this
                // will be a poll update
                poll.action = 'updatePoll';

                // remove the last additional option if it was left blank
                if (length > 2 && poll.options[length-1].name === '') {
                    poll.options.pop();
                }

                // send poll to server.js if no fields were left empty
                if (poll.name != '' &&
                    options[0].name != '' &&
                    options[1].name != '') {
                    $http.put(`/polls/${id}`, poll).then(res => {
                        console.log(res.data);
                    });
                }
            };

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