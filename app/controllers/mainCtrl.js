'use strict';

angular
    .module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth) {
        console.log(Auth.currentUser());
    });