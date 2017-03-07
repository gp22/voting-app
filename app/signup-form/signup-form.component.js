'use strict';

// Define the `signupFormController` controller on the `signupForm` module
angular
    .module('signupForm')
    .component('signupForm', {
        templateUrl: '/signup-form/signup-form.template.html',
        controller: function signupFormController($http, $window, $location) {
            this.user = {
                username: '',
                email: '',
                password: ''
            };

            // send user data to server.js
            this.addUser = () => {
                const user = this.user;

                // send user to server.js if no fields were left empty
                if (user.username != '' &&
                    user.email != '' &&
                    user.password != '') {
                    $http.post('/api/signup', user).then(res => {
                        // save the JSON token in the response to local storage
                        $window.localStorage.token = res.data.token;
                        // redirect to their profile page
                        $location.url('/profile');
                    }, res => {
                        $location.url('/polls');
                    });
                }
            };
        }
    });