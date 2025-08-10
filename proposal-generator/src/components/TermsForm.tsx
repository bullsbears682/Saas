import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProposalData } from '../types';

interface TermsFormProps {
  register: UseFormRegister<ProposalData>;
  errors: FieldErrors<ProposalData>;
}

export const TermsForm: React.FC<TermsFormProps> = ({ register, errors }) => {
  const defaultTerms = `Payment Terms:
• 50% deposit required to begin work
• Remaining 50% due upon project completion
• Payment due within 30 days of invoice

Project Terms:
• All work will be completed according to the agreed timeline
• Client feedback and approvals required at key milestones
• Additional work outside the defined scope will be quoted separately
• This proposal is valid for 30 days from the date issued

Intellectual Property:
• All work products will be transferred to the client upon full payment
• Client owns all rights to the final deliverables
• Any third-party assets used will be properly licensed`;

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Terms & Conditions
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="terms" className="form-label">
            Terms and Conditions *
          </label>
          <textarea
            {...register('terms', { required: 'Terms and conditions are required' })}
            rows={12}
            className="form-input form-textarea"
            placeholder={defaultTerms}
            defaultValue={defaultTerms}
          />
          {errors.terms && (
            <p className="error-message">{errors.terms.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="validUntil" className="form-label">
            Proposal Valid Until *
          </label>
          <input
            {...register('validUntil', { required: 'Valid until date is required' })}
            type="date"
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.validUntil && (
            <p className="error-message">{errors.validUntil.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};