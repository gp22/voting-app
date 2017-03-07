'use strict';

angular
    .module('votingApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {

            $routeProvider
                // Landing page route
                .when('/', {
                    template: '<landing-page></landing-page>'
                })
                // INDEX route
                .when('/polls', {
                    template: '<show-polls></show-polls>'
                })
                // NEW route
                .when('/polls/new', {
                    template: '<new-poll-form></new-poll-form>'
                })
                // SHOW route
                .when('/polls/:id', {
                    template: '<show-poll></show-poll>'
                })
                // EDIT route
                .when('/polls/:id/edit', {
                    template: '<edit-poll-form></edit-poll-form>'
                })
                // HOME route for logged in users
                .when('/profile', {
                    template: '<show-user-polls></show-user-polls>'
                })
                // SIGNUP route
                .when('/signup', {
                    template: '<signup-form></signup-form>'
                })
                // LOGIN route
                .when('/login', {
                    template: '<login-form></login-form>'
                })

             // use the HTML5 History API
            $locationProvider.html5Mode(true);
        }
    ]);