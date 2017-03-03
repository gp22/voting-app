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
                        // console.log(res.data);
                        $window.sessionStorage.token = res.data.token;
                        $location.url('/');
                    }, res => {
                        $location.url('/polls');
                    });
                }
            };

            // add another option input field to poll creation form
            this.addOption = () => {
                // const options = this.poll.options;
                // const length = options.length;

                // // add an option if the last object in the array is not empty
                // if (options[length-1].name !== '') {
                //     options.push({ name: '', score: 0 });
                // }
            };
        }
    });