'use strict';
// This line may be totally unnecessary
// const routes = require('./app/routes/index.js');
const bodyParser = require('body-parser');
const Option = require('./models/option');
const Poll = require('./models/poll');
const User = require('./models/user');
const mongoose = require('mongoose');
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
Define RESTful routes
*/

// INDEX route

// NEW route

// CREATE route
app.post('/polls', (req, res) => {
    // console.log(req.body.options);

    // first create the poll
    Poll.create(req.body.name, (err, poll) => {
        if (err) {
            console.log(err);
        } else {
            // then use async to individually create each option
            async.each(req.body.options, (option, callback) => {
                Option.create(option, (err, option) => {
                    if (err) {
                        return callback(err);
                        // console.log('error creating option');
                    } else {
                        poll.options.push(option);
                        poll.save();
                        callback();
                    }
                });
            }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    // send the created poll when all options
                    // are successfully created
                    res.json(poll);
                }
            });
        }
    });
});

// SHOW route
app.get('/polls/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    /*
    find the poll with the specified id
    send the poll data in the response
    */
});

// EDIT route

// UPDATE route

// DELETE route

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