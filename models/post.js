const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  promptDetails: {
    type: String,
    required: true
  },
  postText: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  // Cloudinary fields for better image management (optional)
  cloudinary: {
    publicId: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a separate schema for tracking total posts generated
const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  totalPostsGenerated: {
    type: Number,
    default: 0
  },
  monthlyStats: {
    type: Map,
    of: {
      totalPostsGenerated: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    },
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Post: mongoose.model('Post', postSchema),
  UserStats: mongoose.model('UserStats', userStatsSchema)
}; 