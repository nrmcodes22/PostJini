# PostJini - AI-Powered Social Media Post Generator

PostJini is a web application that helps hotels create stunning social media posts using AI-generated text and images powered by Google's Gemini AI.

## 🚀 Features

- **AI Text Generation**: Create compelling social media post text using Google Gemini AI
- **AI Image Creation**: Generate stunning visuals that match your event theme and hotel branding
- **Google OAuth Authentication**: Secure login using Google accounts
- **Cloud Storage**: Images are stored on Cloudinary for reliable access
- **User Dashboard**: Track your generated posts and view statistics
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0
- **AI Integration**: Google Generative AI (Gemini)
- **Image Storage**: Cloudinary
- **Frontend**: EJS templating engine, Tailwind CSS

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google Cloud Console account (for Gemini API)
- Cloudinary account (optional)
- Google OAuth 2.0 credentials

## 🔧 Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd postjini
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

3. **Set up Google OAuth 2.0**
   - Go to Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000/auth/google/callback` to redirect URIs

4. **Set up Google Gemini AI**
   - Visit Google AI Studio
   - Create an API key for Gemini
   - Add to your `.env` file

## 🚀 Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

Visit `http://localhost:5000`

## 📁 Project Structure

```
postjini/
├── models/          # Database schemas
├── routes/          # API routes
├── utils/           # AI and cloudinary utilities
├── views/           # EJS templates
├── public/          # Static assets
└── server.js        # Main server file
```

## 🎯 Usage

1. Sign in with Google
2. Navigate to create post page
3. Enter hotel name, event type, and occasion
4. Generate AI-powered content
5. Save and manage your posts

## 🔐 API Endpoints

- `GET /` - Landing page
- `GET /profile` - User dashboard
- `GET /create-post` - Post creation
- `GET /my-posts` - User's posts
- `POST /posts` - Create new post
- `GET /posts/:id` - Get specific post
- `DELETE /posts/:id` - Delete post

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

ISC License
