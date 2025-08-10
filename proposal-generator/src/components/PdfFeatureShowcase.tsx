import React from 'react';
import { SubscriptionManager } from '../utils/subscriptionManager';

export const PdfFeatureShowcase: React.FC = () => {
  const plan = SubscriptionManager.getCurrentPlan();
  const isPaid = plan.id !== 'free';

  const features = [
    {
      title: 'Professional Cover Pages',
      description: 'Branded cover pages with company logo and professional styling',
      available: isPaid,
      icon: '📄'
    },
    {
      title: 'Table of Contents',
      description: 'Automatically generated table of contents with page numbers',
      available: isPaid,
      icon: '📑'
    },
    {
      title: 'Executive Summary',
      description: 'Professional executive summary with key project highlights',
      available: isPaid,
      icon: '📋'
    },
    {
      title: 'Project Charts & Graphs',
      description: 'Visual breakdown charts showing project phases and allocation',
      available: isPaid,
      icon: '📊'
    },
    {
      title: 'ROI Analysis',
      description: 'Detailed return on investment calculations and projections',
      available: isPaid,
      icon: '💹'
    },
    {
      title: 'QR Code Contact Cards',
      description: 'Scannable QR codes for instant contact information sharing',
      available: isPaid,
      icon: '📱'
    },
    {
      title: 'Portfolio Showcase',
      description: 'Previous work examples and success stories',
      available: isPaid,
      icon: '🖼️'
    },
    {
      title: 'Client Testimonials',
      description: 'Professional testimonials to build trust and credibility',
      available: isPaid,
      icon: '💬'
    },
    {
      title: 'Signature Pages',
      description: 'Ready-to-sign contract pages with signature blocks',
      available: isPaid,
      icon: '✍️'
    },
    {
      title: 'Enhanced Typography',
      description: 'Professional fonts, spacing, and layout optimization',
      available: true,
      icon: '🎨'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🚀 Premium PDF Features
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              border: feature.available ? '1px solid #d1fae5' : '1px solid #fed7d7',
              borderRadius: '0.375rem',
              padding: '1rem',
              opacity: feature.available ? 1 : 0.7
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                {feature.icon}
              </span>
              <h4 style={{ 
                margin: 0, 
                fontSize: '0.875rem', 
                fontWeight: 'bold',
                color: feature.available ? '#059669' : '#dc2626'
              }}>
                {feature.title}
              </h4>
              {feature.available ? (
                <span style={{ 
                  marginLeft: 'auto', 
                  color: '#10b981', 
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  ✓
                </span>
              ) : (
                <span style={{ 
                  marginLeft: 'auto', 
                  color: '#f59e0b', 
                  fontSize: '0.625rem',
                  backgroundColor: '#fef3c7',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.25rem'
                }}>
                  PREMIUM
                </span>
              )}
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        backgroundColor: isPaid ? '#ecfdf5' : '#fffbeb',
        border: isPaid ? '1px solid #a7f3d0' : '1px solid #fed7aa',
        borderRadius: '0.5rem',
        padding: '1rem',
        textAlign: 'center'
      }}>
        {isPaid ? (
          <>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#065f46' }}>
              🎉 You have access to all premium PDF features!
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#047857' }}>
              Your proposals will include cover pages, charts, ROI analysis, QR codes, and signature pages.
            </p>
          </>
        ) : (
          <>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#92400e' }}>
              🔓 Unlock Ultra-Premium PDFs
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem' }}>
              Get access to charts, ROI analysis, cover pages, QR codes, and 6 more premium features.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Starting at $19/month
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};