'use strict';

// const routes = require('./app/routes/index.js');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const Option = require('./models/option');
const Poll = require('./models/poll');
const User = require('./models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const async = require('async');
const app = express();

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
app.use(require('express-session')({
    secret: 'gold trianlge white cloud green palm tree',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
Define RESTful routes
*/

// API for INDEX route
app.get('/api/polls', (req, res) => {
    Poll.find({}, (err, polls) => {
        if (err) {
            console.log(err)
        } else {
            res.json(polls);
        }
    })
});

// NEW route
app.get('/polls/new', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
});

// CREATE route
app.post('/polls', (req, res) => {
    // first create the poll
    Poll.create(req.body.name, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            // add client id to each option
            req.body.options.forEach(option => {
                option.poll_id = poll._id;
                console.log(option);
            });
            // then use async to individually create each option
            async.each(req.body.options, (option, callback) => {
                Option.create(option, (err, option) => {
                    if (err) {
                        return callback(err);
                        // console.log('error creating option');
                    } else {
                        poll.options.push(option);
                        callback();
                    }
                });
            }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    // send the created poll when all options
                    // are successfully created
                    poll.save();
                    res.json(poll);
                }
            });
        }
    });
});

// API for SHOW and EDIT routes
app.get('/api/polls/:id', (req, res) => {
    Poll.findById(req.params.id).populate('options').exec(function(err, poll) {
        if (err) {
            console.log(err);
        } else {
            res.json(poll);
        }
    })
});

// UPDATE route
app.put('/polls/:id', (req, res) => {
    // check if this is a poll update request or a poll submission
    if (req.body.action === 'updatePoll') {
        // separate options to update and options to create
        let optionsToUpdate = [];
        let optionsToCreate = [];
        let optionsToDelete = req.body.toDelete;
        req.body.options.forEach(option => {
            // if option alread has an id, it gets updated
            if (option.hasOwnProperty('_id')) {
                optionsToUpdate.push(option);
            } else {
                // otherwise it needs to be created
                optionsToCreate.push(option);
            }
        });

        // then use async to create each new option and add it to the poll
        Poll.findById(req.body._id, (err, poll) => {
            if (err) {
                console.log(err);
            } else {
                // then use async to delete options
                async.series([
                    function(callback) {
                        if (optionsToDelete.length != 0) {
                            async.each(optionsToDelete, (option, callback) => {
                                Option.findByIdAndRemove(option, (err, optionToDelete) => {
                                    if (err) {
                                        return callback(err);
                                    } else {
                                        // remove option from poll.options
                                        const index = poll.options.indexOf(optionToDelete._id);
                                        poll.options.splice(index, 1);
                                        callback();
                                    }
                                });
                            });
                            callback(null);
                        }
                    },
                    function(callback) {
                        // create each new option
                        async.each(optionsToCreate, (option, callback) => {
                            Option.create(option, (err, option) => {
                                if (err) {
                                    return callback(err);
                                } else {
                                    // and add it to the poll
                                    poll.options.push(option);
                                    callback();
                                }
                            });
                        });
                        callback(null);
                    },
                    function(callback) {
                        // and update the existing options
                        async.each(optionsToUpdate, (option, callback) => {
                            const name = { name: option.name };
                            Option.findByIdAndUpdate(option._id, name, { new: true }, (err, option) => {
                                if (err) {
                                    return callback(err);
                                } else {
                                    callback();
                                }
                            });
                        }, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                // save the poll once all updates are done
                                poll.save();
                            }
                        });
                        callback(null);
                    }
                ],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // send the created poll when all options
                        // are successfully created
                        res.send(poll);
                    }
                });
            }
        });
    } else {
        // submit the poll
        // get score from request and create new object
        const score = { score: req.body.score };
        Option.findByIdAndUpdate(req.params.id, score, { new: true }, (err, option) => {
            if (err) {
                console.log(err);
            } else {
                res.json(option);
            }
        });
    }
});

// DELETE route
app.delete('/polls/:id', (req, res) => {
    const id = req.params.id;
    Poll.findByIdAndRemove(id, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            res.json(poll);
        }
    });
});

/*
Auth routes
*/

// handle signups
app.post('/api/signup', (req,res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).send(err);
        }
        passport.authenticate('local')(req, res, () => {
            res.status(201).send('user created');
        });
    });
});

// handle logins


// Route to handle all other requests
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
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
