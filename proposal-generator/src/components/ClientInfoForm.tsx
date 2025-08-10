import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProposalData } from '../types';

interface ClientInfoFormProps {
  register: UseFormRegister<ProposalData>;
  errors: FieldErrors<ProposalData>;
}

export const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ register, errors }) => {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Client Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="form-group">
          <label htmlFor="client.name" className="form-label">
            Client Name *
          </label>
          <input
            {...register('client.name', { required: 'Client name is required' })}
            type="text"
            className="form-input"
            placeholder="John Doe"
          />
          {errors.client?.name && (
            <p className="error-message">{errors.client.name.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="client.company" className="form-label">
            Company Name
          </label>
          <input
            {...register('client.company')}
            type="text"
            className="form-input"
            placeholder="Acme Corp"
          />
        </div>

        <div className="form-group">
          <label htmlFor="client.email" className="form-label">
            Email Address *
          </label>
          <input
            {...register('client.email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="form-input"
            placeholder="john@example.com"
          />
          {errors.client?.email && (
            <p className="error-message">{errors.client.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="client.phone" className="form-label">
            Phone Number
          </label>
          <input
            {...register('client.phone')}
            type="tel"
            className="form-input"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="client.address" className="form-label">
            Address
          </label>
          <textarea
            {...register('client.address')}
            rows={3}
            className="form-input form-textarea"
            placeholder="123 Main St, City, State 12345"
          />
        </div>
      </div>
    </div>
  );
};