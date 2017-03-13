'use strict';

// Define the `signupFormController` controller on the `signupForm` module
angular
    .module('signupForm')
    .component('signupForm', {
        templateUrl: '/signup-form/signup-form.template.html',
        controller: function signupFormController($http, $window, $location) {
            this.user = {
                username: '',
                password: ''
            };

            // create the app object for displaying error messages
            let app = this;

            // send user data to server.js
            this.addUser = () => {
                const user = this.user;

                $http.post('/api/signup', user).then(res => {
                    // if the signup was successful
                    // save the JSON token in the response to local storage
                    $window.localStorage.token = res.data.token;
                    // redirect to their profile page
                    $location.url('/profile');
                }, res => {
                    // otherwise
                    // display the error message
                    app.errorMsg = res.data.message;
                });
            };
        }
    });