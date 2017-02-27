'use strict';
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
/*
Define schema and model for users
*/
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    polls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);