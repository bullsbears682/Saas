import React from 'react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';
import { SubscriptionManager } from '../utils/subscriptionManager';

interface PricingPageProps {
  onSelectPlan: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, onClose }) => {
  const currentPlan = SubscriptionManager.getCurrentPlan();

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      SubscriptionManager.upgradeTo(tier);
      onClose();
    } else {
      onSelectPlan(tier);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Choose Your Plan
          </h2>
          <p style={{ color: '#6b7280' }}>
            Select the plan that best fits your proposal generation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                border: plan.id === currentPlan.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                backgroundColor: plan.id === 'starter' ? '#f8fafc' : 'white',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              {/* Popular Badge */}
              {plan.id === 'starter' && (
                <div style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.id === currentPlan.id && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Current
                </div>
              )}

              {/* Plan Details */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {plan.name}
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  ${plan.price}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  /month
                </span>
              </div>

              {/* Features */}
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ 
                      color: '#10b981', 
                      marginRight: '0.5rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.id === currentPlan.id}
                className="btn"
                style={{
                  width: '100%',
                  backgroundColor: plan.id === currentPlan.id ? '#e5e7eb' : 
                                   plan.id === 'starter' ? '#3b82f6' : '#374151',
                  color: plan.id === currentPlan.id ? '#6b7280' : 'white',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: plan.id === currentPlan.id ? 'not-allowed' : 'pointer'
                }}
              >
                {plan.id === currentPlan.id ? 'Current Plan' :
                 plan.id === 'free' ? 'Downgrade to Free' : 
                 `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 2rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};