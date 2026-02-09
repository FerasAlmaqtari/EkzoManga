const express = require('express');
const router = express.Router();
const path = require('path');

// @desc    Landing Page
// @route   GET /
router.get('/', (req, res) => {
    // Determine if we should show the dashboard link or login button
    // This is handled in the frontend logic usually, but for now we serve the static file
    res.sendFile(path.join(__dirname, '../index.html'));
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', (req, res) => {
    // In a real app, this would be protected by ensureAuth middleware
    if (req.isAuthenticated()) {
        res.send(`<h1>Dashboard</h1><p>Welcome, ${req.user.displayName}</p><a href="/auth/logout">Logout</a>`);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
