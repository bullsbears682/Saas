import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProposalData } from './types';
import { ClientInfoForm } from './components/ClientInfoForm';
import { ProjectDetailsForm } from './components/ProjectDetailsForm';
import { BrandingForm } from './components/BrandingForm';
import { TermsForm } from './components/TermsForm';
import { PricingPage } from './components/PricingPage';
import { UsageDisplay } from './components/UsageDisplay';
import { TemplateSelector } from './components/TemplateSelector';
import { PdfFeatureShowcase } from './components/PdfFeatureShowcase';
import { StyledPdfShowcase } from './components/StyledPdfShowcase';
import { PdfStyleComparison } from './components/PdfStyleComparison';
import { DemoNotice } from './components/DemoNotice';
import { DemoFeatures } from './components/DemoFeatures';
import { DemoAuthModal } from './components/DemoAuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthModal } from './components/AuthModal';
import { UserHeader } from './components/UserHeader';
import { ProposalDashboard } from './components/ProposalDashboard';
import { useAuth } from './hooks/useAuth';
import { isFirebaseConfigured } from './config/firebase';
import { proposalService, SavedProposal } from './services/proposalService';
import { generateEnhancedProposalPDF } from './utils/enhancedPdfGenerator';

import { generateStyledPDF } from './utils/styledPdfGenerator';
import { PDFTemplate } from './types/templates';
import { sampleProposalData } from './data/sampleData';
import { SubscriptionManager } from './utils/subscriptionManager';
import { createCheckoutSession } from './utils/stripeConfig';
import { SubscriptionTier } from './types/subscription';
import './App.css';

type FormStep = 'client' | 'project' | 'branding' | 'template' | 'terms' | 'preview';
type AppView = 'form' | 'dashboard' | 'auth' | 'pricing';

function App() {
  const [currentStep, setCurrentStep] = useState<FormStep>('client');
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate>('modern');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [editingProposal, setEditingProposal] = useState<SavedProposal | null>(null);
  
  const { user, loading: authLoading } = useAuth();

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
    { key: 'template', title: 'Template', description: 'Choose PDF style' },
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
      
      // Use new styled generator for the best experience
      const currentPlan = SubscriptionManager.getCurrentPlan();
      if (currentPlan.id !== 'free') {
        await generateStyledPDF(data, selectedTemplate); // New styled generator for paid users
      } else {
        generateEnhancedProposalPDF(data, selectedTemplate); // Enhanced for free users
      }
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

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    setShowPricing(false);
    await createCheckoutSession(tier);
  };

  const handleShowPricing = () => {
    setShowPricing(true);
    setCurrentView('pricing');
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  const handleShowDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleCreateNewProposal = () => {
    setEditingProposal(null);
    setCurrentView('form');
    setCurrentStep('client');
    reset(); // Reset form
  };

  const handleEditProposal = (proposal: SavedProposal) => {
    setEditingProposal(proposal);
    setCurrentView('form');
    setCurrentStep('client');
    setSelectedTemplate(proposal.template as PDFTemplate);
    
    // Load proposal data into form
    reset(proposal.data);
  };

  const handleSaveProposal = async (data: ProposalData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (editingProposal) {
        await proposalService.updateProposal(editingProposal.id, data, selectedTemplate);
        alert('Proposal updated successfully!');
      } else {
        await proposalService.saveProposal(user.uid, data, selectedTemplate);
        alert('Proposal saved successfully!');
      }
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save proposal. Please try again.');
    }
  };

  // Update usage display when component mounts
  useEffect(() => {
    // Force re-render of usage display
    const timer = setTimeout(() => {
      // This ensures the usage display updates after initial render
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check if user can access branding features
  const canUseBranding = SubscriptionManager.hasFeature('customBranding');
  const canUploadLogo = SubscriptionManager.hasFeature('logoUpload');

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'client':
        return <ClientInfoForm register={register} errors={errors} />;
      case 'project':
        return <ProjectDetailsForm register={register} errors={errors} />;
              case 'branding':
          return <BrandingForm 
            register={register} 
            errors={errors} 
            setValue={setValue}
            canUseBranding={canUseBranding}
            canUploadLogo={canUploadLogo}
            onUpgrade={handleShowPricing}
          />;
        case 'template':
          return <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            onUpgrade={handleShowPricing}
          />;
        case 'terms':
          return <TermsForm register={register} errors={errors} />;
      case 'preview':
        return <ProposalPreview 
          data={watchedData} 
          selectedTemplate={selectedTemplate}
          onChangeTemplate={() => setCurrentStep('template')}
        />;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <LoadingSpinner />
        <p>Loading ProposalPro...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <UserHeader 
          onShowAuth={handleShowAuth}
          onShowDashboard={handleShowDashboard}
          onShowPricing={handleShowPricing}
        />
        
        {/* Demo Notice */}
        <DemoNotice />
        
        {/* Demo Features Guide */}
        <DemoFeatures 
          onLoadSample={loadSampleData}
          onShowPricing={handleShowPricing}
        />

      {/* Render Dashboard if user is logged in and currentView is dashboard */}
      {currentView === 'dashboard' && user && (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <ProposalDashboard 
            onCreateNew={handleCreateNewProposal}
            onEditProposal={handleEditProposal}
          />
        </div>
      )}

      {/* Render Form if currentView is form */}
      {currentView === 'form' && (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <header className="app-header">
          <h1>📄 Professional Proposal Generator</h1>
          <p>Create stunning business proposals in minutes</p>
          <button
            type="button"
            onClick={loadSampleData}
            className="btn btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.75rem' }}
          >
            Load Sample Data
          </button>
        </header>
        {/* Usage Display */}
        <UsageDisplay onUpgrade={handleShowPricing} />

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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {user && (
                  <button
                    type="button"
                    onClick={() => handleSaveProposal(watchedData)}
                    className="btn btn-secondary"
                    disabled={isGenerating}
                  >
                    💾 Save Proposal
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isGenerating || !isValid}
                  className="btn btn-primary btn-lg"
                  style={{ 
                    opacity: isGenerating || !isValid ? 0.5 : 1,
                    position: 'relative'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner />
                      Generating {canUseBranding ? 'Professional Styled' : 'Enhanced'} PDF...
                    </>
                  ) : (
                    <>
                                              📄 Download {canUseBranding ? 'Professional Styled' : 'Enhanced'} PDF
                      {canUseBranding && (
                                                  <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontSize: '0.625rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            STYLED
                          </span>
                      )}
                    </>
                  )}
                </button>
              </div>
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
      )}

      {/* Auth Modal - Real auth when Firebase configured, demo modal otherwise */}
      {isFirebaseConfigured ? (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      ) : (
        <DemoAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onShowPricing={handleShowPricing}
        />
      )}

      {/* Pricing Modal */}
      {showPricing && (
        <PricingPage
          onSelectPlan={handleSelectPlan}
          onClose={() => {
            setShowPricing(false);
            setCurrentView(user ? 'dashboard' : 'form');
          }}
        />
      )}
      </div>
    </ErrorBoundary>
  );
}

// Preview Component
const ProposalPreview: React.FC<{ 
  data: Partial<ProposalData>; 
  selectedTemplate: PDFTemplate;
  onChangeTemplate: () => void;
}> = ({ data, selectedTemplate, onChangeTemplate }) => {
  const currentPlan = SubscriptionManager.getCurrentPlan();
  
  return (
    <div className="card">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Proposal Preview
        </h2>
        
        {/* Template Info */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
              📄 Using <strong>{selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</strong> template
              {selectedTemplate !== 'modern' && (
                <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>• Premium</span>
              )}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {selectedTemplate === 'corporate' && (currentPlan.id !== 'free' ? 
                'Ultra-Premium: Cover page, TOC, Charts, ROI analysis, QR codes, Signature page' : 
                'Premium features available with paid plans')}
              {selectedTemplate === 'creative' && (currentPlan.id !== 'free' ? 
                'Ultra-Premium: Artistic layouts, Charts, Portfolio showcase, Testimonials' : 
                'Premium features available with paid plans')}
              {selectedTemplate === 'minimal' && (currentPlan.id !== 'free' ? 
                'Ultra-Premium: Clean design with enhanced typography and contact cards' : 
                'Premium features available with paid plans')}
              {selectedTemplate === 'modern' && 'Enhanced: Professional layout, Color gradients, QR codes (paid plans)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onChangeTemplate}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            Change Template
                    </button>
        </div>

        {/* PDF Feature Showcase */}
        <PdfFeatureShowcase />
        
        {/* Styled PDF Showcase */}
        <StyledPdfShowcase />
        
        {/* PDF Style Comparison */}
        <PdfStyleComparison />
        
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
