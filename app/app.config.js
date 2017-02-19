'use strict';

angular.
    module('votingApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/polls/new', {
                    template: '<new-poll-form></new-poll-form>'
                })

             // use the HTML5 History API
            $locationProvider.html5Mode(true);
        }
    ]);