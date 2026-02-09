const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');
const Manga = require('../models/Manga');

// @desc    Get User Profile (Dashboard)
// @route   GET /user/dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        // In a real templated app (EJS/Pug), we'd render here. 
        // For this API/Static split, we return JSON or redirect to static file with data?
        // Since we are using static HTML, we might need a separate API endpoint to fetch data 
        // and one to serve the page.
        // For now, let's assume this is the API endpoint the frontend calls.
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Update User Profile
// @route   PUT /user/profile
router.put('/profile', ensureAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (req.body.displayName) user.displayName = req.body.displayName;
        if (req.body.avatar) user.avatar = req.body.avatar; // Assuming URL string

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Add/Remove Favorite
// @route   PUT /user/favorites/:mangaId
router.put('/favorites/:mangaId', ensureAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const mangaId = req.params.mangaId;

        // Check if already in favorites
        if (user.favorites.includes(mangaId)) {
            // Remove
            user.favorites = user.favorites.filter(id => id.toString() !== mangaId);
        } else {
            // Add
            user.favorites.push(mangaId);
        }

        await user.save();
        res.json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
