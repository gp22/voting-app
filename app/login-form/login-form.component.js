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

            // send user data to server.js
            this.login = () => {
                const user = this.user;

                // send user to server.js if no fields were left empty
                if (user.username != '' &&
                    user.password != '') {
                    $http.post('/api/login', user).then(res => {
                        // console.log(res.data.token);
                        $window.sessionStorage.token = res.data.token;
                        $location.url('/');
                    }, res => {
                        $location.url('/polls');
                    });
                }
            };
        }
    });