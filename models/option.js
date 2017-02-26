'use strict';
const mongoose = require('mongoose');
/*
Define schema and model for polls
*/
const optionSchema = new mongoose.Schema({
    poll_id: String,
    name: String,
    score: Number
});

module.exports = mongoose.model('Option', optionSchema);