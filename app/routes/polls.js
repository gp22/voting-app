'use strict';

const Option = require('../../models/option');
const Poll = require('../../models/poll');
const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const async = require('async');


/*
Configure express-jwt, tell it the secret, and the name of the property to
create on the req object that will hold the JWT, in this case - 'payload'
*/

const auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

/*
Poll routes
*/

// API for INDEX route
router.get('/api/polls', (req, res) => {
    Poll.find({}, (err, polls) => {
        if (err) {
            console.log(err)
        } else {
            res.json(polls);
        }
    })
});

// NEW route
router.get('/polls/new', (req, res) => {
    // define the root path for res.sendFile by getting the
    // directory path with __dirname and removing the routes
    // directory to get back out to /app
    let dirname = __dirname.split('/').slice(0,-1).join('/');

    res.sendFile('/index.html', { root: dirname });
});

// CREATE route
router.post('/polls', (req, res) => {
    // first create the poll
    const name = req.body.name;
    const username = req.body.username;
    Poll.create({ name: name, username: username }, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            // add client id to each option
            req.body.options.forEach(option => {
                option.poll_id = poll._id;
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
router.get('/api/polls/:id', (req, res) => {
    Poll.findById(req.params.id).populate('options').exec(function(err, poll) {
        if (err) {
            console.log(err);
        } else {
            res.json(poll);
        }
    });
});

// API for SHOW USER POLLS route
router.get('/api/users/:username/polls', auth, (req, res) => {
    const username = req.params.username;
    Poll.find({ username: username }, (function(err, polls) {
        if (err) {
            console.log(err);
        } else {
            res.json(polls);
        }
    }));
});

// UPDATE route
router.put('/polls/:id', (req, res) => {
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
        Poll.findById(req.body._id, function(err, poll) {
            if (err) {
                console.log(err);
            } else {
                // then use async to delete options
                async.series([
                    function(callback) {
                        if (optionsToDelete.length != 0) {
                            async.each(optionsToDelete, function(option, callback) {
                                Option.findByIdAndRemove(option, function(err, optionToDelete) {
                                    if (err) {
                                        return callback(err);
                                    } else {
                                        // remove option from poll.options
                                        const index = poll.options.indexOf(optionToDelete._id);
                                        poll.options.splice(index, 1);
                                        callback();
                                    }
                                });
                            }, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // save the poll once options deleted
                                    poll.save();
                                }
                            });
                        }
                        callback(null);
                    },
                    function(callback) {
                        // add poll id to each new option
                        optionsToCreate.forEach(option => {
                            option.poll_id = poll._id;
                        });
                        // create each new option
                        async.each(optionsToCreate, function(option, callback) {
                            Option.create(option, function(err, option) {
                                if (err) {
                                    return callback(err);
                                } else {
                                    // add the option to the poll
                                    poll.options.push(option);
                                    callback();
                                }
                            });
                        }, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                // save the poll once all new options created
                                poll.save();
                            }
                        });
                        callback(null);
                    },
                    function(callback) {
                        // and update the existing options
                        async.each(optionsToUpdate, function(option, callback) {
                            const name = { name: option.name };
                            Option.findByIdAndUpdate(option._id, name, { new: true }, function(err, option) {
                                if (err) {
                                    return callback(err);
                                } else {
                                    callback();
                                }
                            });
                        });
                        callback(null);
                    }
                ],
                function(err, result) {
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
        Option.findByIdAndUpdate(req.params.id, score, { new: true }, function(err, option) {
            if (err) {
                console.log(err);
            } else {
                res.json(option);
            }
        });
    }
});

// DELETE route
router.delete('/polls/:id', (req, res) => {
    const id = req.params.id;
    // first remove the poll
    Poll.findByIdAndRemove(id, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            // delete the options associated with the poll
            Option.remove({ poll_id: id }, (err, options) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(poll + options);
                }
            });
        }
    });
});

module.exports = router;