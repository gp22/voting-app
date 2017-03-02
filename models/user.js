'use strict';
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
/*
Define schema and model for users
*/
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// generate the JSON webtoken to send in the response
userSchema.methods.generateJwt = () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'SECRET'); // use environment variable for production code
};

module.exports = mongoose.model('User', userSchema);