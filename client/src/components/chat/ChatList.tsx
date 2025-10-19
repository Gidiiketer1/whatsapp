import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatList.css';

interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
  }>;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      username: string;
    };
    createdAt: string;
  };
  lastMessageTime: string;
  unreadCount?: number;
}

interface ChatListProps {
  selectedChat: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChat, onChatSelect }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/chat');
      setChats(response.data);
    } catch (err: any) {
      setError('Failed to load chats');
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupName || 'Group Chat';
    }
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants.find(p => p._id !== localStorage.getItem('userId'));
    return otherParticipant?.username || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupAvatar;
    }
    // For direct chats, show the other participant's avatar
    const otherParticipant = chat.participants.find(p => p._id !== localStorage.getItem('userId'));
    return otherParticipant?.avatar;
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const isFromCurrentUser = chat.lastMessage.sender._id === localStorage.getItem('userId');
    const prefix = isFromCurrentUser ? 'You: ' : '';
    
    return prefix + chat.lastMessage.content;
  };

  if (loading) {
    return (
      <div className="chat-list">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchChats} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {chats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </div>
          <p>No chats yet</p>
          <small>Start a conversation with someone</small>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${selectedChat === chat._id ? 'active' : ''}`}
            onClick={() => onChatSelect(chat._id)}
          >
            <div className="chat-avatar">
              {getChatAvatar(chat) ? (
                <img src={getChatAvatar(chat)} alt={getChatName(chat)} />
              ) : (
                <span>{getChatName(chat).charAt(0).toUpperCase()}</span>
              )}
            </div>
            
            <div className="chat-info">
              <div className="chat-header">
                <div className="chat-name">{getChatName(chat)}</div>
                <div className="chat-time">
                  {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
                </div>
              </div>
              
              <div className="chat-preview">
                <div className="chat-last-message">
                  {getLastMessagePreview(chat)}
                </div>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <div className="unread-badge">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;

