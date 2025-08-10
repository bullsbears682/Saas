import React from 'react';
import { PDFTemplate } from '../types/templates';

interface TemplatePreviewProps {
  template: PDFTemplate;
  primaryColor: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, primaryColor }) => {
  const getPreviewStyle = () => {
    const baseStyle = {
      width: '100%',
      height: '120px',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      backgroundColor: 'white',
      position: 'relative' as const,
      overflow: 'hidden' as const
    };

    switch (template) {
      case 'modern':
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom, ${primaryColor} 25%, #f8fafc 25%)`
        };
      case 'corporate':
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom, #1f2937 20%, #f5f5f5 20%, #f5f5f5 35%, white 35%)`
        };
      case 'creative':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${primaryColor} 40%, #f3f4f6 40%)`
        };
      case 'minimal':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          borderTop: `2px solid ${primaryColor}`
        };
      default:
        return baseStyle;
    }
  };

  const getContentPreview = () => {
    switch (template) {
      case 'modern':
        return (
          <>
            <div style={{
              color: 'white',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              paddingTop: '0.25rem'
            }}>
              COMPANY NAME
            </div>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '0.25rem',
              marginBottom: '0.25rem',
              fontSize: '0.5rem',
              fontWeight: 'bold',
              color: primaryColor
            }}>
              PROJECT PROPOSAL
            </div>
            <div style={{ fontSize: '0.375rem', marginBottom: '0.25rem' }}>
              Client Information
            </div>
            <div style={{ fontSize: '0.375rem', marginBottom: '0.25rem' }}>
              Project Details
            </div>
          </>
        );
      case 'corporate':
        return (
          <>
            <div style={{
              color: 'white',
              fontSize: '0.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              COMPANY NAME
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              border: '1px solid #d1d5db',
              padding: '0.25rem',
              marginBottom: '0.25rem',
              fontSize: '0.5rem',
              fontWeight: 'bold',
              textAlign: 'center' as const
            }}>
              BUSINESS PROPOSAL
            </div>
            <div style={{
              backgroundColor: '#fafafa',
              border: '1px solid #d1d5db',
              padding: '0.25rem',
              fontSize: '0.375rem'
            }}>
              📋 EXECUTIVE SUMMARY
            </div>
          </>
        );
      case 'creative':
        return (
          <>
            <div style={{
              color: 'white',
              fontSize: '0.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              COMPANY
            </div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: primaryColor,
              marginBottom: '0.25rem'
            }}>
              PROJECT
            </div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: primaryColor
            }}>
              PROPOSAL
            </div>
            <div style={{
              backgroundColor: `${primaryColor}20`,
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.375rem',
              marginTop: '0.5rem'
            }}>
              Project Title
            </div>
          </>
        );
      case 'minimal':
        return (
          <>
            <div style={{
              fontSize: '0.5rem',
              color: '#6b7280',
              marginBottom: '1rem',
              marginTop: '0.5rem'
            }}>
              COMPANY NAME
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 'normal',
              marginBottom: '0.25rem'
            }}>
              Proposal
            </div>
            <div style={{
              fontSize: '0.5rem',
              color: '#6b7280',
              borderBottom: `1px solid ${primaryColor}`,
              paddingBottom: '0.25rem',
              marginBottom: '0.5rem'
            }}>
              Project Title
            </div>
            <div style={{ fontSize: '0.375rem', color: '#9ca3af' }}>
              Client Information
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={getPreviewStyle()}>
      {getContentPreview()}
    </div>
  );
};