const express = require('express');
const router = express.Router();
const { ensureAuth, ensureRole } = require('../middleware/auth');
const User = require('../models/User');
const Manga = require('../models/Manga');
const Comment = require('../models/Comment');

// Middleware to ensure user is admin
router.use(ensureAuth, ensureRole(['admin']));

// @desc    Get Admin Stats & Users
// @route   GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const mangaCount = await Manga.countDocuments();
        const commentCount = await Comment.countDocuments();

        const users = await User.find().sort({ createdAt: -1 });

        res.json({
            stats: {
                users: userCount,
                manga: mangaCount,
                comments: commentCount
            },
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Update User Role
// @route   PUT /admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['reader', 'publisher', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent changing own role for safety (optional, but good practice)
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ error: 'Cannot change your own role' });
        }

        user.role = role;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
