import React from 'react';
import { SubscriptionManager } from '../utils/subscriptionManager';

interface UsageDisplayProps {
  onUpgrade: () => void;
}

export const UsageDisplay: React.FC<UsageDisplayProps> = ({ onUpgrade }) => {
  const plan = SubscriptionManager.getCurrentPlan();
  const usage = SubscriptionManager.getCurrentUsage();
  const { remaining, limit } = SubscriptionManager.canGenerateProposal();
  
  const usagePercentage = ((usage.proposalsGenerated / limit) * 100);
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining === 0;

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
            {plan.name} Plan
          </h3>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            margin: 0,
            marginTop: '0.25rem'
          }}>
            {plan.price > 0 ? `$${plan.price}/month` : 'Free forever'}
          </p>
        </div>
        
        {plan.id === 'free' && (
          <button
            onClick={onUpgrade}
            className="btn btn-primary"
            style={{ 
              fontSize: '0.75rem',
              padding: '0.5rem 1rem'
            }}
          >
            Upgrade
          </button>
        )}
      </div>

      {/* Usage Bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.25rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#374151' }}>
            Proposals this month
          </span>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: '600',
            color: isAtLimit ? '#dc2626' : isNearLimit ? '#f59e0b' : '#374151'
          }}>
            {usage.proposalsGenerated} / {limit === 999999 ? '∞' : limit}
          </span>
        </div>
        
        {limit < 999999 && (
          <div style={{
            width: '100%',
            height: '0.5rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '0.25rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(usagePercentage, 100)}%`,
              height: '100%',
              backgroundColor: isAtLimit ? '#dc2626' : isNearLimit ? '#f59e0b' : '#3b82f6',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
      </div>

      {/* Status Messages */}
      {isAtLimit && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.25rem',
          padding: '0.5rem',
          marginTop: '0.5rem'
        }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#dc2626', 
            margin: 0,
            textAlign: 'center'
          }}>
            ⚠️ You've reached your monthly limit. Upgrade to continue generating proposals.
          </p>
        </div>
      )}
      
      {isNearLimit && !isAtLimit && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          borderRadius: '0.25rem',
          padding: '0.5rem',
          marginTop: '0.5rem'
        }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#f59e0b', 
            margin: 0,
            textAlign: 'center'
          }}>
            💡 Almost at your limit! Consider upgrading for unlimited proposals.
          </p>
        </div>
      )}
    </div>
  );
};