import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import './MessageList.css';

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
  replyTo?: {
    _id: string;
    content: string;
    sender: {
      username: string;
    };
  };
}

interface MessageListProps {
  chatId: string;
}

const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { onReceiveMessage, offReceiveMessage } = useSocket();

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    // Set up real-time message listener
    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.chat === chatId) {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    };

    onReceiveMessage(handleReceiveMessage);

    return () => {
      offReceiveMessage();
    };
  }, [chatId, onReceiveMessage, offReceiveMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/chat/${chatId}/messages?page=${pageNum}&limit=50`);
      const newMessages = response.data;
      
      if (pageNum === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...newMessages, ...prev]);
      }
      
      setHasMore(newMessages.length === 50);
    } catch (err: any) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const shouldShowDate = (currentMessage: Message, previousMessage: Message | null) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  const shouldShowAvatar = (currentMessage: Message, nextMessage: Message | null) => {
    if (!nextMessage) return true;
    
    return currentMessage.sender._id !== nextMessage.sender._id;
  };

  const isMessageRead = (message: Message) => {
    if (!user) return false;
    return message.readBy.some(read => read.user === user.id);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="message-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchMessages()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="message-container" 
      ref={messagesContainerRef}
      onScroll={(e) => {
        const container = e.target as HTMLDivElement;
        if (container.scrollTop === 0 && hasMore && !loading) {
          loadMoreMessages();
        }
      }}
    >
      {loading && messages.length > 0 && (
        <div className="loading-more">
          <div className="spinner"></div>
        </div>
      )}
      
      {messages.length === 0 ? (
        <div className="empty-messages">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </div>
          <p>No messages yet</p>
          <small>Start the conversation</small>
        </div>
      ) : (
        messages.map((message, index) => {
          const isOwnMessage = message.sender._id === user?.id;
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
          
          return (
            <React.Fragment key={message._id}>
              {shouldShowDate(message, previousMessage) && (
                <div className="date-divider">
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              )}
              
              <div className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
                {!isOwnMessage && shouldShowAvatar(message, nextMessage) && (
                  <div className="message-avatar">
                    {message.sender.avatar ? (
                      <img src={message.sender.avatar} alt={message.sender.username} />
                    ) : (
                      <span>{message.sender.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                )}
                
                <div className="message-content-wrapper">
                  {message.replyTo && (
                    <div className="reply-preview">
                      <div className="reply-content">
                        <div className="reply-sender">{message.replyTo.sender.username}</div>
                        <div className="reply-text">{message.replyTo.content}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="message-bubble">
                    {message.type === 'text' ? (
                      <div className="message-content">{message.content}</div>
                    ) : (
                      <div className="message-media">
                        {message.type === 'image' && (
                          <img src={message.mediaUrl} alt="Media" className="media-image" />
                        )}
                        {message.type === 'file' && (
                          <div className="file-message">
                            <div className="file-icon">📎</div>
                            <div className="file-info">
                              <div className="file-name">{message.content}</div>
                              <div className="file-size">File</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="message-meta">
                      <span className="message-time">{formatTime(message.createdAt)}</span>
                      {isOwnMessage && (
                        <span className="message-status">
                          {isMessageRead(message) ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

