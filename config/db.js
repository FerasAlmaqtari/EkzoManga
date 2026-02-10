const mongoose = require('mongoose');

/**
 * Connect to MongoDB with sensible defaults for serverless and non-serverless.
 * - Reuses existing connection when available (avoids multiple connections in serverless).
 * - Uses modern connection options and a reasonable serverSelectionTimeoutMS.
 */
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        const msg = 'MONGO_URI is not set in environment';
        console.error(msg);
        throw new Error(msg);
    }

    // If already connected or connecting, reuse the existing mongoose connection
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB: already connected (reusing connection)');
        return mongoose.connection;
    }

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000 // 10s
    };

    try {
        const conn = await mongoose.connect(mongoUri, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message || error);
        // In serverless environments, crashing the process may not be desired.
        // Throw the error so the caller (and deployment logs) can handle/report it.
        throw error;
    }
};

module.exports = connectDB;
