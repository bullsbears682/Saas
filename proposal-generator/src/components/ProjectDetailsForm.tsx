import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProposalData } from '../types';

interface ProjectDetailsFormProps {
  register: UseFormRegister<ProposalData>;
  errors: FieldErrors<ProposalData>;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({ register, errors }) => {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Project Details
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="project.title" className="form-label">
            Project Title *
          </label>
          <input
            {...register('project.title', { required: 'Project title is required' })}
            type="text"
            className="form-input"
            placeholder="Website Redesign Project"
          />
          {errors.project?.title && (
            <p className="error-message">{errors.project.title.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="project.description" className="form-label">
            Project Description *
          </label>
          <textarea
            {...register('project.description', { required: 'Project description is required' })}
            rows={4}
            className="form-input form-textarea"
            placeholder="Brief overview of the project and its objectives..."
          />
          {errors.project?.description && (
            <p className="error-message">{errors.project.description.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="project.scope" className="form-label">
            Project Scope *
          </label>
          <textarea
            {...register('project.scope', { required: 'Project scope is required' })}
            rows={4}
            className="form-input form-textarea"
            placeholder="Detailed scope of work including what's included and excluded..."
          />
          {errors.project?.scope && (
            <p className="error-message">{errors.project.scope.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="form-group">
            <label htmlFor="project.timeline" className="form-label">
              Timeline *
            </label>
            <input
              {...register('project.timeline', { required: 'Timeline is required' })}
              type="text"
              className="form-input"
              placeholder="4-6 weeks"
            />
            {errors.project?.timeline && (
              <p className="error-message">{errors.project.timeline.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="project.currency" className="form-label">
              Currency
            </label>
            <select
              {...register('project.currency')}
              className="form-input form-select"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="project.deliverables" className="form-label">
            Deliverables *
          </label>
          <textarea
            {...register('project.deliverables', { required: 'Deliverables are required' })}
            rows={4}
            className="form-input form-textarea"
            placeholder="List of specific deliverables the client will receive..."
          />
          {errors.project?.deliverables && (
            <p className="error-message">{errors.project.deliverables.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="project.price" className="form-label">
            Total Price *
          </label>
          <input
            {...register('project.price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            type="number"
            step="0.01"
            className="form-input"
            placeholder="5000"
          />
          {errors.project?.price && (
            <p className="error-message">{errors.project.price.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};