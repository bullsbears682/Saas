import React, { useState } from 'react';
import { SubscriptionManager } from '../utils/subscriptionManager';

export const PdfStyleComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  const plan = SubscriptionManager.getCurrentPlan();
  const isPaid = plan.id !== 'free';

  const beforeFeatures = [
    'Basic text formatting',
    'Simple black and white layout',
    'Standard spacing',
    'Plain headers',
    'Basic tables',
    'No visual elements'
  ];

  const afterFeatures = [
    'Professional typography hierarchy',
    'Gradient backgrounds and colors',
    'Optimized spacing and layout',
    'Styled headers with icons',
    'Enhanced tables with alternating rows',
    'Cards, badges, and visual elements'
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '2rem',
      margin: '1.5rem 0',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          ⚡ PDF Style Transformation
        </h3>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          See the dramatic difference professional styling makes
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('before')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: activeTab === 'before' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: activeTab === 'before' ? '#1f2937' : '#6b7280',
            cursor: 'pointer',
            boxShadow: activeTab === 'before' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          📄 Basic PDFs (Free)
        </button>
        <button
          onClick={() => setActiveTab('after')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: activeTab === 'after' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: activeTab === 'after' ? '#1f2937' : '#6b7280',
            cursor: 'pointer',
            boxShadow: activeTab === 'after' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          ✨ Styled PDFs (Pro)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'before' ? (
        <div>
          {/* Basic PDF Preview */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            fontFamily: 'monospace'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#000' }}>
                PROPOSAL
              </h4>
              <hr style={{ border: '1px solid #ccc', margin: '1rem 0' }} />
              <p style={{ fontSize: '0.875rem', color: '#333', margin: '0.5rem 0' }}>
                Client: ABC Company
              </p>
              <p style={{ fontSize: '0.875rem', color: '#333', margin: '0.5rem 0' }}>
                Project: Website Development
              </p>
              <p style={{ fontSize: '0.875rem', color: '#333', margin: '0.5rem 0' }}>
                Amount: $5,000
              </p>
              <hr style={{ border: '1px solid #ccc', margin: '1rem 0' }} />
              <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.5rem 0' }}>
                Basic text content with minimal formatting...
              </p>
            </div>
          </div>

          {/* Basic Features List */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6b7280' }}>
              📝 Basic PDF Features
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {beforeFeatures.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.25rem'
                }}>
                  <span style={{ color: '#9ca3af' }}>○</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Styled PDF Preview */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '2px solid #3b82f6',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            color: 'white'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}>
              {/* Gradient Header */}
              <div style={{
                background: 'linear-gradient(90deg, #1f2937 0%, #3b82f6 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                  🏢 BUSINESS PROPOSAL
                </h4>
              </div>

              {/* Professional Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>$5,000</div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>💰 Investment</div>
                </div>
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>8-12 weeks</div>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>⏱️ Timeline</div>
                </div>
              </div>

              {/* Enhanced Content */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0.375rem',
                padding: '1rem'
              }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                  🎯 Project Overview
                </h5>
                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
                  Professional content with enhanced typography and visual hierarchy...
                </p>
              </div>
            </div>
          </div>

          {/* Styled Features List */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>
              ✨ Professional Styled Features
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {afterFeatures.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.375rem'
                }}>
                  <span style={{ color: '#10b981', fontSize: '1rem' }}>✨</span>
                  <span style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>{feature}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.625rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold'
                  }}>
                    NEW
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {!isPaid && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0.5rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            🚀 Transform Your PDFs Today!
          </h4>
          <p style={{
            fontSize: '0.875rem',
            marginBottom: '1rem',
            opacity: 0.9
          }}>
            Upgrade to unlock professional styling that makes your proposals stand out 
            and win more deals with enterprise-grade design.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.75rem',
            opacity: 0.8
          }}>
            <span>✨ Instant Upgrade</span>
            <span>•</span>
            <span>🎨 Professional Design</span>
            <span>•</span>
            <span>📈 Better Conversion</span>
          </div>
        </div>
      )}

      {/* Success Message for Paid Users */}
      {isPaid && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#166534',
            marginBottom: '0.5rem'
          }}>
            🎉 Professional Styling Active!
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: '#16a34a',
            margin: 0
          }}>
            Your PDFs now feature enterprise-grade styling that rivals $500+/month proposal software. 
            Generate a proposal to see the stunning transformation!
          </p>
        </div>
      )}
    </div>
  );
};