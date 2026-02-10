const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['reader', 'publisher', 'admin'],
        default: 'reader',
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
