'use strict';

// Define the `landingPage` controller on the `landingPage` module
angular
    .module('landingPage')
    .component('landingPage', {
        templateUrl: '/landing-page/landing-page.template.html',
        controller: function landingPageController($http, $window, $location) {
            // this.user = {
            //     username: '',
            //     password: ''
            // };

            // send user data to server.js
            // this.login = () => {
            //     const user = this.user;

            //     // send user to server.js if no fields were left empty
            //     if (user.username != '' &&
            //         user.password != '') {
            //         $http.post('/api/login', user).then(res => {
            //             // save the JSON token in the response to local storage
            //             $window.localStorage.token = res.data.token;
            //             // redirect to their profile page
            //             $location.url('/profile');
            //         }, res => {
            //             $location.url('/');
            //         });
            //     }
            // };
        }
    });