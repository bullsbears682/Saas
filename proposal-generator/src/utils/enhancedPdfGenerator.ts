import jsPDF from 'jspdf';
import { ProposalData } from '../types';
import { PDFTemplate } from '../types/templates';
import { SubscriptionManager } from './subscriptionManager';
import { 
  addExecutiveSummary, 
  addProjectTimeline, 
  addInvestmentBreakdown, 
  addValueProposition, 
  addRiskMitigation 
} from './advancedPdfFeatures';
import { addPageNumbers, addCoverPage, addTableOfContents, hexToRgb } from './pdfHelpers';

export const generateEnhancedProposalPDF = (data: ProposalData, template: PDFTemplate = 'modern'): void => {
  // Check usage limits
  const canGenerate = SubscriptionManager.canGenerateProposal();
  if (!canGenerate.allowed) {
    alert(`You've reached your monthly limit of ${canGenerate.limit} proposals. Please upgrade your plan to continue.`);
    return;
  }

  const plan = SubscriptionManager.getCurrentPlan();
  const shouldAddWatermark = plan.limits.watermark;

  // Generate PDF based on template
  switch (template) {
    case 'corporate':
      generateCorporateTemplate(data, shouldAddWatermark);
      break;
    case 'creative':
      generateCreativeTemplate(data, shouldAddWatermark);
      break;
    case 'minimal':
      generateMinimalTemplate(data, shouldAddWatermark);
      break;
    default:
      generateModernTemplate(data, shouldAddWatermark);
  }

  // Increment usage after successful generation
  SubscriptionManager.incrementUsage();
};

// Modern Template (Free + Paid)
const generateModernTemplate = (data: ProposalData, addWatermark: boolean): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#3b82f6');

  // Modern Header with gradient effect
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add subtle gradient effect with lighter shade
  doc.setFillColor(primaryColor.r + 20, primaryColor.g + 20, primaryColor.b + 20);
  doc.rect(0, 40, pageWidth, 10, 'F');

  // Logo and company name
  if (data.branding.logoUrl && SubscriptionManager.hasFeature('logoUpload')) {
    try {
      doc.addImage(data.branding.logoUrl, 'JPEG', margin, 12, 35, 25);
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, data.branding.logoUrl ? margin + 45 : margin, 30);

  yPosition = 70;

  // Title section with accent
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
  
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT PROPOSAL', margin + 10, yPosition + 18);

  yPosition += 35;

  // Project title with underline
  doc.setFontSize(18);
  doc.text(data.project.title, margin, yPosition);
  doc.setLineWidth(0.5);
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.line(margin, yPosition + 3, margin + doc.getTextWidth(data.project.title), yPosition + 3);
  
  yPosition += 25;

  // Date and validity in a box
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Prepared: ${currentDate}`, margin + 10, yPosition + 10);
  doc.text(`Valid until: ${new Date(data.validUntil).toLocaleDateString()}`, pageWidth - margin - 60, yPosition + 10);

  yPosition += 25;

  // Enhanced sections
  yPosition = addEnhancedSection(doc, 'CLIENT INFORMATION', yPosition, margin, pageWidth, primaryColor);
  yPosition = addClientInfo(doc, data.client, yPosition, margin);
  yPosition += 15;

  yPosition = addEnhancedSection(doc, 'PROJECT OVERVIEW', yPosition, margin, pageWidth, primaryColor);
  yPosition = addProjectOverview(doc, data.project, yPosition, margin, pageWidth);
  yPosition += 15;

  // Check for new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition = addEnhancedSection(doc, 'INVESTMENT & TIMELINE', yPosition, margin, pageWidth, primaryColor);
  yPosition = addInvestmentDetails(doc, data.project, yPosition, margin, pageWidth);
  yPosition += 15;

  yPosition = addEnhancedSection(doc, 'TERMS & CONDITIONS', yPosition, margin, pageWidth, primaryColor);
  yPosition = addTermsSection(doc, data.terms, yPosition, margin, pageWidth);

  // Professional footer
  addProfessionalFooter(doc, data, pageWidth, pageHeight, primaryColor);

  if (addWatermark) {
    addWatermarkToDoc(doc, pageWidth, pageHeight);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf`;
  doc.save(fileName);
};

// Corporate Template (Premium)
const generateCorporateTemplate = (data: ProposalData, addWatermark: boolean): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#1f2937');

  // Add cover page for corporate template
  addCoverPage(doc, data, 'corporate', primaryColor);
  
  // Add new page for content
  doc.addPage();
  yPosition = margin;

  // Add table of contents
  yPosition = addTableOfContents(doc, yPosition, margin, pageWidth, primaryColor);
  
  // Add new page for main content
  doc.addPage();
  yPosition = margin;

  // Corporate header with formal styling
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Logo placement
  if (data.branding.logoUrl && SubscriptionManager.hasFeature('logoUpload')) {
    try {
      doc.addImage(data.branding.logoUrl, 'JPEG', margin, 8, 30, 15);
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  // Company name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName.toUpperCase(), data.branding.logoUrl ? margin + 40 : margin, 20);

  yPosition = 50;

  // Formal title block
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30);

  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BUSINESS PROPOSAL', pageWidth / 2, yPosition + 20, { align: 'center' });

  yPosition += 45;

  // Enhanced Executive Summary
  yPosition = addExecutiveSummary(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 10;

  // Rest of the content with corporate styling
  yPosition = addCorporateSection(doc, 'CLIENT INFORMATION', yPosition, margin, pageWidth, primaryColor);
  yPosition = addClientInfo(doc, data.client, yPosition, margin);
  yPosition += 20;

  yPosition = addCorporateSection(doc, 'PROJECT SPECIFICATIONS', yPosition, margin, pageWidth, primaryColor);
  yPosition = addProjectOverview(doc, data.project, yPosition, margin, pageWidth);
  yPosition += 15;

  // Add timeline
  yPosition = addProjectTimeline(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 15;

  // Check for new page
  if (yPosition > pageHeight - 150) {
    doc.addPage();
    yPosition = margin;
  }

  // Enhanced investment breakdown
  yPosition = addInvestmentBreakdown(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 15;

  // Value proposition
  yPosition = addValueProposition(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 15;

  // Risk mitigation
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  yPosition = addRiskMitigation(doc, data, yPosition, margin, pageWidth, primaryColor);

  addCorporateFooter(doc, data, pageWidth, pageHeight, primaryColor);

  // Add page numbers to all pages
  addPageNumbers(doc);

  if (addWatermark) {
    addWatermarkToDoc(doc, pageWidth, pageHeight);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_corporate_proposal.pdf`;
  doc.save(fileName);
};

// Creative Template (Premium)
const generateCreativeTemplate = (data: ProposalData, addWatermark: boolean): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#7c3aed');
  const accentColor = { r: primaryColor.r + 50, g: primaryColor.g + 50, b: primaryColor.b + 50 };

  // Creative diagonal header
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  doc.rect(pageWidth - 60, 0, 60, 40, 'F');

  // Logo and branding
  if (data.branding.logoUrl && SubscriptionManager.hasFeature('logoUpload')) {
    try {
      doc.addImage(data.branding.logoUrl, 'JPEG', margin, 15, 25, 20);
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, data.branding.logoUrl ? margin + 35 : margin, 30);

  yPosition = 80;

  // Creative title with decorative elements
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT', margin, yPosition);
  doc.text('PROPOSAL', margin, yPosition + 12);

  // Decorative line
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(3);
  doc.line(margin, yPosition + 20, margin + 50, yPosition + 20);

  yPosition += 35;

  // Project title in a creative box
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.1);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 5, 5, 'F');
  
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.project.title, margin + 10, yPosition + 13);

  yPosition += 35;

  // Creative sections with colored backgrounds
  yPosition = addCreativeSection(doc, 'CLIENT DETAILS', yPosition, margin, pageWidth, primaryColor);
  yPosition = addClientInfo(doc, data.client, yPosition, margin);
  yPosition += 20;

  yPosition = addCreativeSection(doc, 'PROJECT VISION', yPosition, margin, pageWidth, primaryColor);
  yPosition = addProjectOverview(doc, data.project, yPosition, margin, pageWidth);

  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition = addCreativeSection(doc, 'INVESTMENT', yPosition, margin, pageWidth, primaryColor);
  yPosition = addInvestmentDetails(doc, data.project, yPosition, margin, pageWidth);
  yPosition += 15;

  // Add value proposition for creative template
  yPosition = addCreativeSection(doc, 'WHY CHOOSE US', yPosition, margin, pageWidth, primaryColor);
  yPosition = addValueProposition(doc, data, yPosition, margin, pageWidth, primaryColor);

  addCreativeFooter(doc, data, pageWidth, pageHeight, primaryColor);

  if (addWatermark) {
    addWatermarkToDoc(doc, pageWidth, pageHeight);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_creative_proposal.pdf`;
  doc.save(fileName);
};

// Minimal Template (Premium)
const generateMinimalTemplate = (data: ProposalData, addWatermark: boolean): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;
  let yPosition = margin + 20;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#000000');

  // Minimal header - just a thin line
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.5);
  doc.line(margin, 20, pageWidth - margin, 20);

  // Company name - very clean
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.companyName.toUpperCase(), margin, 35);

  yPosition = 60;

  // Minimal title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'normal');
  doc.text('Proposal', margin, yPosition);

  yPosition += 20;
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(data.project.title, margin, yPosition);

  yPosition += 40;

  // Minimal sections with lots of whitespace
  yPosition = addMinimalSection(doc, 'Client', yPosition, margin, primaryColor);
  yPosition = addClientInfo(doc, data.client, yPosition, margin);
  yPosition += 30;

  yPosition = addMinimalSection(doc, 'Project', yPosition, margin, primaryColor);
  yPosition = addProjectOverview(doc, data.project, yPosition, margin, pageWidth);
  yPosition += 30;

  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition = addMinimalSection(doc, 'Investment', yPosition, margin, primaryColor);
  yPosition = addInvestmentDetails(doc, data.project, yPosition, margin, pageWidth);

  addMinimalFooter(doc, data, pageWidth, pageHeight);

  if (addWatermark) {
    addWatermarkToDoc(doc, pageWidth, pageHeight);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_minimal_proposal.pdf`;
  doc.save(fileName);
};

// Enhanced section helpers
const addEnhancedSection = (
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  margin: number, 
  pageWidth: number, 
  color: { r: number; g: number; b: number }
): number => {
  // Gradient background
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  // Lighter accent
  doc.setFillColor(color.r + 30, color.g + 30, color.b + 30);
  doc.rect(margin, yPosition + 8, pageWidth - 2 * margin, 4, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 8, yPosition + 8);
  
  return yPosition + 20;
};

const addCorporateSection = (
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  margin: number, 
  pageWidth: number, 
  color: { r: number; g: number; b: number }
): number => {
  // Formal section header
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15);
  
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 10, yPosition + 10);
  
  return yPosition + 25;
};

const addCreativeSection = (
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  margin: number, 
  pageWidth: number, 
  color: { r: number; g: number; b: number }
): number => {
  // Creative angled section
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.rect(margin - 5, yPosition, pageWidth - 2 * margin + 10, 18, 'F');
  
  // Accent triangle (using rectangle)
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin - 5, yPosition, 20, 18, 'F');
  
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 25, yPosition + 12);
  
  return yPosition + 28;
};

const addMinimalSection = (
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  margin: number, 
  color: { r: number; g: number; b: number }
): number => {
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, margin, yPosition);
  
  // Subtle underline
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition + 2, margin + doc.getTextWidth(title), yPosition + 2);
  
  return yPosition + 15;
};

// Enhanced content helpers
const addClientInfo = (doc: jsPDF, client: any, yPosition: number, margin: number): number => {
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const info = [
    `Name: ${client.name}`,
    client.company ? `Company: ${client.company}` : null,
    `Email: ${client.email}`,
    client.phone ? `Phone: ${client.phone}` : null,
    client.address ? `Address: ${client.address}` : null
  ].filter(Boolean);

  info.forEach((line, index) => {
    if (line) {
      doc.text(line, margin + 5, yPosition + (index * 8));
    }
  });

  return yPosition + (info.length * 8);
};

const addProjectOverview = (doc: jsPDF, project: any, yPosition: number, margin: number, pageWidth: number): number => {
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Description
  const descLines = doc.splitTextToSize(project.description, pageWidth - 2 * margin - 10);
  for (let i = 0; i < descLines.length; i++) {
    doc.text(descLines[i], margin + 5, yPosition + (i * 6));
  }
  yPosition += descLines.length * 6 + 10;

  // Scope
  doc.setFont('helvetica', 'bold');
  doc.text('Scope of Work:', margin + 5, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  const scopeLines = doc.splitTextToSize(project.scope, pageWidth - 2 * margin - 10);
  for (let i = 0; i < scopeLines.length; i++) {
    doc.text(scopeLines[i], margin + 5, yPosition + (i * 6));
  }
  yPosition += scopeLines.length * 6 + 10;

  // Deliverables
  doc.setFont('helvetica', 'bold');
  doc.text('Deliverables:', margin + 5, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  const deliverableLines = doc.splitTextToSize(project.deliverables, pageWidth - 2 * margin - 10);
  for (let i = 0; i < deliverableLines.length; i++) {
    doc.text(deliverableLines[i], margin + 5, yPosition + (i * 6));
  }

  return yPosition + deliverableLines.length * 6;
};

const addInvestmentDetails = (doc: jsPDF, project: any, yPosition: number, margin: number, pageWidth: number): number => {
  // Investment box
  doc.setFillColor(250, 250, 250);
  doc.rect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 30);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL INVESTMENT', margin + 15, yPosition + 12);
  
  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50);
  doc.text(formatCurrency(project.price, project.currency), margin + 15, yPosition + 24);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Timeline: ${project.timeline}`, pageWidth - margin - 60, yPosition + 15);

  return yPosition + 40;
};

const addTermsSection = (doc: jsPDF, terms: string, yPosition: number, margin: number, pageWidth: number): number => {
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const termLines = doc.splitTextToSize(terms, pageWidth - 2 * margin - 10);
  for (let i = 0; i < termLines.length; i++) {
    doc.text(termLines[i], margin + 5, yPosition + (i * 5));
  }

  return yPosition + termLines.length * 5;
};

// Footer styles
const addProfessionalFooter = (
  doc: jsPDF, 
  data: ProposalData, 
  pageWidth: number, 
  pageHeight: number, 
  color: { r: number; g: number; b: number }
): void => {
  const footerY = pageHeight - 40;
  
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, footerY, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTACT INFORMATION', 20, footerY + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.branding.yourName} | ${data.branding.yourEmail}`, 20, footerY + 25);
  if (data.branding.yourPhone) {
    doc.text(`${data.branding.yourPhone}`, 20, footerY + 32);
  }
};

const addCorporateFooter = (
  doc: jsPDF, 
  data: ProposalData, 
  pageWidth: number, 
  pageHeight: number, 
  color: { r: number; g: number; b: number }
): void => {
  const footerY = pageHeight - 35;
  
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.branding.companyName} | ${data.branding.yourEmail} | ${data.branding.yourPhone || ''}`, 
    pageWidth / 2, footerY + 15, { align: 'center' });
};

const addCreativeFooter = (
  doc: jsPDF, 
  data: ProposalData, 
  pageWidth: number, 
  pageHeight: number, 
  color: { r: number; g: number; b: number }
): void => {
  const footerY = pageHeight - 30;
  
  // Creative curved footer
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.rect(0, footerY, pageWidth, 30, 'F');
  
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.yourName, pageWidth / 2, footerY + 12, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.branding.yourEmail} | ${data.branding.yourPhone || 'Contact for details'}`, 
    pageWidth / 2, footerY + 20, { align: 'center' });
};

const addMinimalFooter = (
  doc: jsPDF, 
  data: ProposalData, 
  pageWidth: number, 
  pageHeight: number
): void => {
  const footerY = pageHeight - 25;
  
  // Just a simple line and contact info
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(30, footerY, pageWidth - 30, footerY);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.branding.yourName} • ${data.branding.yourEmail}`, 
    pageWidth / 2, footerY + 12, { align: 'center' });
};

// Helper functions

const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$'
  };
  
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const addWatermarkToDoc = (doc: jsPDF, pageWidth: number, pageHeight: number): void => {
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  doc.text('DEMO VERSION', centerX, centerY, {
    angle: 45,
    align: 'center'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated with Proposal Generator - Upgrade to remove watermark', 
    pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
};