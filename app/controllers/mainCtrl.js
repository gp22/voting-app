'use strict';

angular
    .module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $timeout, $location) {
        // if (Auth.isLoggedIn()) {
        //     console.log(`Logged in as: ${Auth.currentUser().username}`);
        // }

        this.isLoggedIn = function() {
            return Auth.isLoggedIn();
        }

        this.logout = function() {
            Auth.logout();
            // $location.path('/');
            $timeout(function() {
                $location.path('/');
            }, 2000);
        };
    });