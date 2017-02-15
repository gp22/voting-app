'use strict';
// This line may be totally unnecessary
// const routes = require('./app/routes/index.js');
const bodyParser = require('body-parser');
const Poll = require('./models/poll');
const mongoose = require('mongoose');
const express = require('express');
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
Define routes
*/

// receive new poll data from controller.js
app.post('/', (req, res) => {
    console.log(req.body);

    Poll.create(req.body, (err, poll) => {
        if (err) {
            console.log('Error creating poll');
        } else {
            res.json(poll);
        }
    });
});

// redirect to a specific poll page with id :id
app.get('/polls/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    /*
    find the poll with the specified id
    send the poll data in the response
    */
});

/*
create a page listing all polls, url will be:
gp22-voting.herokuapp.com/polls
individual urls for polls will be gp22-voting.herokuapp.com/polls/:pollid

create a dashboard page for authenticated users, url will be:
gp22-voting.herokuapp.com/:userid
requirements:

when the new poll is created the link to the new poll will be shown in place
of where the new poll form was. the url for the poll will be:
gp22-voting.herokuapp.com/:userid/:pollname
*/


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