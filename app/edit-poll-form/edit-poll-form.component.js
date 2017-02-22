'use strict';

// Define the `editPollFormController` controller on the `editPollForm` module
angular
    .module('editPollForm')
    .component('editPollForm', {
        templateUrl: '/edit-poll-form/edit-poll-form.template.html',
        controller: function editPollFormController($routeParams, $http, $location) {

            const id = $routeParams.id;
            this.poll = {};

            // Get the poll to edit from the database
            $http.get(`/api/polls/${id}`).then(res => {
                this.poll = res.data;
                this.poll.toDelete = [];
            });

            // send updated poll data to the EDIT route of server.js
            this.updatePoll = () => {
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

                // send updated poll to server.js if no fields were left empty
                if (options[0].name != '' &&
                    options[1].name != '') {
                    $http.put(`/polls/${id}`, poll).then(res => {
                        $location.url(`/polls/${id}`);
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

            // add option to array of options to delete
            this.deleteOption = (index) => {
                // allow options to be deleted if there are more than 2
                if (this.poll.options.length > 2) {
                    // if the option is already in the database
                    // add it to the toDelete array
                    if (this.poll.options[index].hasOwnProperty('_id')) {
                        this.poll.toDelete.push(this.poll.options[index]._id);
                    }
                    this.poll.options.splice(index, 1);
                    // console.log(this.poll.toDelete);
                    // console.log(this.poll);
                }
            };

            // delete the entire poll
            this.deletePoll = () => {
                $http.delete(`/polls/${id}`).then(res => {
                    $location.url('/');
                });
            };
        }
    });