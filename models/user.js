'use strict';
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
/*
Define schema and model for users
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    hash: String,
    salt: String
});

userSchema.plugin(passportLocalMongoose);

// generate a salt and associated hash, code help from:
// https://thinkster.io/tutorials/mean-stack/extending-the-user-model-for-authentication
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

// generate the JSON webtoken to send in the response
userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'SECRET'); // use environment variable for production code
};

module.exports = mongoose.model('User', userSchema);