// 1. Import Dependencies
require('dotenv').config(); // Loads environment variables from a .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const userRoutes = require('./routes/userRoutes');

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. CORS Configuration (The Fix)
// List of URLs that are allowed to make requests to this backend
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://your-frontend-deployment-url.vercel.app' // IMPORTANT: REPLACE WITH YOUR ACTUAL FRONTEND URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from an allowed origin
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// 4. Middleware
app.use(cors(corsOptions)); // Use the configured CORS options
app.use(express.json()); // Parses incoming JSON requests

// 5. Use Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 7. Basic Route for Testing
app.get('/', (req, res) => {
  res.send('API is running!');
});

// 8. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});