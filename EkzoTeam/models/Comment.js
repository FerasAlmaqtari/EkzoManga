const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mangaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
