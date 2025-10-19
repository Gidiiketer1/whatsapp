import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  mediaUrl?: string;
  createdAt: string;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (chatId: string, content: string, type?: string) => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  onReceiveMessage: (callback: (message: Message) => void) => void;
  offReceiveMessage: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        // Join user's personal room
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  const sendMessage = (chatId: string, content: string, type: string = 'text') => {
    if (socket && user) {
      socket.emit('sendMessage', {
        chatId,
        senderId: user.id,
        content,
        type
      });
    }
  };

  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit('joinChat', chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket) {
      socket.leave(chatId);
    }
  };

  const onReceiveMessage = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('receiveMessage', callback);
    }
  };

  const offReceiveMessage = () => {
    if (socket) {
      socket.off('receiveMessage');
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    sendMessage,
    joinChat,
    leaveChat,
    onReceiveMessage,
    offReceiveMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

