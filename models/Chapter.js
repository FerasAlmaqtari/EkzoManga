const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    mangaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    chapterNumber: {
        type: Number,
        required: true
    },
    pages: [{
        type: String // URL of the page image
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chapter', ChapterSchema);
