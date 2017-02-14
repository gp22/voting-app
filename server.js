'use strict';

const express = require('express');
const mongoose = require('mongoose');
// This line may be totally unnecessary
// const routes = require('./app/routes/index.js');
const bodyParser = require('body-parser');
const app = express();

/*
Use the heroku environment variable MLAB_URI to store the db name and login
for use with Mlab or localhost:27017 for local testing
Set the heroku variable with the command 'heroku config:set MLAB_URI='
*/
const uri = (process.env.MLAB_URI) ? process.env.MLAB_URI : 'mongodb://localhost:27017/voting_app';

// use process.env.PORT for compatibility with heroku or 3000 for local
const port = (process.env.PORT) ? process.env.PORT : 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

/*
Define schema and model for polls
*/
const pollSchema = new mongoose.Schema({
    name: String,
    options: Array
});

const Poll = mongoose.model('Poll', pollSchema);

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

/*
create a page listing all polls, url will be:
gp22-voting.herokuapp.com/polls
individual urls for polls will be gp22-voting.herokuapp.com/polls/:pollid

create a dashboard page for authenticated users, url will be:
gp22-voting.herokuapp.com/:userid
requirements:
in the main header there will be buttons for new poll and view polls
on new poll page there will be a form with inputs for poll name, and an input
for each available option. there will need to be a button to add more options
and a submit button which creates the new poll
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