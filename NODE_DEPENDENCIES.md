# WhatsApp Clone - Node.js Dependencies

This document contains all the Node.js dependencies needed to run the WhatsApp clone application.

## System Requirements
- **Node.js** (v14 or higher) - https://nodejs.org/
- **MongoDB** (local or Atlas) - https://www.mongodb.com/
- **npm** or **yarn** package manager

## Backend Dependencies (server/package.json)

### Core Framework
- express==4.18.2
- mongoose==8.0.3
- socket.io==4.7.4

### Authentication & Security
- jsonwebtoken==9.0.2
- bcryptjs==2.4.3
- cors==2.8.5

### Environment & Configuration
- dotenv==16.3.1

### File Upload
- multer==1.4.5-lts.1

### Validation
- express-validator==7.0.1

### Development Dependencies
- nodemon==3.0.2

## Frontend Dependencies (client/package.json)

### React Core
- react==18.2.0
- react-dom==18.2.0
- react-router-dom==6.20.1

### Real-time Communication
- socket.io-client==4.7.4

### HTTP Client
- axios==1.6.2

### TypeScript Support
- typescript==4.9.5
- @types/react==18.2.42
- @types/react-dom==18.2.17
- @types/node==16.18.68
- @types/jest==27.5.2
- @types/socket.io-client==3.0.0

### Testing
- @testing-library/jest-dom==5.17.0
- @testing-library/react==13.4.0
- @testing-library/user-event==14.5.2

### Build Tools
- react-scripts==5.0.1
- web-vitals==2.1.4

## Root Project Dependencies (package.json)

### Development Tools
- concurrently==8.2.2

## Installation Instructions

### Quick Install (All Dependencies)
```bash
npm run install-all
```

### Manual Install
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

## Environment Setup

### Server Environment (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=generate_a_strong_secret_key_here
NODE_ENV=development
```

### Client Environment (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Start Both Servers
```bash
npm run dev
```

### Start Separately
```bash
# Backend
cd server && npm run dev

# Frontend (in new terminal)
cd client && npm start
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## MongoDB Setup Options

### Option 1: Local MongoDB
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Use: `mongodb://localhost:27017/whatsapp-clone`

### Option 2: MongoDB Atlas (Cloud)
- Go to https://www.mongodb.com/atlas
- Create free account and cluster
- Get connection string
- Use: `mongodb+srv://username:YOUR_PASSWORD@cluster.mongodb.net/whatsapp-clone`

## Security Best Practices
1. **NEVER commit .env files** to version control
2. **Use strong, unique JWT secrets** (32+ characters)
3. **Use environment variables** for all sensitive data
4. **Rotate secrets regularly** in production
5. **Use HTTPS** in production
6. **Validate all user inputs**
7. **Use CORS properly configured**
8. **Implement rate limiting** for API endpoints

## Troubleshooting
- If ports are busy, change PORT in server/.env
- If MongoDB connection fails, check if MongoDB is running
- If dependencies fail, delete node_modules and run npm install
- Make sure to restart terminal after installing Node.js
