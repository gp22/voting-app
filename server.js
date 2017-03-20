'use strict';

const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const Option = require('./models/option');
const Poll = require('./models/poll');
const User = require('./models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const async = require('async');
const app = express();

const pollRoutes = require('./app/routes/polls');
const authRoutes = require('./app/routes/auth');
const indexRoutes = require('./app/routes/index');

/*
Use the heroku environment variable MLAB_URI to store the db name and login
for use with Mlab or localhost:27017 for local testing
Set the heroku variable with the command 'heroku config:set MLAB_URI='
*/
const uri = (process.env.MLAB_URI) ? process.env.MLAB_URI : 'mongodb://localhost:27017/voting_app';

// use process.env.PORT for compatibility with heroku or 3000 for local
const port = (process.env.PORT) ? process.env.PORT : 3000;

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

/*
Configure Passport
*/
// app.use(require('express-session')({
//     secret: 'gold trianlge white cloud green palm tree',
//     resave: false,
//     saveUninitialized: false
// }));
app.use(passport.initialize());
// app.use(passport.session());

// passport local strategy, code help from:
// https://thinkster.io/tutorials/mean-stack/setting-up-passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, { username: 1, salt: 1, hash: 1 }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        });
    }
));

// use the routes
app.use(pollRoutes);
app.use(authRoutes);
app.use(indexRoutes);

// error handler for unauthorized route errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "message": err.name + ": " + err.message });
    }
});

/*
Connect to mongodb and start server
*/
mongoose.connect(uri, (err, db) => {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('Successfully connected to MongoDB...');
    }

    app.listen(port, () => {
        console.log(`Node.js listening on port ${port}...`);
    });

});
