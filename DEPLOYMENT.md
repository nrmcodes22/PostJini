# PostJini Deployment Guide

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads)
- Google OAuth credentials

## Environment Variables Required
Create these environment variables in your deployment platform:

```
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_session_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Deployment Options

### 1. Render (Recommended)

1. **Sign up** at [render.com](https://render.com)
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure:**
   - **Name**: postjini
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (from the list above)
6. **Deploy!**

### 2. Railway

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Create a new project**
4. **Add a new service** → **GitHub Repo**
5. **Configure environment variables**
6. **Deploy automatically**

### 3. Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create postjini-app`
4. **Add MongoDB**: `heroku addons:create mongolab`
5. **Set environment variables**:
   ```bash
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set GOOGLE_CLIENT_ID=your_id
   # ... add all other variables
   ```
6. **Deploy**: `git push heroku main`

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas account**
2. **Create a new cluster** (free tier)
3. **Get connection string**
4. **Add your IP to whitelist** (or 0.0.0.0/0 for all IPs)
5. **Use connection string as MONGO_URI**

## Google OAuth Setup

1. **Go to Google Cloud Console**
2. **Create a new project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs**:
   - Development: `http://localhost:5000/auth/google/callback`
   - Production: `https://your-app-url.com/auth/google/callback`

## Cloudinary Setup

1. **Sign up at Cloudinary**
2. **Get your cloud name, API key, and secret**
3. **Add to environment variables**

## Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Database is connected
- [ ] Google OAuth redirect URIs are updated
- [ ] Static files are serving correctly
- [ ] Image uploads work
- [ ] User authentication works
- [ ] All routes are accessible

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check MONGO_URI format
   - Ensure IP whitelist includes deployment platform

2. **Google OAuth Error**
   - Update redirect URIs in Google Console
   - Check client ID and secret

3. **Static Files Not Loading**
   - Ensure public folder is properly configured
   - Check file paths in views

4. **Session Issues**
   - Verify SESSION_SECRET is set
   - Check session configuration

## Monitoring

- Set up logging for production
- Monitor database connections
- Track API usage for Gemini and Cloudinary
- Set up error notifications

## Security Considerations

- Use HTTPS in production
- Set secure session cookies
- Validate all user inputs
- Rate limit API endpoints
- Keep dependencies updated 