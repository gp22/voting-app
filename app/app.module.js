'use strict';

// Define the votingApp module
angular.module('votingApp', [
    // ...which depends on the newPollForm module
    'ngRoute',
    'newPollForm',
    'showPoll'
]);