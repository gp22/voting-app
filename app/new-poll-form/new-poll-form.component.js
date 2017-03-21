'use strict';

// Define the `newPollFormController` controller on the `newPollForm` module
angular
    .module('newPollForm')
    .component('newPollForm', {
        templateUrl: '/new-poll-form/new-poll-form.template.html',
        controller: function newPollFormController($http, $location, $window, Auth) {
            this.poll = {
                name: '',
                username: Auth.currentUser(),
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

            // store the token for sending in the Authorization header
            const token = $window.localStorage.token;

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
                if (poll.name != '' &&
                    options[0].name != '' &&
                    options[1].name != '') {
                    $http.post('/polls', poll, {
                        // add the token to the Authorization header
                        // to get access to the protected express route
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }).then(res => {
                        $location.url(`/polls/${res.data._id}`);
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