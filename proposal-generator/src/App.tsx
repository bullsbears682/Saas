import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProposalData } from './types';
import { ClientInfoForm } from './components/ClientInfoForm';
import { ProjectDetailsForm } from './components/ProjectDetailsForm';
import { BrandingForm } from './components/BrandingForm';
import { TermsForm } from './components/TermsForm';
import { generateProposalPDF } from './utils/pdfGenerator';
import { sampleProposalData } from './data/sampleData';
import './App.css';

type FormStep = 'client' | 'project' | 'branding' | 'terms' | 'preview';

function App() {
  const [currentStep, setCurrentStep] = useState<FormStep>('client');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
    trigger
  } = useForm<ProposalData>({
    mode: 'onChange',
    defaultValues: {
      project: {
        currency: 'USD'
      },
      branding: {
        primaryColor: '#3b82f6'
      },
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }
  });

  const watchedData = watch();

  const steps: { key: FormStep; title: string; description: string }[] = [
    { key: 'client', title: 'Client Info', description: 'Enter client details' },
    { key: 'project', title: 'Project Details', description: 'Define project scope' },
    { key: 'branding', title: 'Branding', description: 'Add your branding' },
    { key: 'terms', title: 'Terms', description: 'Set terms & conditions' },
    { key: 'preview', title: 'Preview', description: 'Review & generate' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const onSubmit = async (data: ProposalData) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      generateProposalPDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSampleData = () => {
    reset(sampleProposalData as ProposalData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'client':
        return <ClientInfoForm register={register} errors={errors} />;
      case 'project':
        return <ProjectDetailsForm register={register} errors={errors} />;
      case 'branding':
        return <BrandingForm register={register} errors={errors} setValue={setValue} />;
      case 'terms':
        return <TermsForm register={register} errors={errors} />;
      case 'preview':
        return <ProposalPreview data={watchedData} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Proposal Generator</h1>
          <p>Create professional project proposals in minutes</p>
          <button
            type="button"
            onClick={loadSampleData}
            className="btn btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.75rem' }}
          >
            Load Sample Data
          </button>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Progress Steps */}
        <div className="progress-nav">
          <nav aria-label="Progress">
            <ol className="progress-steps">
              {steps.map((step, index) => (
                <li key={step.key} className="progress-step">
                  <div className={`step-number ${index <= currentStepIndex ? 'active' : ''}`}>
                    {index + 1}
                  </div>
                  <div className="step-info">
                    <p className={`step-title ${index <= currentStepIndex ? 'active' : ''}`}>
                      {step.title}
                    </p>
                    <p className="step-description">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`step-line ${index < currentStepIndex ? 'completed' : ''}`} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`btn ${currentStepIndex === 0 ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ opacity: currentStepIndex === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>

            {currentStep === 'preview' ? (
              <button
                type="submit"
                disabled={isGenerating || !isValid}
                className="btn btn-primary btn-lg"
                style={{ opacity: isGenerating || !isValid ? 0.5 : 1 }}
              >
                {isGenerating ? 'Generating PDF...' : 'Download PDF Proposal'}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Preview Component
const ProposalPreview: React.FC<{ data: Partial<ProposalData> }> = ({ data }) => {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Proposal Preview
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.875rem' }}>
        {/* Header Preview */}
        <div className="preview-section">
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{data.branding?.companyName}</h3>
          <p style={{ color: '#6b7280' }}>{data.project?.title}</p>
        </div>

        {/* Client Info Preview */}
        <div>
          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Client Information</h4>
          <div className="preview-content">
            <p><strong>Name:</strong> {data.client?.name}</p>
            {data.client?.company && <p><strong>Company:</strong> {data.client.company}</p>}
            <p><strong>Email:</strong> {data.client?.email}</p>
            {data.client?.phone && <p><strong>Phone:</strong> {data.client.phone}</p>}
            {data.client?.address && <p><strong>Address:</strong> {data.client.address}</p>}
          </div>
        </div>

        {/* Project Preview */}
        <div>
          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Project Overview</h4>
          <div className="preview-content">
            <p><strong>Description:</strong> {data.project?.description}</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Timeline:</strong> {data.project?.timeline}</p>
            <p><strong>Investment:</strong> {data.project?.price && data.project?.currency ? 
              `${data.project.currency === 'USD' ? '$' : 
                data.project.currency === 'EUR' ? '€' : 
                data.project.currency === 'GBP' ? '£' : '$'}${data.project.price.toLocaleString()}` 
              : 'Not specified'}</p>
          </div>
        </div>

        {/* Terms Preview */}
        <div>
          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Terms Summary</h4>
          <div className="preview-content">
            <p><strong>Valid Until:</strong> {data.validUntil ? new Date(data.validUntil).toLocaleDateString() : 'Not specified'}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Full terms and conditions will be included in the PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
