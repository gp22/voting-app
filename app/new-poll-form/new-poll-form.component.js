'use strict';

// Define the `newPollFormController` controller on the `newPollForm` module
angular
    .module('newPollForm')
    .component('newPollForm', {
        templateUrl: '/new-poll-form/new-poll-form.template.html',
        controller: function newPollFormController($http) {
            this.poll = {
                name: { name: '' },
                options: [
                    {
                        name: '',
                        score: 0
                    },
                    {
                        name: '',
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
                if (length > 2 && poll.options[length-1].name === '') {
                    poll.options.pop();
                }

                // send poll to server.js if no fields were left empty
                if (poll.name.name != '' &&
                    options[0].name != '' &&
                    options[1].name != '') {
                    $http.post('/polls', poll).then(res => {
                        console.log(res.data);

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
                if (options[length-1].name !== '') {
                    options.push({ name: '', score: 0 });
                }
            };
        }
    });