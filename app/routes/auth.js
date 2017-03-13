'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();

/*
Auth routes
*/

// handle signups, code help from:
// https://thinkster.io/tutorials/mean-stack/securing-endpoints-with-jwt-authentication
router.post('/api/signup', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields'});
    }

    let user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err) {
            return next(err);
        }
        // generate the JSON web token and send it in the response
        const token = user.generateJwt();
        return res.status(201).json({ "token": token });
    });
});

// handle logins, code help from:
// https://thinkster.io/tutorials/mean-stack/securing-endpoints-with-jwt-authentication
router.post('/api/login', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            // generate the JSON web token and send it in the response
            const token = user.generateJwt();
            return res.status(200).json({ "token": token });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send('Logged out');
});

module.exports = router;