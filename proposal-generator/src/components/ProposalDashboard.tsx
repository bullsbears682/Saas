import React, { useState, useEffect } from 'react';
import { proposalService, SavedProposal } from '../services/proposalService';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProposalDashboardProps {
  onCreateNew: () => void;
  onEditProposal: (proposal: SavedProposal) => void;
}

export const ProposalDashboard: React.FC<ProposalDashboardProps> = ({ onCreateNew, onEditProposal }) => {
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userProposals = await proposalService.getUserProposals(user.uid);
      setProposals(userProposals);
    } catch (err) {
      setError('Failed to load proposals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (proposalId: string, newStatus: SavedProposal['status']) => {
    try {
      await proposalService.updateProposalStatus(proposalId, newStatus);
      await loadProposals(); // Refresh the list
    } catch (err) {
      setError('Failed to update proposal status');
      console.error(err);
    }
  };

  const handleDuplicate = async (proposalId: string) => {
    if (!user) return;
    
    try {
      await proposalService.duplicateProposal(proposalId, user.uid);
      await loadProposals(); // Refresh the list
    } catch (err) {
      setError('Failed to duplicate proposal');
      console.error(err);
    }
  };

  const handleDelete = async (proposalId: string) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    
    try {
      await proposalService.deleteProposal(proposalId);
      await loadProposals(); // Refresh the list
    } catch (err) {
      setError('Failed to delete proposal');
      console.error(err);
    }
  };

  const getStatusColor = (status: SavedProposal['status']) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'sent': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: SavedProposal['status']) => {
    switch (status) {
      case 'draft': return '📝';
      case 'sent': return '📤';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <LoadingSpinner />
        <p>Loading your proposals...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
            📋 Proposal Dashboard
          </h1>
          <p style={{ margin: 0, marginTop: '0.5rem', color: '#6b7280' }}>
            Manage your proposals and track their status
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
        >
          ➕ Create New Proposal
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {proposals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1f2937' }}>
            No proposals yet
          </h3>
          <p style={{ margin: 0, color: '#6b7280', marginBottom: '1.5rem' }}>
            Create your first proposal to get started
          </p>
          <button
            onClick={onCreateNew}
            className="btn btn-primary"
          >
            Create Your First Proposal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {proposal.title}
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      backgroundColor: getStatusColor(proposal.status) + '20',
                      color: getStatusColor(proposal.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getStatusIcon(proposal.status)} {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    <span>👤 {proposal.clientName}</span>
                    {proposal.clientCompany && <span>🏢 {proposal.clientCompany}</span>}
                    <span>💰 ${proposal.amount.toLocaleString()}</span>
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>📅 Created: {proposal.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                    <span style={{ marginLeft: '1rem' }}>
                      🎨 Template: {proposal.template.charAt(0).toUpperCase() + proposal.template.slice(1)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onEditProposal(proposal)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    ✏️ Edit
                  </button>
                  
                  <button
                    onClick={() => handleDuplicate(proposal.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    📋 Duplicate
                  </button>

                  <select
                    value={proposal.status}
                    onChange={(e) => handleStatusChange(proposal.id, e.target.value as SavedProposal['status'])}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="sent">📤 Sent</option>
                    <option value="approved">✅ Approved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(proposal.id)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.375rem',
                      color: '#dc2626',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {proposals.length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
            📊 Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {proposals.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Proposals</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {proposals.filter(p => p.status === 'approved').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                ${proposals.reduce((sum, p) => p.status === 'approved' ? sum + p.amount : sum, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Won Revenue</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                ${proposals.reduce((sum, p) => p.status === 'sent' ? sum + p.amount : sum, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};