import React, { useState } from 'react';
import { isFirebaseConfigured } from '../config/firebase';

interface DemoFeaturesProps {
  onLoadSample: () => void;
  onShowPricing: () => void;
}

export const DemoFeatures: React.FC<DemoFeaturesProps> = ({ onLoadSample, onShowPricing }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isFirebaseConfigured) {
    return null; // Don't show in production mode
  }

  return (
    <div style={{
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      margin: '1rem',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        marginBottom: '1rem'
      }}>
        🎯 Demo Features
      </div>
      
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#0c4a6e',
        margin: '0 0 1rem 0'
      }}>
        Try ProposalPro's Professional Features
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e0e7ff'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Professional PDFs
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>
            4 stunning templates with enterprise-grade styling
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e0e7ff'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Advanced Styling
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>
            Gradients, cards, charts, and professional typography
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e0e7ff'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Instant Generation
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>
            Download professional proposals in seconds
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '1rem'
      }}>
        <button
          onClick={onLoadSample}
          style={{
            backgroundColor: '#0ea5e9',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          🚀 Try Sample Proposal
        </button>
        
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
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: 'transparent',
          color: '#0ea5e9',
          border: '1px solid #0ea5e9',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}
      >
        {isExpanded ? '▲ Hide' : '▼ Show'} Demo Guide
      </button>

      {isExpanded && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e0e7ff',
          textAlign: 'left'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#0c4a6e',
            marginBottom: '1rem'
          }}>
            📋 Demo Guide - Test Everything!
          </h4>
          
          <ol style={{
            fontSize: '0.875rem',
            color: '#374151',
            paddingLeft: '1.5rem',
            margin: '0',
            lineHeight: '1.6'
          }}>
            <li><strong>Load Sample Data:</strong> Click "Try Sample Proposal" to auto-fill forms</li>
            <li><strong>Navigate Steps:</strong> Go through Client → Project → Branding → Terms → Preview</li>
            <li><strong>Try Templates:</strong> Switch between Modern, Corporate, Creative, Minimal</li>
            <li><strong>Generate PDFs:</strong> Download and see the professional styling</li>
            <li><strong>Test Subscription:</strong> Try upgrading to see premium features</li>
            <li><strong>View Showcases:</strong> Check the PDF feature comparisons</li>
          </ol>

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '0.375rem',
            border: '1px solid #10b981'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#065f46',
              margin: '0',
              fontWeight: 'bold'
            }}>
              💡 <strong>Pro Tip:</strong> The PDFs generated in demo mode are identical to production quality!
              Perfect for testing with clients and investors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};