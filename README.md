# WhatsApp Clone - Full-Stack Messaging Application

A full-stack WhatsApp-like messaging application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Frontend
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Login/Register with JWT tokens
- **Chat Management**: Create and manage individual and group chats
- **Message Types**: Support for text, images, files, and voice messages
- **Dark/Light Mode**: Toggle between themes
- **Message Status**: Read receipts and delivery indicators
- **User Search**: Find and start conversations with other users
- **Typing Indicators**: See when someone is typing
- **Message Reactions**: React to messages with emojis

### Backend
- **RESTful API**: Complete REST API for all operations
- **Real-time Communication**: WebSocket support with Socket.io
- **User Authentication**: JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Support for media file uploads
- **Message Encryption**: Secure message storage
- **User Management**: User profiles and status management

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Context API for state management
- Socket.io-client for real-time communication
- Axios for HTTP requests
- CSS3 with responsive design

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Project Structure

```
whatsapp-clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   └── chat/       # Chat components
│   │   ├── contexts/       # React contexts
│   │   └── App.tsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

### Running Both Together

From the root directory:
```bash
npm run dev
```

This will start both the backend and frontend servers concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/user/search?q=query` - Search users
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/status` - Update user status

### Chats
- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId/messages` - Get chat messages
- `POST /api/chat/:chatId/messages` - Send message
- `PUT /api/chat/:chatId/messages/:messageId/read` - Mark message as read

## Socket.io Events

### Client to Server
- `join` - Join user's personal room
- `joinChat` - Join a specific chat room
- `sendMessage` - Send a message
- `typing` - User is typing
- `stopTyping` - User stopped typing

### Server to Client
- `receiveMessage` - Receive new message
- `userTyping` - User is typing
- `userStopTyping` - User stopped typing
- `messageRead` - Message was read
- `userOnline` - User came online
- `userOffline` - User went offline

## Features Implementation

### Real-time Messaging
- Messages are sent instantly using Socket.io
- Message status indicators (sent, delivered, read)
- Typing indicators
- Online/offline status

### User Interface
- WhatsApp-like design with message bubbles
- Responsive layout for mobile and desktop
- Dark/light mode toggle
- Smooth animations and transitions

### Security
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration

## Development

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new API routes in `server/routes/`
3. Update database models if needed
4. Add Socket.io events for real-time features

### Database Schema

#### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  status: String,
  lastSeen: Date
}
```

#### Chat Model
```javascript
{
  participants: [ObjectId],
  isGroup: Boolean,
  groupName: String,
  lastMessage: ObjectId,
  lastMessageTime: Date
}
```

#### Message Model
```javascript
{
  chat: ObjectId,
  sender: ObjectId,
  content: String,
  type: String,
  mediaUrl: String,
  readBy: [Object],
  createdAt: Date
}
```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, AWS, or your preferred platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Update API URLs in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Push notifications
- [ ] Voice and video calls
- [ ] Message encryption
- [ ] Group chat management
- [ ] Message search
- [ ] File sharing
- [ ] Message reactions
- [ ] Story feature
- [ ] Status updates
- [ ] Message forwarding

