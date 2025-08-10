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
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #fbbf24'
      }}>
        <strong>To enable full functionality:</strong> Set up Firebase configuration in your environment variables.
        <br />
        See <code>BUSINESS_SETUP.md</code> for detailed instructions.
      </div>
    </div>
  );
};