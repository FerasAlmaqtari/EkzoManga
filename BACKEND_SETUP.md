# Backend Setup Instructions

Since Node.js was not detected in the current environment, the backend dependencies could not be installed automatically. Please follow these steps to get the server running.

## 1. Install Prerequisites
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community) or use MongoDB Atlas.

## 2. Install Dependencies
Open a terminal in this directory (`c:\Users\PC\Desktop\Feras Programs\EkzoTeam`) and run:
```bash
npm init -y
npm install express mongoose dotenv cors passport passport-google-oauth20 express-session
```

## 3. Configure Environment Variables
Open the `.env` file and update the following values with your own credentials:
- `MONGO_URI`: Your MongoDB connection string.
- `GOOGLE_CLIENT_ID`: From Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
- `SESSION_SECRET`: A random string for session security.

## 4. Run the Server
```bash
node server.js
```
The server will start on port 5000 (or the port defined in `.env`).

## 5. View the App
Open `http://localhost:5000` in your browser.
