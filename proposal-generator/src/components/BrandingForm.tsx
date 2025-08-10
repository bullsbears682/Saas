import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ProposalData } from '../types';

interface BrandingFormProps {
  register: UseFormRegister<ProposalData>;
  errors: FieldErrors<ProposalData>;
  setValue: UseFormSetValue<ProposalData>;
  canUseBranding: boolean;
  canUploadLogo: boolean;
  onUpgrade: () => void;
}

export const BrandingForm: React.FC<BrandingFormProps> = ({ 
  register, 
  errors, 
  setValue, 
  canUseBranding, 
  canUploadLogo, 
  onUpgrade 
}) => {
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('branding.logo', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setValue('branding.logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Branding & Your Information
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Your Information Section */}
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Your Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="branding.companyName" className="form-label">
                Your Company Name *
              </label>
              <input
                {...register('branding.companyName', { required: 'Company name is required' })}
                type="text"
                className="form-input"
                placeholder="Your Business Name"
              />
              {errors.branding?.companyName && (
                <p className="error-message">{errors.branding.companyName.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="branding.yourName" className="form-label">
                Your Name *
              </label>
              <input
                {...register('branding.yourName', { required: 'Your name is required' })}
                type="text"
                className="form-input"
                placeholder="Jane Smith"
              />
              {errors.branding?.yourName && (
                <p className="error-message">{errors.branding.yourName.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="branding.yourEmail" className="form-label">
                Your Email *
              </label>
              <input
                {...register('branding.yourEmail', { 
                  required: 'Your email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="form-input"
                placeholder="jane@yourbusiness.com"
              />
              {errors.branding?.yourEmail && (
                <p className="error-message">{errors.branding.yourEmail.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="branding.yourPhone" className="form-label">
                Your Phone
              </label>
              <input
                {...register('branding.yourPhone')}
                type="tel"
                className="form-input"
                placeholder="+1 (555) 987-6543"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="branding.yourAddress" className="form-label">
                Your Address
              </label>
              <textarea
                {...register('branding.yourAddress')}
                rows={3}
                className="form-input form-textarea"
                placeholder="456 Business Ave, City, State 12345"
              />
            </div>
          </div>
        </div>

        {/* Branding Section */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="form-group">
               <label htmlFor="branding.logo" className="form-label">
                 Company Logo
                 {!canUploadLogo && (
                   <span style={{ color: '#f59e0b', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                     (Starter+ feature)
                   </span>
                 )}
               </label>
               {canUploadLogo ? (
                 <div className="file-upload">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleLogoUpload}
                   />
                   <div className="file-upload-label">
                     Choose Logo File
                   </div>
                 </div>
               ) : (
                 <div style={{
                   border: '2px dashed #d1d5db',
                   borderRadius: '0.375rem',
                   padding: '2rem',
                   textAlign: 'center',
                   backgroundColor: '#f9fafb'
                 }}>
                   <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                     Logo upload is available in Starter and Professional plans
                   </p>
                   <button
                     type="button"
                     onClick={onUpgrade}
                     className="btn btn-primary"
                     style={{ fontSize: '0.875rem' }}
                   >
                     Upgrade to Upload Logo
                   </button>
                 </div>
               )}
               {logoPreview && canUploadLogo && (
                 <div style={{ marginTop: '1rem' }}>
                   <img src={logoPreview} alt="Logo preview" style={{ height: '4rem', width: 'auto', borderRadius: '0.25rem' }} />
                 </div>
               )}
             </div>

                         <div className="form-group">
               <label htmlFor="branding.primaryColor" className="form-label">
                 Primary Brand Color
                 {!canUseBranding && (
                   <span style={{ color: '#f59e0b', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                     (Starter+ feature)
                   </span>
                 )}
               </label>
               {canUseBranding ? (
                 <div className="color-input-group">
                   <input
                     {...register('branding.primaryColor')}
                     type="color"
                     className="color-input"
                     defaultValue="#3b82f6"
                   />
                   <input
                     {...register('branding.primaryColor')}
                     type="text"
                     className="form-input"
                     placeholder="#3b82f6"
                     style={{ flex: 1 }}
                   />
                 </div>
               ) : (
                 <div style={{
                   border: '2px dashed #d1d5db',
                   borderRadius: '0.375rem',
                   padding: '1.5rem',
                   textAlign: 'center',
                   backgroundColor: '#f9fafb'
                 }}>
                   <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                     Custom brand colors available in paid plans
                   </p>
                   <button
                     type="button"
                     onClick={onUpgrade}
                     className="btn btn-primary"
                     style={{ fontSize: '0.875rem' }}
                   >
                     Upgrade for Custom Branding
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};