'use strict';

angular
    .module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {

        $rootScope.$on('$routeChangeStart', function() {
            // if someone tries to go to the /profile route and they're not logged in
            // redirect them to the login page
            if ($location.path() === '/profile' && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
            if ($location.path() === '/polls/new' && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
            if ($location.path().slice(-5) === '/edit' && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });

        // use Auth.isLoggedIn() to determine if user is logged in
        this.isLoggedIn = function() {
            return Auth.isLoggedIn();
        }

        this.logout = function() {
            Auth.logout();
            // $timeout(function() {
            $location.path('/');
            // }, 2000);
        };
    });