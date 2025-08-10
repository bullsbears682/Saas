import React from 'react';
import { isFirebaseConfigured } from '../config/firebase';

export const DemoNotice: React.FC = () => {
  if (isFirebaseConfigured) {
    return null; // Don't show if Firebase is properly configured
  }

  return (
    <div style={{
      backgroundColor: '#fffbeb',
      border: '1px solid #fed7aa',
      borderRadius: '0.5rem',
      padding: '1rem',
      margin: '1rem',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '1.5rem',
        marginBottom: '0.5rem'
      }}>
        🚧 Demo Mode
      </div>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: '#92400e',
        margin: '0 0 0.5rem 0'
      }}>
        Running in Demo Mode
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: '#92400e',
        margin: '0 0 1rem 0'
      }}>
        Authentication and proposal saving are disabled. 
        You can still generate and download PDFs to test the functionality.
      </p>
      <div style={{
        fontSize: '0.75rem',
        color: '#92400e',
        backgroundColor: '#fef3c7',
        padding: '1rem',
        borderRadius: '0.375rem',
        border: '1px solid #fbbf24',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>🔥 Ready to enable user accounts and proposal saving?</strong>
        </div>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          Set up Firebase (free) to unlock the full business features!
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://console.firebase.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            🚀 Open Firebase Console
          </a>
          <button
            onClick={() => {
              // Create and click a link to the setup guide
              const link = document.createElement('a');
              link.href = '/FIREBASE_SETUP.md';
              link.target = '_blank';
              link.click();
            }}
            style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📖 Setup Guide
          </button>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', fontStyle: 'italic' }}>
          Takes only 10 minutes • Completely free • Instant user accounts
        </div>
      </div>
    </div>
  );
};