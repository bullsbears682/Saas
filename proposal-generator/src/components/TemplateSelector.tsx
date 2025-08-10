import React, { useState } from 'react';
import { PDFTemplate, PDF_TEMPLATES } from '../types/templates';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { TemplatePreview } from './TemplatePreview';

interface TemplateSelectorProps {
  selectedTemplate: PDFTemplate;
  onTemplateChange: (template: PDFTemplate) => void;
  onUpgrade: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onTemplateChange, 
  onUpgrade 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const plan = SubscriptionManager.getCurrentPlan();
  const canAccessPremiumTemplates = plan.id !== 'free';

  const selectedTemplateConfig = PDF_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        PDF Template Selection
      </h2>

      {/* Current Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="form-label">Selected Template</label>
        <div style={{
          border: '2px solid #3b82f6',
          borderRadius: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1f2937' }}>
                {selectedTemplateConfig?.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                {selectedTemplateConfig?.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem' }}
            >
              {isExpanded ? 'Hide Options' : 'Change Template'}
            </button>
          </div>
        </div>
      </div>

      {/* Template Options */}
      {isExpanded && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            {PDF_TEMPLATES.map((template) => {
              const isSelected = template.id === selectedTemplate;
              const isLocked = template.isPremium && !canAccessPremiumTemplates;
              
              return (
                <div
                  key={template.id}
                  style={{
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    backgroundColor: isSelected ? '#f0f9ff' : 'white',
                    opacity: isLocked ? 0.6 : 1,
                    position: 'relative',
                    cursor: isLocked ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => {
                    if (!isLocked) {
                      onTemplateChange(template.id);
                      setIsExpanded(false);
                    } else {
                      onUpgrade();
                    }
                  }}
                >
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: isLocked ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.625rem',
                      fontWeight: '600'
                    }}>
                      {isLocked ? 'PREMIUM' : 'UNLOCKED'}
                    </div>
                  )}

                  {/* Template Preview */}
                  <div style={{
                    height: '80px',
                    marginBottom: '0.75rem',
                    position: 'relative'
                  }}>
                    <TemplatePreview 
                      template={template.id} 
                      primaryColor={template.id === 'modern' ? '#3b82f6' :
                                   template.id === 'corporate' ? '#1f2937' :
                                   template.id === 'creative' ? '#7c3aed' : '#000000'} 
                    />
                    
                    {isLocked && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '3rem',
                        height: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        🔒
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <h4 style={{ 
                    margin: 0, 
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: isSelected ? '#3b82f6' : '#1f2937'
                  }}>
                    {template.name}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {template.description}
                  </p>

                  {/* Features */}
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    fontSize: '0.625rem',
                    color: '#9ca3af'
                  }}>
                    {template.features.slice(0, 2).map((feature, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        • {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Lock Overlay for Premium */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      textAlign: 'center',
                      fontSize: '0.625rem',
                      fontWeight: '600'
                    }}>
                      Upgrade to Unlock
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upgrade Prompt for Free Users */}
          {!canAccessPremiumTemplates && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fed7aa',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#f59e0b' }}>
                🚀 Unlock Premium Templates
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem' }}>
                Get access to Corporate, Creative, and Minimal templates with Starter plan
              </p>
              <button
                type="button"
                onClick={onUpgrade}
                className="btn btn-primary"
              >
                Upgrade to Starter - $19/month
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};