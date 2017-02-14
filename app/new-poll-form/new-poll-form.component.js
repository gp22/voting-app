'use strict';

// Define the `votingAppController` controller on the `votingApp` module
angular.
    module('newPollForm').
    component('newPollForm', {
        templateUrl: 'new-poll-form/new-poll-form.template.html',
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
                const poll = this.poll;
                const options = poll.options;
                const length = options.length;

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

                // add an option if the last object in the array is not empty
                if (options[length-1].choice !== '') {
                    options.push({ choice: '', score: 0 });
                }
            };
        }
    });