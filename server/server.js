// Load environment variables
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // This is your MongoDB connection file

// ✅ Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Your middlewares, routes, etc.

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
