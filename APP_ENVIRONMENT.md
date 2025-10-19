# WhatsApp Clone - APP Environment Setup

This guide explains how to run the WhatsApp clone application in APP environment mode.

## 🚀 Quick Start

### Option 1: Using the APP Script (Recommended)
```bash
npm run app
```

### Option 2: Manual Setup
```bash
# Start server in APP mode
npm run app:server

# Start client in APP mode (in new terminal)
npm run app:client
```

## 📁 APP Environment Configuration

### Server Configuration (`server/config/app.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

### Client Configuration (`client/config/app.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## 🔧 APP Environment Features

### Enhanced Security
- Production-ready JWT configuration
- Secure password hashing with bcrypt
- CORS properly configured
- Environment variable validation

### Optimized Performance
- Production Node.js environment
- Optimized database connections
- Efficient file upload handling
- Proper logging configuration

### Real-time Communication
- Socket.io with production settings
- Optimized message handling
- Efficient room management
- Connection error handling

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Configure Environment
1. Copy the example environment files:
   ```bash
   cp server/config/app.env server/.env
   cp client/config/app.env client/.env
   ```

2. Update the configuration files with your settings:
   - Change `JWT_SECRET` to a secure random string
   - Update `MONGODB_URI` to your database connection
   - Configure `CORS_ORIGIN` for your domain

### Step 3: Start the Application
```bash
npm run app
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api
- **Socket.io**: ws://localhost:5000

## 📊 Environment Variables

### Server Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | production |
| `MONGODB_URI` | Database connection string | mongodb://localhost:27017/whatsapp-clone |
| `JWT_SECRET` | JWT signing secret | (required) |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `MAX_FILE_SIZE` | Maximum file upload size | 10485760 (10MB) |
| `UPLOAD_PATH` | File upload directory | ./uploads |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d |
| `LOG_LEVEL` | Logging level | info |

### Client Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | http://localhost:5000 |
| `REACT_APP_ENVIRONMENT` | App environment | production |
| `REACT_APP_VERSION` | App version | 1.0.0 |

## 🔒 Security Best Practices

### JWT Configuration
- Use a strong, unique JWT secret (32+ characters)
- Rotate secrets regularly in production
- Set appropriate token expiration times

### Database Security
- Use MongoDB authentication
- Enable SSL/TLS for database connections
- Regular database backups

### CORS Configuration
- Configure CORS origins properly
- Use HTTPS in production
- Validate all incoming requests

## 🚀 Deployment

### Production Deployment
1. Set up MongoDB Atlas or production MongoDB
2. Configure environment variables
3. Use PM2 or similar process manager
4. Set up reverse proxy (nginx)
5. Enable HTTPS with SSL certificates

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-clone
JWT_SECRET=your_production_jwt_secret_here
CORS_ORIGIN=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in server/config/app.env
2. **MongoDB connection failed**: Check MongoDB is running and URI is correct
3. **CORS errors**: Verify CORS_ORIGIN matches your frontend URL
4. **JWT errors**: Ensure JWT_SECRET is set and consistent

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run app
```

### Health Check
```bash
# Check if server is running
curl http://localhost:5000/api/auth/me
```

## 📝 Logs

The APP environment provides comprehensive logging:
- Server startup logs
- Database connection status
- Socket.io connection events
- API request logs
- Error tracking

## 🔄 Development vs APP Environment

| Feature | Development | APP Environment |
|---------|-------------|-----------------|
| Node.js Mode | development | production |
| Logging | verbose | optimized |
| Error Handling | detailed | user-friendly |
| Performance | development | optimized |
| Security | relaxed | strict |

## 📞 Support

For issues with the APP environment:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network connectivity between services
