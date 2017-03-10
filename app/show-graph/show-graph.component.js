'use strict';

// Define the `showGraphController` controller on the `showGraph` module
angular
    .module('showGraph')
    .component('showGraph', {
        templateUrl: '/show-graph/show-graph.template.html',
        controller: function showGraphController($routeParams, $http) {

            // Get the poll to show from the database
            $http.get(`/api/polls/${$routeParams.id}`).then(res => {
                this.poll = res.data;

                let labels = [];
                let data = [];

                this.poll.options.forEach(option => {
                    labels.push(option.name);
                    data.push(option.score);
                });

                // console.log(this.poll);

                const ctx = document.getElementById("pollChart");
                const pollChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                        datasets: [{
                            label: '# of Votes',
                            data: data,
                            // data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        title: {
                            display: false,
                            text: this.poll.name
                        }
                    }
                });

            });

        }
    });