# Deploying Ekzo Manga CMS to Netlify

This project has been refactored to support deployment on Netlify.

## Prerequisites
1.  **GitHub Repository**: Push this code to a GitHub repository.
2.  **MongoDB Atlas**: Create a cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas).
3.  **Google Cloud Console**:
    -   Update your OAuth Authorized Redirect URI to: `https://<YOUR-NETLIFY-SITE>.netlify.app/auth/google/callback`

## Steps to Deploy
1.  Login to [Netlify](https://www.netlify.com/).
2.  Click "Add new site" -> "Import from Git".
3.  Select your repository.
4.  **Build Settings**:
    -   Base directory: `/`
    -   Publish directory: `public`
    -   Functions directory: `functions`
5.  **Environment Variables**:
    Click "Show advanced" -> "New Variable" and add:
    -   `MONGO_URI`: Your MongoDB Atlas connection string.
    -   `GOOGLE_CLIENT_ID`: Your Google Client ID.
    -   `GOOGLE_CLIENT_SECRET`: Your Google Client Secret.
    -   `SESSION_SECRET`: A random string.
    -   `CALLBACK_URL`: `https://<YOUR-NETLIFY-SITE>.netlify.app/auth/google/callback`
6.  Click **Deploy Site**.

## Local Development with Netlify CLI
To test serverless functions locally:
1.  Install Netlify CLI: `npm install -g netlify-cli`
2.  Run: `netlify dev`
