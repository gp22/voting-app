'use strict';
const mongoose = require('mongoose');
/*
Define schema and model for polls
*/
const pollSchema = new mongoose.Schema({
    name: String,
    options: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Option'
        }
    ]
});

module.exports = mongoose.model('Poll', pollSchema);