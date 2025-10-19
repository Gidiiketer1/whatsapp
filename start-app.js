#!/usr/bin/env node

/**
 * WhatsApp Clone - APP Environment Startup Script
 * This script starts the application in APP environment mode
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting WhatsApp Clone in APP Environment...\n');

// Check if environment files exist
const serverEnvPath = path.join(__dirname, 'server', 'config', 'app.env');
const clientEnvPath = path.join(__dirname, 'client', 'config', 'app.env');

if (!fs.existsSync(serverEnvPath)) {
    console.error('❌ Server environment file not found:', serverEnvPath);
    process.exit(1);
}

if (!fs.existsSync(clientEnvPath)) {
    console.error('❌ Client environment file not found:', clientEnvPath);
    process.exit(1);
}

console.log('✅ Environment files found');
console.log('📁 Server config:', serverEnvPath);
console.log('📁 Client config:', clientEnvPath);

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.APP_ENVIRONMENT = 'true';

// Start server
console.log('\n🔧 Starting backend server...');
const serverProcess = spawn('node', ['server/index.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
        ...process.env,
        NODE_ENV: 'production'
    }
});

// Start client (in development mode for now)
setTimeout(() => {
    console.log('\n⚛️  Starting React client...');
    const clientProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'client'),
        stdio: 'inherit',
        shell: true,
        env: {
            ...process.env,
            REACT_APP_API_URL: 'http://localhost:5000/api',
            REACT_APP_SOCKET_URL: 'http://localhost:5000',
            REACT_APP_ENVIRONMENT: 'production'
        }
    });

    clientProcess.on('error', (err) => {
        console.error('❌ Client process error:', err);
    });
}, 3000);

serverProcess.on('error', (err) => {
    console.error('❌ Server process error:', err);
});

serverProcess.on('exit', (code) => {
    console.log(`\n🔚 Server process exited with code ${code}`);
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down APP environment...');
    serverProcess.kill('SIGINT');
    process.exit(0);
});

console.log('\n✅ WhatsApp Clone APP Environment started!');
console.log('🌐 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:5000');
console.log('📱 Press Ctrl+C to stop');
