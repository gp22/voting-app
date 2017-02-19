'use strict';

angular
    .module('votingApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {

            $routeProvider
                // NEW route
                .when('/polls/new', {
                    template: '<new-poll-form></new-poll-form>'
                })

                .when('/polls/:id', {
                    template: '<show-poll></show-poll>'
                })

             // use the HTML5 History API
            $locationProvider.html5Mode(true);
        }
    ]);