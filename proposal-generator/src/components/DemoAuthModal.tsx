import React from 'react';
import { isFirebaseConfigured } from '../config/firebase';

interface DemoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowPricing: () => void;
}

export const DemoAuthModal: React.FC<DemoAuthModalProps> = ({ isOpen, onClose, onShowPricing }) => {
  if (!isOpen || isFirebaseConfigured) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
            Authentication in Demo Mode
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0' }}>
            You're currently running ProposalPro in demo mode
          </p>
        </div>

        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0c4a6e', margin: '0 0 1rem 0' }}>
            🎯 What You Can Do Right Now
          </h3>
          <ul style={{ 
            margin: '0',
            paddingLeft: '1.5rem',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            <li>✅ Generate professional PDFs with all templates</li>
            <li>✅ Test all premium styling features</li>
            <li>✅ Experience the complete workflow</li>
            <li>✅ See subscription features and pricing</li>
            <li>✅ Test mobile responsiveness</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#92400e', margin: '0 0 1rem 0' }}>
            🔧 To Enable User Accounts
          </h3>
          <ol style={{ 
            margin: '0',
            paddingLeft: '1.5rem',
            color: '#92400e',
            lineHeight: '1.6',
            fontSize: '0.875rem'
          }}>
            <li>Set up a Firebase project (free)</li>
            <li>Configure authentication settings</li>
            <li>Add environment variables</li>
            <li>Restart the application</li>
          </ol>
          <p style={{ 
            margin: '1rem 0 0 0',
            fontSize: '0.75rem',
            color: '#92400e',
            fontStyle: 'italic'
          }}>
            See <strong>BUSINESS_SETUP.md</strong> for detailed instructions
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onShowPricing}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          >
            💎 View Pro Features
          </button>
          
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          >
            Continue Demo
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          border: '1px solid #10b981',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#065f46',
            margin: '0',
            fontWeight: 'bold'
          }}>
            💡 <strong>Demo PDFs are identical to production quality!</strong>
            <br />
            Perfect for testing with clients and showcasing your capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};