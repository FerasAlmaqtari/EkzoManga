const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
                proxy: true
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id || '',
                    displayName: profile.displayName || profile.username || '',
                    firstName: profile.name?.givenName || '',
                    lastName: profile.name?.familyName || '',
                    image: profile.photos?.[0]?.value || '',
                    email: profile.emails?.[0]?.value || '',
                    role: 'reader'
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Auto-promote certain emails to admin
                    const adminEmails = [
                        'ferasalmaqtary77@gmail.com',
                        'ferasrozoro@gmail.com'
                    ];
                    if (adminEmails.includes(newUser.email)) {
                        newUser.role = 'admin';
                    }

                    // Create user (fields use safe defaults above)
                    user = await User.create(newUser);
                    return done(null, user);
                } catch (err) {
                    console.error('Passport GoogleStrategy error:', err);
                    return done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
