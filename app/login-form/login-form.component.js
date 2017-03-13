'use strict';

// Define the `loginFormController` controller on the `loginForm` module
angular
    .module('loginForm')
    .component('loginForm', {
        templateUrl: '/login-form/login-form.template.html',
        controller: function loginFormController($http, $window, $location) {
            this.user = {
                username: '',
                password: ''
            };

            // create the app object for displaying error messages
            let app = this;

            // send user data to server.js
            this.login = () => {
                const user = this.user;

                $http.post('/api/login', user).then(res => {
                    // if the login was successful
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