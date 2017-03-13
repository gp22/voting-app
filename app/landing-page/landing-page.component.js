'use strict';

// Define the `landingPage` controller on the `landingPage` module
angular
    .module('landingPage')
    .component('landingPage', {
        templateUrl: '/landing-page/landing-page.template.html',
        controller: function landingPageController($http, $window, $location) {
        }
    });