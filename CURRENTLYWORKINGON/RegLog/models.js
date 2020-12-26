const mongoose = require('mongoose');

const user = new mongoose.Schema({
    id: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

const book = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    author: {
        type: String
    },
    genre: {
        type: String
    }
})

module.exports = mongoose.model('Books', book)
module.exports = mongoose.model('Users', user)
