const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty']
    }
});

module.exports = mongoose.model('user', userSchema);
