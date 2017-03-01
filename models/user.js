'use strict';
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
/*
Define schema and model for users
*/
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);