import React from 'react';
import { SubscriptionManager } from '../utils/subscriptionManager';

export const StyledPdfShowcase: React.FC = () => {
  const plan = SubscriptionManager.getCurrentPlan();
  const isPaid = plan.id !== 'free';

  const styledFeatures = [
    {
      title: 'Professional Typography',
      description: 'Enhanced font hierarchy with optimal spacing and readability',
      available: true,
      icon: '🔤',
      category: 'Design'
    },
    {
      title: 'Gradient Backgrounds',
      description: 'Beautiful color gradients for headers and sections',
      available: isPaid,
      icon: '🎨',
      category: 'Design'
    },
    {
      title: 'Advanced Card Layouts',
      description: 'Professional cards with shadows, borders, and spacing',
      available: isPaid,
      icon: '🃏',
      category: 'Layout'
    },
    {
      title: 'Enhanced Color Palettes',
      description: 'Sophisticated color schemes for each template style',
      available: isPaid,
      icon: '🌈',
      category: 'Design'
    },
    {
      title: 'Professional Icons & Badges',
      description: 'Custom icon badges with backgrounds and styling',
      available: isPaid,
      icon: '🏷️',
      category: 'Visual'
    },
    {
      title: 'Styled Progress Bars',
      description: 'Animated progress indicators for project metrics',
      available: isPaid,
      icon: '📊',
      category: 'Visual'
    },
    {
      title: 'Quote & Testimonial Boxes',
      description: 'Elegant quote boxes with accent borders and typography',
      available: isPaid,
      icon: '💬',
      category: 'Content'
    },
    {
      title: 'Enhanced Timelines',
      description: 'Professional timeline design with status indicators',
      available: isPaid,
      icon: '📅',
      category: 'Layout'
    },
    {
      title: 'Metric Dashboard Cards',
      description: 'Beautiful metric cards with icons and professional styling',
      available: isPaid,
      icon: '📈',
      category: 'Visual'
    },
    {
      title: 'Professional Callout Boxes',
      description: 'Styled information boxes with icons and color coding',
      available: isPaid,
      icon: '📢',
      category: 'Content'
    },
    {
      title: 'Advanced Table Styling',
      description: 'Professional tables with gradients and alternating rows',
      available: isPaid,
      icon: '📋',
      category: 'Layout'
    },
    {
      title: 'Enhanced Cover Pages',
      description: 'Stunning cover designs with artistic elements and branding',
      available: isPaid,
      icon: '🎭',
      category: 'Design'
    }
  ];

  const categories = ['Design', 'Layout', 'Visual', 'Content'];
  const categoryColors = {
    Design: '#3b82f6',
    Layout: '#10b981', 
    Visual: '#f59e0b',
    Content: '#8b5cf6'
  };

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
          🎨 Professional Styled PDFs
        </h3>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          {isPaid ? 
            'Your PDFs now feature enterprise-grade styling and design elements' :
            'Upgrade to unlock professional PDF styling and design features'
          }
        </p>
      </div>

      {/* Feature Categories */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {categories.map((category) => {
            const categoryFeatures = styledFeatures.filter(f => f.category === category);
            const availableCount = categoryFeatures.filter(f => f.available).length;
            
            return (
              <div
                key={category}
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: categoryColors[category as keyof typeof categoryColors],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  {availableCount}
                </div>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 0.25rem 0'
                }}>
                  {category}
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {availableCount}/{categoryFeatures.length} features
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {styledFeatures.map((feature, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              backgroundColor: feature.available ? '#f0fdf4' : '#f9fafb',
              border: `1px solid ${feature.available ? '#bbf7d0' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              opacity: feature.available ? 1 : 0.7,
              position: 'relative'
            }}
          >
            {/* Category badge */}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: categoryColors[feature.category as keyof typeof categoryColors],
              color: 'white',
              fontSize: '0.625rem',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: 'bold'
            }}>
              {feature.category}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                fontSize: '1.5rem',
                backgroundColor: feature.available ? '#dcfce7' : '#f3f4f6',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: `1px solid ${feature.available ? '#bbf7d0' : '#d1d5db'}`
              }}>
                {feature.icon}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: feature.available ? '#166534' : '#6b7280',
                    margin: 0
                  }}>
                    {feature.title}
                  </h4>
                  
                  {feature.available ? (
                    <span style={{
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      ✓ Active
                    </span>
                  ) : (
                    <span style={{
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      🔒 Pro
                    </span>
                  )}
                </div>
                
                <p style={{
                  fontSize: '0.75rem',
                  color: feature.available ? '#166534' : '#6b7280',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary and CTA */}
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: isPaid ? '#f0fdf4' : '#fffbeb',
        borderRadius: '0.5rem',
        border: `1px solid ${isPaid ? '#bbf7d0' : '#fed7aa'}`
      }}>
        {isPaid ? (
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#166534',
              marginBottom: '0.5rem'
            }}>
              🎉 Professional Styled PDFs Active!
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#166534',
              margin: 0
            }}>
              Your proposals now feature enterprise-grade styling with advanced design elements, 
              professional typography, and sophisticated visual layouts that rival $500+/month tools!
            </p>
          </div>
        ) : (
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#92400e',
              marginBottom: '0.5rem'
            }}>
              ✨ Unlock Professional Styled PDFs
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#92400e',
              marginBottom: '1rem'
            }}>
              Get access to enterprise-grade PDF styling with gradients, professional cards, 
              enhanced typography, and sophisticated design elements.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#92400e'
            }}>
              <span>🎨 Advanced Design</span>
              <span>•</span>
              <span>📊 Professional Charts</span>
              <span>•</span>
              <span>🌈 Color Palettes</span>
              <span>•</span>
              <span>✨ Enhanced Layouts</span>
            </div>
          </div>
        )}
      </div>

      {/* Template Style Previews */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🎭 Template Style Previews
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { name: 'Corporate', color: '#1f2937', description: 'Professional gradients & metrics' },
            { name: 'Creative', color: '#7c3aed', description: 'Artistic layouts & colors' },
            { name: 'Modern', color: '#3b82f6', description: 'Clean cards & typography' },
            { name: 'Minimal', color: '#000000', description: 'Elegant simplicity' }
          ].map((template) => (
            <div
              key={template.name}
              style={{
                padding: '1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                textAlign: 'center',
                opacity: isPaid ? 1 : 0.6
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: template.color,
                borderRadius: '0.5rem',
                margin: '0 auto 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {template.name[0]}
              </div>
              <h5 style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 0.25rem 0'
              }}>
                {template.name}
              </h5>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                {template.description}
              </p>
              {!isPaid && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.625rem',
                  color: '#f59e0b',
                  fontWeight: 'bold'
                }}>
                  🔒 PRO ONLY
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};