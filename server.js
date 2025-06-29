require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const passport=require('passport');
const path=require('path');
const session=require('express-session');
const postRoutes = require('./routes/posts');
require('./routes/auth');
const app=express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (for images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware - must come before routes
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Session middleware must come before passport
app.use(session({
   secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected");
}).catch(err=>{
    console.error("MongoDB connection",err);
})

// Individual routes (must come before /posts routes to avoid conflicts)
app.get('/my-posts',(req,res)=>{
    if(!req.user)
        return res.redirect('/');
    res.render('my-posts', { user: req.user });
});

app.get('/create-post',(req,res)=>{
    if(!req.user)
        return res.redirect('/');
    res.render('create-post', { user: req.user });
});

app.get('/profile',(req,res)=>{
    if(!req.user)
        return res.redirect('/');
    res.render('profile', { user: req.user });
});

// About and Pricing routes (accessible to all users)
app.get('/about',(req,res)=>{
    res.render('about', { user: req.user });
});

app.get('/pricing',(req,res)=>{
    res.render('pricing', { user: req.user });
});

app.get('/',(req,res)=>{
    res.render('index', { text: null, imageUrl: null, user: req.user });
    
})
app.get('/auth/google',
    passport.authenticate('google',{scope:['profile','email']})
);
app.get('/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/'}),
    (req,res)=>{
        res.redirect('/profile') 
    }
);
app.get('/auth/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Mount posts routes after individual routes
app.use('/posts', postRoutes);

// General error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    
    // If it's an API request, return JSON
    if (req.path.startsWith('/posts/')) {
        return res.status(500).json({ 
            error: 'Internal server error',
            details: err.message 
        });
    }
    
    // For other requests, render error page
    res.status(500).render('error', { 
        error: 'Something went wrong!',
        user: req.user 
    });
});

// 404 handler for non-API routes
app.use((req, res) => {
    if (req.path.startsWith('/posts/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.status(404).render('error', { 
        error: 'Page not found',
        user: req.user 
    });
});

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})