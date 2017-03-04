'use strict';

// Define user authentication services
angular
    .module('authServices', [])

    .factory('Auth', function($window) {
        let authFactory = {};

        authFactory.isLoggedIn = function() {
            const token = $window.sessionStorage.token;
            let payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        }
        return authFactory;
    })

    .factory('AuthUser', function($window) {
        let authUserFactory = {};

        authUserFactory.currentUser = function() {
            const token = $window.sessionStorage.token;
            let payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                username: payload.username
            };
        }
        return authUserFactory;
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
