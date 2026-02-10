require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Passport Config
require('./config/passport')(passport);

const MongoStore = require('connect-mongo');

// ... (other imports remain, but ensure path logic is correct)

// Connect to Database (ensure this handles re-connection in serverless)
// connectDB already called above; avoid duplicate calls

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware
// Trust proxy when behind a TLS/forwarding proxy (set TRUST_PROXY=true in env)
if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Express Session with MongoStore
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
// Note: For Netlify, we might need to adjust route paths if we don't use redirect rewriting
// But with netlify.toml redirects, these can stay as is.
app.use('/auth', require('./routes/auth'));
app.use('/manga', require('./routes/manga'));
app.use('/comments', require('./routes/comments'));
app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/admin'));
app.use('/articles', require('./routes/articles'));

// Conditional Listen (Global variable check or module parent check isn't always reliable in bundles)
// But for local dev:
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
