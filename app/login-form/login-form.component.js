'use strict';

// Define the `loginFormController` controller on the `loginForm` module
angular
    .module('loginForm')
    .component('loginForm', {
        templateUrl: '/login-form/login-form.template.html',
        controller: function loginFormController($http, $location) {
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
                        console.log(res.data);
                        $location.url('/');
                    }, res => {
                        $location.url('/polls');
                    });
                }
            };

            // add another option input field to poll creation form
            // this.addOption = () => {
            //     const options = this.poll.options;
            //     const length = options.length;

            //     // add an option if the last object in the array is not empty
            //     if (options[length-1].name !== '') {
            //         options.push({ name: '', score: 0 });
            //     }
            // };
        }
    });