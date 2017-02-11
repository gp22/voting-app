'use strict';

const express = require('express');
const mongo = require('mongodb');
// This line may be totally unnecessary
// const routes = require('./app/routes/index.js');
const app = express();

/*
Use the heroku environment variable MLAB_URI to store the db name and login
for use with Mlab or localhost:27017 for local testing
Set the heroku variable with the command 'heroku config:set MLAB_URI='
*/
const uri = (process.env.MLAB_URI) ? process.env.MLAB_URI : 'mongodb://localhost:27017/test';

// use process.env.PORT for compatibility with heroku or 3000 for local
const port = (process.env.PORT) ? process.env.PORT : 3000;

mongo.connect(uri, (err, db) => {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('Successfully connected to MongoDB...');
    }

    app.use(express.static(__dirname + '/public'));

    app.listen(port, () => {
        console.log(`Node.js listening on port ${port}...`);
    });

});