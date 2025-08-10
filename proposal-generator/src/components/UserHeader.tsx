import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionManager } from '../utils/subscriptionManager';

interface UserHeaderProps {
  onShowAuth: () => void;
  onShowDashboard: () => void;
  onShowPricing: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onShowAuth, onShowDashboard, onShowPricing }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const currentPlan = SubscriptionManager.getCurrentPlan();

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
          📄 ProposalPro
        </h1>
        {user && (
          <button
            onClick={onShowDashboard}
            className="btn btn-secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            📋 Dashboard
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            {/* Plan Badge */}
            <div style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: currentPlan.id === 'free' ? '#fef3c7' : 
                             currentPlan.id === 'starter' ? '#dbeafe' : '#dcfce7',
              color: currentPlan.id === 'free' ? '#92400e' : 
                     currentPlan.id === 'starter' ? '#1e40af' : '#166534',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {currentPlan.id === 'free' ? '🆓 FREE' : 
               currentPlan.id === 'starter' ? '⭐ STARTER' : '💎 PROFESSIONAL'}
            </div>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span>{user.displayName || user.email?.split('@')[0] || 'User'}</span>
                <span style={{ fontSize: '0.75rem' }}>▼</span>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                  minWidth: '200px',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {user.displayName || 'User'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                      {user.email}
                    </p>
                  </div>
                  
                  <div style={{ padding: '0.5rem' }}>
                    <button
                      onClick={() => {
                        onShowDashboard();
                        setShowDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      📋 My Proposals
                    </button>
                    
                    <button
                      onClick={() => {
                        onShowPricing();
                        setShowDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      💎 Upgrade Plan
                    </button>
                    
                    <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#dc2626'
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onShowAuth}
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Sign In
            </button>
            <button
              onClick={onShowPricing}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              💎 Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};