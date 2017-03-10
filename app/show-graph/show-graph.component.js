'use strict';

// Define the `showGraphController` controller on the `showGraph` module
angular
    .module('showGraph')
    .component('showGraph', {
        templateUrl: '/show-graph/show-graph.template.html',
        controller: function showGraphController($routeParams, $http) {

            // define the empty poll object to save the poll
            // data returned from the database
            this.poll = {};

            // Get the poll to show from the database
            $http.get(`/api/polls/${$routeParams.id}`).then(res => {
                this.poll = res.data;
            });

            // this.polls = {};
            // // const username = Auth.currentUser();
            // this.username = Auth.currentUser();

            // // Get the poll to show from the database
            // $http.get(`/api/users/${this.username}/polls`).then(res => {
            //     this.polls = res.data;
            // });
        }
    });