const express = require('express');
const router = express.Router();
const { generateTextPost } = require('../utils/geminiText');
const { generateImage } = require('../utils/geminiImage');
const { Post, UserStats } = require('../models/post');
const { deleteImage } = require('../utils/cloudinary');
const mongoose = require('mongoose');

router.get('/new', (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('create-post', { user: req.user });
});

// Assuming user is logged in (via passport)
router.post('/generate', async (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    console.log('❌ User not authenticated');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { hotelName, event, promptDetails } = req.body;
  console.log('📝 Received form data:', { hotelName, event, promptDetails });

  if (!hotelName || !event) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ error: "Missing input fields." });
  }

  try {
    console.log('🔄 Starting post generation...');
    
    // Test Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY not found in environment');
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    console.log('✅ Gemini API key found');
    
    const generatedPosts = [];
    
    // Generate exactly 2 posts
    for (let i = 0; i < 2; i++) {
      console.log(`🔄 Generating post ${i + 1}/2...`);
      
      try {
        console.log('🔄 Generating text...');
        const text = await generateTextPost({ hotelName, event, occasion: promptDetails });
        console.log('✅ Text generated successfully:', text.substring(0, 100) + '...');
        
        console.log('🔄 Generating image...');
        const { imageUrl, cloudinaryData } = await generateImage({ hotelName, event, occasion: promptDetails });
        console.log('✅ Image generated successfully');
        console.log('Image URL type:', imageUrl ? (imageUrl.startsWith('data:') ? 'base64' : 'external') : 'null');

        // Prepare post data
        const postData = {
          user: req.user._id,
          hotelName,
          event,
          promptDetails: promptDetails || '',
          postText: text,
          imageUrl
        };

        // Add Cloudinary data if available and valid
        if (cloudinaryData && cloudinaryData.publicId && cloudinaryData.url) {
          postData.cloudinary = {
            publicId: cloudinaryData.publicId,
            url: cloudinaryData.url,
            width: cloudinaryData.width,
            height: cloudinaryData.height
          };
          console.log('✅ Cloudinary data added to post');
        } else {
          console.log('⚠️ No valid Cloudinary data available, using base64 image');
        }

        console.log('🔄 Saving to database...');
        // Save post to database
        const newPost = new Post(postData);
        await newPost.save();
        console.log('✅ Post saved to database with ID:', newPost._id);
        
        generatedPosts.push(newPost);
        
      } catch (postError) {
        console.error(`❌ Error generating post ${i + 1}:`, postError);
        // Continue with next post instead of failing completely
        continue;
      }
    }

    // Check if we successfully generated any posts
    if (generatedPosts.length === 0) {
      return res.status(500).json({ error: 'Failed to generate any posts' });
    }

    // Increment total posts generated count
    let userStats = await UserStats.findOne({ user: req.user._id });
    if (!userStats) {
      userStats = new UserStats({ 
        user: req.user._id, 
        totalPostsGenerated: generatedPosts.length 
      });
    } else {
      userStats.totalPostsGenerated += generatedPosts.length;
    }
    
    // Update monthly stats
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: "2024-12"
    if (!userStats.monthlyStats.has(currentMonth)) {
      userStats.monthlyStats.set(currentMonth, {
        totalPostsGenerated: generatedPosts.length,
        lastUpdated: new Date()
      });
    } else {
      const monthData = userStats.monthlyStats.get(currentMonth);
      monthData.totalPostsGenerated += generatedPosts.length;
      monthData.lastUpdated = new Date();
      userStats.monthlyStats.set(currentMonth, monthData);
    }
    
    await userStats.save();
    console.log('✅ User stats updated');

    console.log('🎉 Post generation completed successfully!');
    
    // Return the generated posts to display on the create-post page
    return res.json({ 
      success: true,
      posts: generatedPosts,
      message: `Successfully generated ${generatedPosts.length} posts!`
    });
    
  } catch (err) {
    console.error('❌ Error generating post:', err);
    console.error('❌ Error name:', err.name);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    
    // Check for specific error types
    if (err.message.includes('API key')) {
      console.error('🔑 API Key Error - Check your GEMINI_API_KEY');
    }
    if (err.message.includes('Cloudinary')) {
      console.error('☁️ Cloudinary Error - Check your Cloudinary credentials');
    }
    if (err.message.includes('MongoDB')) {
      console.error('🗄️ Database Error - Check your MongoDB connection');
    }
    
    // Check for quota exceeded error - more comprehensive check
    if (err.message.includes('429') || 
        err.message.includes('quota') || 
        err.message.includes('Too Many Requests') ||
        err.message.includes('exceeded') ||
        err.message.includes('QuotaFailure') ||
        err.status === 429) {
      console.error('📊 Quota exceeded - Gemini API daily limit reached');
      // Return a specific error response for quota exceeded
      return res.status(429).json({ 
        error: "Unfortunately, quota is exceeded. Please try again tomorrow or upgrade your Gemini API plan.",
        quotaExceeded: true 
      });
    }
    
    // For other errors, return a generic error response
    return res.status(500).json({ 
      error: "An error occurred while generating the posts. Please try again.",
      details: err.message 
    });
  }
});

// Get user's posts with total count
router.get('/my-posts', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user's posts
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Get or create user stats
    let userStats = await UserStats.findOne({ user: req.user._id });
    if (!userStats) {
      userStats = new UserStats({ 
        user: req.user._id, 
        totalPostsGenerated: posts.length 
      });
      await userStats.save();
    }

    // Populate monthly stats for existing posts if monthlyStats is empty
    if (userStats.monthlyStats.size === 0 && posts.length > 0) {
      console.log('Populating monthly stats for existing posts...');
      
      // Group posts by month
      const postsByMonth = {};
      posts.forEach(post => {
        const monthKey = new Date(post.createdAt).toISOString().slice(0, 7); // Format: "2024-12"
        if (!postsByMonth[monthKey]) {
          postsByMonth[monthKey] = 0;
        }
        postsByMonth[monthKey]++;
      });
      
      // Update monthlyStats
      Object.keys(postsByMonth).forEach(monthKey => {
        userStats.monthlyStats.set(monthKey, {
          totalPostsGenerated: postsByMonth[monthKey],
          lastUpdated: new Date()
        });
      });
      
      await userStats.save();
      console.log('Monthly stats populated successfully');
    }

    // Get current month stats
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: "2024-12"
    const monthlyStats = userStats.monthlyStats.get(currentMonth) || { totalPostsGenerated: 0 };

    res.json({
      posts: posts,
      totalPostsGenerated: userStats.totalPostsGenerated,
      monthlyPostsGenerated: monthlyStats.totalPostsGenerated
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Update a post - specific route
router.put('/update/:postId', async (req, res) => {
  try {
    console.log('PUT route called for postId:', req.params.postId);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    if (!req.user) {
      console.log('User not authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { hotelName, event, postText } = req.body;
    console.log('Extracted data:', { hotelName, event, postText });

    if (!hotelName || !event || !postText) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    const post = await Post.findOne({ _id: req.params.postId, user: req.user._id });
    console.log('Found post:', post ? 'Yes' : 'No');
    
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update the post
    post.hotelName = hotelName;
    post.event = event;
    post.postText = postText;
    await post.save();
    
    console.log('Post updated successfully');

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to update post: ' + error.message });
  }
});

// Delete a post (doesn't affect totalPostsGenerated count)
router.delete('/:postId', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const post = await Post.findOne({ _id: req.params.postId, user: req.user._id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete from Cloudinary if cloudinary data exists
    if (post.cloudinary && post.cloudinary.publicId) {
      try {
        await deleteImage(post.cloudinary.publicId);
        console.log('Image deleted from Cloudinary:', post.cloudinary.publicId);
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router; 