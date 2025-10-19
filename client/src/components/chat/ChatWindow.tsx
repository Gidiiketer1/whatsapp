import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import './ChatWindow.css';

interface ChatWindowProps {
  chatId: string;
  onBack?: () => void;
  isMobile: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onBack, isMobile }) => {
  const { joinChat, leaveChat, onReceiveMessage, offReceiveMessage } = useSocket();
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Join the chat room
    joinChat(chatId);

    // Set up message listener
    const handleReceiveMessage = (message: any) => {
      if (message.chatId === chatId) {
        // Handle new message - you might want to update the chat state here
        console.log('Received message:', message);
      }
    };

    onReceiveMessage(handleReceiveMessage);

    // Cleanup
    return () => {
      offReceiveMessage();
      leaveChat(chatId);
    };
  }, [chatId, joinChat, leaveChat, onReceiveMessage, offReceiveMessage]);

  useEffect(() => {
    fetchChatDetails();
  }, [chatId]);

  const fetchChatDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // You might want to fetch chat details here
      // For now, we'll just set a basic chat object
      setChat({
        _id: chatId,
        participants: [],
        isGroup: false,
        lastMessage: null
      });
    } catch (err: any) {
      setError('Failed to load chat');
      console.error('Error fetching chat:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-window">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-window">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchChatDetails} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <ChatHeader 
        chat={chat} 
        onBack={onBack}
        isMobile={isMobile}
      />
      
      <MessageList chatId={chatId} />
      
      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatWindow;

