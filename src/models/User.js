const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    publications: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication',
    }],
    sharedPublications: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;