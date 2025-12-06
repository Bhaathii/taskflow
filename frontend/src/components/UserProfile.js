import React from 'react';
import { LogOut, User } from 'lucide-react';

function UserProfile({ user, onLogout }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '12px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #667eea'
            }}
          />
        )}
        <div>
          <div style={{ fontWeight: '600', color: '#333' }}>{user.name}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.email}</div>
        </div>
      </div>
      <button
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = '#ee5a52'}
        onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
