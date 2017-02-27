'use strict';

angular
    .module('votingApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {

            $routeProvider
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