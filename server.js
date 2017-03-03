'use strict';

// const routes = require('./app/routes/index.js');
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
// passport local strategy from web dev bootcamp
// passport.use(new LocalStrategy(User.authenticate()));

// passport local strategy, code help from:
// https://thinkster.io/tutorials/mean-stack/setting-up-passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, { salt: 1, hash: 1 }, function(err, user) {
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

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

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

// handle signups, code help from:
// https://thinkster.io/tutorials/mean-stack/securing-endpoints-with-jwt-authentication
app.post('/api/signup', function(req, res, next) {
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
app.post('/api/login', function(req, res, next) {
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

// handle signups
// app.post('/api/signup', (req,res) => {
//     const newUser = new User({ username: req.body.username });
//     User.register(newUser, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             return res.status(403).send(err);
//         }
//         passport.authenticate('local')(req, res, () => {
//             // generate the JSON web token and send it in the response
//             const token = user.generateJwt();
//             res.status(201).json({ "token": token });
//         });
//     });
// });

// handle logins, code help from:
// https://www.sitepoint.com/user-authentication-mean-stack/
// app.post('/api/login', (req, res) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             res.status(404).json(err);
//             return;
//         }
//         // if a user is found
//         if (user) {
//             // generate the JSON web token and send it in the response
//             const token = user.generateJwt();
//             res.status(200).json({ "token": token });
//         } else {
//             // if user is not found
//             res.status(401).json(info);
//         }
//     })(req, res);
// });

// logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send('Logged out');
});

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
