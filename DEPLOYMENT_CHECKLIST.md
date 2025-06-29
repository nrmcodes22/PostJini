# 🚀 PostJini Deployment Checklist

## ✅ Pre-Deployment (COMPLETED)
- [x] MongoDB connection working
- [x] Server running locally
- [x] All routes functional
- [x] Environment variables configured

## 🔧 Required Environment Variables
Make sure these are set in your deployment platform:

```
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

## 🌐 Google OAuth Setup (IMPORTANT)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find your OAuth 2.0 credentials
3. Add your production URL to authorized redirect URIs:
   - `https://your-app-name.onrender.com/auth/google/callback` (for Render)
   - `https://your-app-name.railway.app/auth/google/callback` (for Railway)

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: postjini
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add all environment variables
7. Deploy!

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Add GitHub repo
5. Add environment variables
6. Deploy automatically

## 🔍 Post-Deployment Tests
- [ ] Homepage loads
- [ ] Google OAuth login works
- [ ] User can create posts
- [ ] Images upload to Cloudinary
- [ ] Gemini AI integration works
- [ ] All pages are accessible

## 🛠️ Troubleshooting
If something breaks:
1. Check deployment logs
2. Verify environment variables
3. Test MongoDB connection
4. Check Google OAuth redirect URIs
5. Verify Cloudinary credentials

## 📞 Need Help?
- Check the full `DEPLOYMENT.md` guide
- Review deployment platform documentation
- Test locally first with `npm start` 