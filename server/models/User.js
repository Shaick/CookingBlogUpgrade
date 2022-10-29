const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nick: {
        type: String,
        required: 'This fild is required.'
    },
    email: {
        type: String,
        required: 'This fild is required.'
    },
    password: {
        type: String,
        required: 'This fild is required.'
    },
    photo: {
        type: String,
    }
}); 

module.exports = mongoose.model('User', userSchema);