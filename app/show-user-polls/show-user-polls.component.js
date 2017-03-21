'use strict';

// Define the `showPollsController` controller on the `showPolls` module
angular
    .module('showUserPolls')
    .component('showUserPolls', {
        templateUrl: '/show-user-polls/show-user-polls.template.html',
        controller: function showPollsController($http, $window, Auth) {

            // this.polls = {};
            // const username = Auth.currentUser();
            this.username = Auth.currentUser();

            // create the app object for displaying error messages
            let app = this;

            // store the token for sending in the Authorization header
            const token = $window.localStorage.token;

            // Get the poll to show from the database
            $http.get(`/api/users/${this.username}/polls`, {
                // add the token to the Authorization header
                // to get access to the protected express route
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(res => {
                this.polls = res.data;
                if (this.polls.length === 0) {
                    app.errorMsg = 'You don\'t have any polls.';
                }
            });
        }
    });