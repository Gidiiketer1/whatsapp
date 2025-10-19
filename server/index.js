const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load APP environment configuration
const appEnvPath = path.join(__dirname, 'config', 'app.env');
if (fs.existsSync(appEnvPath)) {
  dotenv.config({ path: appEnvPath });
  console.log('📁 Loaded APP environment configuration');
} else {
  dotenv.config();
  console.log('📁 Using default environment configuration');
}

// Import routes and middleware
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const { authenticateToken } = require('./middleware/auth');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/user', authenticateToken, userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join personal room (e.g., userId)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined personal room`);
  });

  // Join a chat room
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`💬 Joined chat room: ${chatId}`);
  });

  // Leave a chat room
  socket.on('leaveRoom', (chatId) => {
    socket.leave(chatId);
    console.log(`🚪 Left chat room: ${chatId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, senderId, content, type = 'text' } = data;

      // TODO: Save the message to your database here
      // const message = await saveMessage(chatId, senderId, content, type);

      // Broadcast the message to others in the chat room
      socket.to(chatId).emit('receiveMessage', {
        chatId,
        senderId,
        content,
        type,
        timestamp: new Date()
      });

      console.log(`📤 Message sent to chat ${chatId} from ${senderId}`);
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
