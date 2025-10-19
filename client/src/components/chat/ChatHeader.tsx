import React from 'react';
import './ChatHeader.css';

interface ChatHeaderProps {
  chat: any;
  onBack?: () => void;
  isMobile: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBack, isMobile }) => {
  const getChatName = () => {
    if (!chat) return 'Loading...';
    
    if (chat.isGroup) {
      return chat.groupName || 'Group Chat';
    }
    
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants?.find((p: any) => p._id !== localStorage.getItem('userId'));
    return otherParticipant?.username || 'Unknown User';
  };

  const getChatAvatar = () => {
    if (!chat) return null;
    
    if (chat.isGroup) {
      return chat.groupAvatar;
    }
    
    // For direct chats, show the other participant's avatar
    const otherParticipant = chat.participants?.find((p: any) => p._id !== localStorage.getItem('userId'));
    return otherParticipant?.avatar;
  };

  const getChatStatus = () => {
    if (!chat) return 'Loading...';
    
    if (chat.isGroup) {
      return `${chat.participants?.length || 0} participants`;
    }
    
    // For direct chats, show the other participant's status
    const otherParticipant = chat.participants?.find((p: any) => p._id !== localStorage.getItem('userId'));
    if (otherParticipant?.status === 'online') {
      return 'Online';
    } else if (otherParticipant?.lastSeen) {
      const lastSeen = new Date(otherParticipant.lastSeen);
      const now = new Date();
      const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInMinutes < 1440) { // 24 hours
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      } else {
        return `Last seen ${lastSeen.toLocaleDateString()}`;
      }
    }
    
    return 'Offline';
  };

  return (
    <div className="chat-header">
      {isMobile && onBack && (
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      )}
      
      <div className="chat-info">
        <div className="chat-avatar">
          {getChatAvatar() ? (
            <img src={getChatAvatar()} alt={getChatName()} />
          ) : (
            <span>{getChatName().charAt(0).toUpperCase()}</span>
          )}
        </div>
        
        <div className="chat-details">
          <div className="chat-name">{getChatName()}</div>
          <div className="chat-status">{getChatStatus()}</div>
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="action-button" title="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        
        <button className="action-button" title="Call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        
        <button className="action-button" title="Video Call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </button>
        
        <div className="dropdown">
          <button className="action-button" title="More">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          <div className="dropdown-content">
            <button className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              View Contact
            </button>
            <button className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Media, Links & Docs
            </button>
            <button className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Search
            </button>
            <button className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Mute Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

