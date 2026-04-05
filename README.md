# Alumni Portal - Netlify Deployment Guide

This application is ready to be hosted on [Netlify](https://www.netlify.com/).

## Deployment Steps

1. **Export the Project:**
   - Go to the **Settings** menu in AI Studio.
   - Select **Export to GitHub** or **Download ZIP**.

2. **Connect to Netlify:**
   - Log in to your Netlify account.
   - Click **Add new site** > **Import an existing project**.
   - Connect your GitHub repository (or upload the ZIP).

3. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Base Directory:** (Leave empty if the project is in the root)

4. **Set Environment Variables:**
   In the Netlify UI, go to **Site settings** > **Environment variables** and add:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `APP_URL`: The final URL of your Netlify site (e.g., `https://your-site-name.netlify.app`).

## Netlify Configuration

The project includes a `netlify.toml` file that handles:
- Build settings.
- SPA redirects (ensuring React Router works correctly on page refresh).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo-name)

*Note: Replace the repository URL in the button above with your actual GitHub repository URL.*
