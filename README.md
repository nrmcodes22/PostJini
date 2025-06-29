# PostJini - AI-Powered Social Media Post Generator

PostJini is a web application that helps hotels create stunning social media posts using AI-generated text and images powered by Google's Gemini AI.

## 🚀 Features

- **AI Text Generation**: Create compelling social media post text using Google Gemini AI
- **AI Image Creation**: Generate stunning visuals that match your event theme and hotel branding
- **Google OAuth Authentication**: Secure login using Google accounts
- **Cloud Storage**: Images are stored on Cloudinary for reliable access
- **User Dashboard**: Track your generated posts and view statistics
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Generation**: Get your content ready in seconds

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth 2.0
- **AI Integration**: Google Generative AI (Gemini)
- **Image Storage**: Cloudinary
- **Frontend**: EJS templating engine, Tailwind CSS
- **File Upload**: Multer

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB database
- Google Cloud Console account (for Gemini API)
- Cloudinary account (optional, for image storage)
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

5. **Set up Cloudinary (optional)**
   - Create a [Cloudinary account](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret
   - Add them to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
postjini/
├── models/
│   ├── post.js          # Post and UserStats schemas
│   └── user.js          # User schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── posts.js         # Post management routes
├── utils/
│   ├── cloudinary.js    # Cloudinary integration
│   ├── geminiImage.js   # AI image generation
│   └── geminiText.js    # AI text generation
├── views/
│   ├── partials/
│   │   └── navbar.ejs   # Navigation component
│   ├── create-post.ejs  # Post creation page
│   ├── error.ejs        # Error page
│   ├── index.ejs        # Landing page
│   ├── my-posts.ejs     # User's posts page
│   └── profile.ejs      # User profile page
├── public/
│   └── hero.png         # Static assets
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔐 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Logout user

### Posts
- `GET /posts` - Get all posts (API)
- `POST /posts` - Create a new post
- `GET /posts/:id` - Get a specific post
- `DELETE /posts/:id` - Delete a post

### Pages
- `GET /` - Landing page
- `GET /profile` - User profile dashboard
- `GET /create-post` - Post creation form
- `GET /my-posts` - User's posts page

## 🎯 Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Create Post**: Navigate to the create post page
3. **Fill Details**: Enter hotel name, event type, and occasion
4. **Generate**: Click generate to create AI-powered content
5. **Save**: Save your generated post to your collection
6. **Manage**: View and manage all your posts from the dashboard

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |
| `PORT` | Server port (default: 5000) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console logs for error messages
2. Verify your environment variables are correctly set
3. Ensure your Google OAuth and Gemini API credentials are valid
4. Check your MongoDB connection

## 🔮 Future Enhancements

- [ ] Add support for multiple social media platforms
- [ ] Implement post scheduling
- [ ] Add analytics and performance tracking
- [ ] Create mobile application
- [ ] Add more AI models and customization options
- [ ] Implement team collaboration features

---

**Note**: This application requires active internet connection for AI generation and authentication services. 