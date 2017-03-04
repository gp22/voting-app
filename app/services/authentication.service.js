'use strict';

// Define user authentication services
angular
    .module('authServices', [])

    .factory('Auth', function($window) {

        // check if user is logged in and token is not expired
        const isLoggedIn = function() {
            const token = $window.localStorage.token;
            let payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        // get the name of the current user
        const currentUser = function() {
            if(isLoggedIn()){
                const token = $window.localStorage.token;
                let payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    username: payload.username
                };
            }
        };

        // log user out by deleting token from local storage
        const logout = function() {
            $window.localStorage.removeItem('token');
        };

        return {
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            logout: logout
        };
    });

    // .service('auth', auth);

    // auth.$inject = ['$http', '$window'];
    // function auth ($http, $window) {

    //     const saveToken = function (token) {
    //         $window.localStorage['token'] = token;
    //     };

    //     const getToken = function () {
    //         return $window.localStorage['token'];
    //     };

    //     const logout = function () {
    //         $window.localStorage.removeItem('token');
    //     };

    //     const isLoggedIn = function () {
    //         const token = getToken();
    //         let payload;

    //         if (token) {
    //             payload = token.split('.')[1];
    //             payload = $window.atob(payload);
    //             payload = JSON.parse(payload);

    //             return payload.exp > Date.now() / 1000;
    //         } else {
    //             return false;
    //         }
    //     };

    //     const currentUser = function () {
    //         if(isLoggedIn()){
    //             const token = getToken();
    //             let payload = token.split('.')[1];
    //             payload = $window.atob(payload);
    //             payload = JSON.parse(payload);
    //             return {
    //                 username: payload.username
    //             };
    //         }
    //     };

    //     return {
    //         saveToken: saveToken,
    //         getToken: getToken,
    //         logout: logout,
    //         isLoggedIn: isLoggedIn
    //     };
    // }
