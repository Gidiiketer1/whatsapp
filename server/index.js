const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

// Load APP environment configuration
const appEnvPath = path.join(__dirname, 'config', 'app.env');
if (fs.existsSync(appEnvPath)) {
  require('dotenv').config({ path: appEnvPath });
  console.log('📁 Loaded APP environment configuration');
} else {
  require('dotenv').config();
  console.log('📁 Using default environment configuration');
}

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const { authenticateToken } = require('./middleware/auth');

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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/user', authenticateToken, userRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, senderId, content, type = 'text' } = data;
      
      // Save message to database (you'll need to implement this)
      // const message = await saveMessage(chatId, senderId, content, type);
      
      // Emit to all users in the chat
      socket.to(chatId).emit('receiveMessage', {
        chatId,
        senderId,
        content,
        type,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle joining chat rooms
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

