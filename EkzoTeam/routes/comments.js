const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { ensureAuth } = require('../middleware/auth');

// @desc    Get comments for a manga or chapter
// @route   GET /comments
// @query   mangaId or chapterId
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.mangaId) query.mangaId = req.query.mangaId;
        if (req.query.chapterId) query.chapterId = req.query.chapterId;

        const comments = await Comment.find(query)
            .populate('userId', 'displayName image')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Add a comment
// @route   POST /comments
router.post('/', ensureAuth, async (req, res) => {
    try {
        const newComment = {
            userId: req.user.id,
            content: req.body.content,
            mangaId: req.body.mangaId,
            chapterId: req.body.chapterId
        };

        const comment = await Comment.create(newComment);
        // Populate user details immediately for frontend display
        await comment.populate('userId', 'displayName image');

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Delete a comment
// @route   DELETE /comments/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if user is comment owner or admin
        if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Not authorized' });
        }

        await Comment.deleteOne({ _id: req.params.id });
        res.json({ message: 'Comment removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
