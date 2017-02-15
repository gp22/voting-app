'use strict';
const mongoose = require('mongoose');
/*
Define schema and model for users
*/
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    polls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);