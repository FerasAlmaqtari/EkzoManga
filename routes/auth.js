const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// @desc    Get Current User
// @route   GET /auth/current_user
router.get('/current_user', (req, res) => {
    if (req.user) {
        res.json({
            isLoggedIn: true,
            user: {
                displayName: req.user.displayName,
                image: req.user.image,
                role: req.user.role
            }
        });
    } else {
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;
