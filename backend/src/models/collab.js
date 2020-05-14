const mongoose = require('mongoose');
const ErrorMsg = require('../models/error');

const CollabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String
    }
})

const Collab = mongoose.model('collab', CollabSchema)

module.exports = Collab;