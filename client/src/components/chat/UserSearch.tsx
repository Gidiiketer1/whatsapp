import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSearch.css';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

interface UserSearchProps {
  onClose: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [query]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/user/search?q=${encodeURIComponent(query)}`);
      setUsers(response.data);
    } catch (err: any) {
      setError('Failed to search users');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (userId: string) => {
    try {
      const response = await axios.post('/chat', {
        participants: [userId],
        isGroup: false
      });
      
      // Close search and navigate to the new chat
      onClose();
      // You might want to emit an event or use a callback to handle chat selection
      window.location.reload(); // Simple approach for now
    } catch (err: any) {
      setError('Failed to start chat');
      console.error('Error starting chat:', err);
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="user-search">
      <div className="search-header">
        <div className="search-input-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>
        <button onClick={onClose} className="close-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="search-results">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Searching...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={searchUsers} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && query.trim().length < 2 && (
          <div className="search-hint">
            <p>Type at least 2 characters to search</p>
          </div>
        )}

        {!loading && !error && query.trim().length >= 2 && users.length === 0 && (
          <div className="no-results">
            <p>No users found</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="users-list">
            {users.map((user) => (
              <div
                key={user._id}
                className="user-item"
                onClick={() => startChat(user._id)}
              >
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-status">
                    {user.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                  </div>
                </div>
                
                <button className="start-chat-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;

