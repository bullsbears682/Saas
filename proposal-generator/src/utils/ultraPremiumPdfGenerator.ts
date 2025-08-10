import jsPDF from 'jspdf';
import { ProposalData } from '../types';
import { PDFTemplate } from '../types/templates';
import { SubscriptionManager } from './subscriptionManager';
import { hexToRgb, addPageNumbers, addCoverPage } from './pdfHelpers';
import { 
  addProjectChart,
  addQRCode,
  addProjectMetrics,
  addCompetitiveAdvantage,
  addTestimonial,
  addProjectROI,
  addProjectGallery,
  addNextSteps,
  addContactCard,
  addSignaturePage
} from './premiumPdfFeatures';

export const generateUltraPremiumPDF = async (data: ProposalData, template: PDFTemplate = 'corporate'): Promise<void> => {
  // Check usage limits
  const canGenerate = SubscriptionManager.canGenerateProposal();
  if (!canGenerate.allowed) {
    alert(`You've reached your monthly limit of ${canGenerate.limit} proposals. Please upgrade your plan to continue.`);
    return;
  }

  const plan = SubscriptionManager.getCurrentPlan();
  const shouldAddWatermark = plan.limits.watermark;

  switch (template) {
    case 'corporate':
      await generateUltraCorporateTemplate(data, shouldAddWatermark);
      break;
    case 'creative':
      await generateUltraCreativeTemplate(data, shouldAddWatermark);
      break;
    case 'minimal':
      await generateUltraMinimalTemplate(data, shouldAddWatermark);
      break;
    default:
      await generateUltraModernTemplate(data, shouldAddWatermark);
  }

  // Increment usage after successful generation
  SubscriptionManager.incrementUsage();
};

// Ultra Corporate Template
const generateUltraCorporateTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#1f2937');

  // 1. Cover Page
  addCoverPage(doc, data, 'corporate', primaryColor);

  // 2. Table of Contents Page
  doc.addPage();
  yPosition = margin + 20;
  
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TABLE OF CONTENTS', margin, yPosition);
  
  yPosition += 30;

  const tableOfContents = [
    { section: 'Executive Summary', page: 3 },
    { section: 'Client Information', page: 3 },
    { section: 'Project Overview', page: 4 },
    { section: 'Project Metrics & Timeline', page: 4 },
    { section: 'Investment Analysis & ROI', page: 5 },
    { section: 'Competitive Advantage', page: 5 },
    { section: 'Portfolio Showcase', page: 6 },
    { section: 'Client Testimonial', page: 6 },
    { section: 'Next Steps', page: 7 },
    { section: 'Terms & Conditions', page: 7 },
    { section: 'Signature Page', page: 8 }
  ];

  tableOfContents.forEach((item, index) => {
    const itemY = yPosition + (index * 12);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(item.section, margin + 10, itemY);
    
    // Dotted line
    const dotsStart = margin + 10 + doc.getTextWidth(item.section) + 10;
    const dotsEnd = pageWidth - margin - 30;
    const dotSpacing = 4;
    
    for (let x = dotsStart; x < dotsEnd; x += dotSpacing) {
      doc.setTextColor(150, 150, 150);
      doc.text('.', x, itemY);
    }
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(item.page.toString(), pageWidth - margin - 15, itemY);
  });

  // 3. Executive Summary & Client Info Page
  doc.addPage();
  yPosition = margin;

  // Page header
  addPageHeader(doc, 'EXECUTIVE SUMMARY', yPosition, margin, pageWidth, primaryColor);
  yPosition += 25;

  // Enhanced executive summary
  yPosition = await addEnhancedExecutiveSummary(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Client information section
  addPageHeader(doc, 'CLIENT INFORMATION', yPosition, margin, pageWidth, primaryColor);
  yPosition += 25;
  yPosition = addDetailedClientInfo(doc, data.client, yPosition, margin, pageWidth, primaryColor);

  // Add QR code to this page
  await addQRCode(doc, data, yPosition - 40, margin, pageWidth);

  // 4. Project Overview & Metrics Page
  doc.addPage();
  yPosition = margin;

  addPageHeader(doc, 'PROJECT OVERVIEW', yPosition, margin, pageWidth, primaryColor);
  yPosition += 25;
  yPosition = addDetailedProjectOverview(doc, data.project, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Project metrics
  yPosition = addProjectMetrics(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Project breakdown chart
  yPosition = await addProjectChart(doc, data, yPosition, margin, pageWidth, primaryColor);

  // 5. Investment & ROI Page
  doc.addPage();
  yPosition = margin;

  addPageHeader(doc, 'INVESTMENT ANALYSIS', yPosition, margin, pageWidth, primaryColor);
  yPosition += 25;
  yPosition = addDetailedInvestmentBreakdown(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addProjectROI(doc, data, yPosition, margin, pageWidth, primaryColor);

  // 6. Competitive Advantage & Portfolio Page
  doc.addPage();
  yPosition = margin;

  yPosition = addCompetitiveAdvantage(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addProjectGallery(doc, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addTestimonial(doc, yPosition, margin, pageWidth, primaryColor);

  // 7. Next Steps & Terms Page
  doc.addPage();
  yPosition = margin;

  yPosition = addNextSteps(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  addPageHeader(doc, 'TERMS & CONDITIONS', yPosition, margin, pageWidth, primaryColor);
  yPosition += 25;
  yPosition = addEnhancedTerms(doc, data.terms, yPosition, margin, pageWidth);
  yPosition += 20;

  yPosition = addContactCard(doc, data, yPosition, margin, pageWidth, primaryColor);

  // 8. Signature Page
  addSignaturePage(doc, data, primaryColor);

  // Add page numbers to all pages (except cover)
  addPageNumbers(doc);

  if (addWatermark) {
    addWatermarkToAllPages(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ultra_corporate_proposal.pdf`;
  doc.save(fileName);
};

// Ultra Creative Template
const generateUltraCreativeTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#7c3aed');

  // Creative cover with artistic elements
  addCreativeCover(doc, data, primaryColor);

  // Content pages with creative layouts
  doc.addPage();
  yPosition = margin;

  // Artistic header
  addCreativeHeader(doc, yPosition, pageWidth, primaryColor);
  yPosition += 60;

  // Project vision section
  yPosition = addCreativeProjectVision(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Creative metrics with visual elements
  yPosition = addProjectMetrics(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Add chart with creative styling
  yPosition = await addProjectChart(doc, data, yPosition, margin, pageWidth, primaryColor);

  // New page for investment and value
  doc.addPage();
  yPosition = margin;

  yPosition = addProjectROI(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addCompetitiveAdvantage(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addTestimonial(doc, yPosition, margin, pageWidth, primaryColor);

  // Final page
  doc.addPage();
  yPosition = margin;

  yPosition = addNextSteps(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addContactCard(doc, data, yPosition, margin, pageWidth, primaryColor);

  addPageNumbers(doc);

  if (addWatermark) {
    addWatermarkToAllPages(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ultra_creative_proposal.pdf`;
  doc.save(fileName);
};

// Ultra Modern Template
const generateUltraModernTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#3b82f6');

  // Modern cover page
  addModernCover(doc, data, primaryColor);

  // Content with modern styling
  doc.addPage();
  yPosition = margin;

  // Modern header
  addModernHeader(doc, data, yPosition, pageWidth, primaryColor);
  yPosition += 70;

  // Project overview with modern cards
  yPosition = addModernProjectOverview(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // Metrics and chart
  yPosition = addProjectMetrics(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  // New page for investment details
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition = addProjectROI(doc, data, yPosition, margin, pageWidth, primaryColor);
  yPosition += 20;

  yPosition = addNextSteps(doc, data, yPosition, margin, pageWidth, primaryColor);

  // Add QR code
  await addQRCode(doc, data, yPosition - 30, margin, pageWidth);

  addPageNumbers(doc);

  if (addWatermark) {
    addWatermarkToAllPages(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ultra_modern_proposal.pdf`;
  doc.save(fileName);
};

// Ultra Minimal Template
const generateUltraMinimalTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let yPosition = margin + 30;

  const primaryColor = hexToRgb(data.branding.primaryColor || '#000000');

  // Minimal cover
  addMinimalCover(doc, data, primaryColor);

  // Content with extreme minimalism
  doc.addPage();
  yPosition = margin + 30;

  // Simple header line
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.5);
  doc.line(margin, margin, pageWidth - margin, margin);

  // Company name
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.companyName.toUpperCase(), margin, margin + 15);

  // Content sections with minimal styling
  yPosition = addMinimalSection(doc, 'Overview', data.project.description, yPosition, margin, pageWidth, primaryColor);
  yPosition += 30;

  yPosition = addMinimalSection(doc, 'Investment', formatCurrency(data.project.price, data.project.currency), yPosition, margin, pageWidth, primaryColor);
  yPosition += 30;

  yPosition = addMinimalSection(doc, 'Timeline', data.project.timeline, yPosition, margin, pageWidth, primaryColor);
  yPosition += 30;

  // Contact at bottom
  const footerY = pageHeight - 60;
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.yourName, margin, footerY + 15);
  doc.text(data.branding.yourEmail, margin, footerY + 25);

  if (addWatermark) {
    addWatermarkToAllPages(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ultra_minimal_proposal.pdf`;
  doc.save(fileName);
};

// Helper functions for enhanced sections
const addPageHeader = (
  doc: jsPDF,
  title: string,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): void => {
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 10, yPosition + 10);
};

const addEnhancedExecutiveSummary = async (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): Promise<number> => {
  // Executive summary with professional styling
  doc.setFillColor(250, 250, 255);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60);

  // Summary content with better structure
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const summaryParts = [
    `Project: ${data.project.title}`,
    `Client: ${data.client.company || data.client.name}`,
    `Investment: ${formatCurrency(data.project.price, data.project.currency)}`,
    `Timeline: ${data.project.timeline}`,
    '',
    `Overview: ${data.project.description.substring(0, 200)}...`
  ];

  summaryParts.forEach((part, index) => {
    if (part) {
      if (part.includes(':')) {
        const [label, value] = part.split(':');
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin + 10, yPosition + 12 + (index * 8));
        doc.setFont('helvetica', 'normal');
        doc.text(value.trim(), margin + 10 + doc.getTextWidth(`${label}: `), yPosition + 12 + (index * 8));
      } else {
        doc.text(part, margin + 10, yPosition + 12 + (index * 8));
      }
    }
  });

  return yPosition + 70;
};

const addDetailedClientInfo = (
  doc: jsPDF,
  client: any,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Client info in a professional card format
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 35);

  const clientInfo = [
    { label: 'Contact Name', value: client.name, icon: '👤' },
    { label: 'Company', value: client.company || 'Individual', icon: '🏢' },
    { label: 'Email', value: client.email, icon: '📧' },
    { label: 'Phone', value: client.phone || 'Not provided', icon: '📱' },
    { label: 'Address', value: client.address || 'Not provided', icon: '📍' }
  ];

  clientInfo.forEach((info, index) => {
    const infoY = yPosition + 8 + (index * 5);
    
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${info.icon} ${info.label}:`, margin + 10, infoY);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, margin + 60, infoY);
  });

  return yPosition + 45;
};

const addDetailedProjectOverview = (
  doc: jsPDF,
  project: any,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Project overview with enhanced formatting
  const sections = [
    { title: 'Project Description', content: project.description },
    { title: 'Scope of Work', content: project.scope },
    { title: 'Key Deliverables', content: project.deliverables }
  ];

  sections.forEach((section, index) => {
    // Section header
    doc.setFillColor(color.r, color.g, color.b, 0.1);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
    
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 8, yPosition + 8);
    
    yPosition += 18;

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(section.content, pageWidth - 2 * margin - 10);
    
    for (let i = 0; i < contentLines.length; i++) {
      doc.text(contentLines[i], margin + 5, yPosition + (i * 6));
    }
    
    yPosition += contentLines.length * 6 + 15;
  });

  return yPosition;
};

const addDetailedInvestmentBreakdown = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Enhanced investment breakdown with visual elements
  const breakdown = [
    { category: 'Core Development', percentage: 60, amount: data.project.price * 0.6, description: 'Primary feature development and implementation' },
    { category: 'UI/UX Design', percentage: 15, amount: data.project.price * 0.15, description: 'User interface and experience design' },
    { category: 'Quality Assurance', percentage: 15, amount: data.project.price * 0.15, description: 'Testing, debugging, and quality control' },
    { category: 'Project Management', percentage: 10, amount: data.project.price * 0.1, description: 'Coordination, communication, and delivery' }
  ];

  // Table header with enhanced styling
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Category', margin + 5, yPosition + 10);
  doc.text('Allocation', margin + 80, yPosition + 10);
  doc.text('Amount', pageWidth - margin - 30, yPosition + 10);

  yPosition += 15;

  // Enhanced breakdown rows
  breakdown.forEach((item, index) => {
    const rowY = yPosition + (index * 25);
    
    // Alternating row backgrounds
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, rowY, pageWidth - 2 * margin, 25, 'F');
    }

    // Percentage bar
    const barWidth = 40;
    const barHeight = 4;
    const barX = margin + 80;
    const barY = rowY + 8;
    
    doc.setFillColor(230, 230, 230);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(barX, barY, (barWidth * item.percentage) / 100, barHeight, 'F');

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.category, margin + 5, rowY + 8);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(item.description, 60);
    doc.text(descLines[0], margin + 5, rowY + 15);

    // Percentage and amount
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.percentage}%`, barX + barWidth + 5, rowY + 10);
    doc.text(formatCurrency(item.amount, data.project.currency), pageWidth - margin - 5, rowY + 10, { align: 'right' });
  });

  yPosition += breakdown.length * 25 + 15;

  // Total with enhanced styling
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20);
  
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL INVESTMENT', margin + 10, yPosition + 13);
  doc.text(formatCurrency(data.project.price, data.project.currency), pageWidth - margin - 10, yPosition + 13, { align: 'right' });

  return yPosition + 30;
};

// Additional helper functions for enhanced layouts
const addCreativeCover = (doc: jsPDF, data: ProposalData, color: { r: number; g: number; b: number }): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Creative gradient background
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Artistic elements
  doc.setFillColor(255, 255, 255, 0.1);
  doc.ellipse(pageWidth - 30, 30, 40, 40, 'F');
  doc.ellipse(30, pageHeight - 30, 25, 25, 'F');

  // Content
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('CREATIVE', pageWidth / 2, 100, { align: 'center' });
  doc.text('PROPOSAL', pageWidth / 2, 120, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text(data.project.title, pageWidth / 2, 150, { align: 'center' });
};

const addModernCover = (doc: jsPDF, data: ProposalData, color: { r: number; g: number; b: number }): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Modern geometric background
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, 0, pageWidth, pageHeight / 3, 'F');

  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight / 3, pageWidth, pageHeight * 2 / 3, 'F');

  // Modern typography
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPOSAL', pageWidth / 2, pageHeight / 6, { align: 'center' });

  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(20);
  doc.text(data.project.title, pageWidth / 2, pageHeight / 2, { align: 'center' });
};

const addMinimalCover = (doc: jsPDF, data: ProposalData, color: { r: number; g: number; b: number }): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Minimal line at top
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.line(40, 40, pageWidth - 40, 40);

  // Minimal typography
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'normal');
  doc.text('Proposal', 40, pageHeight / 2 - 20);

  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(data.project.title, 40, pageHeight / 2 + 10);
};

const addCreativeHeader = (doc: jsPDF, yPosition: number, pageWidth: number, color: { r: number; g: number; b: number }): void => {
  // Creative header with artistic elements
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, yPosition, pageWidth, 50, 'F');

  // Artistic accent
  doc.setFillColor(255, 255, 255, 0.2);
  doc.ellipse(pageWidth - 25, yPosition + 25, 30, 30, 'F');
};

const addModernHeader = (doc: jsPDF, data: ProposalData, yPosition: number, pageWidth: number, color: { r: number; g: number; b: number }): void => {
  // Modern header with logo and company info
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, yPosition, pageWidth, 60, 'F');

  // Gradient effect
  doc.setFillColor(color.r + 20, color.g + 20, color.b + 20);
  doc.rect(0, yPosition + 45, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, 20, yPosition + 35);
};

const addCreativeProjectVision = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Vision section with creative styling
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 8, 8, 'F');

  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('✨ PROJECT VISION', margin + 15, yPosition + 15);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const visionLines = doc.splitTextToSize(data.project.description, pageWidth - 2 * margin - 20);
  
  for (let i = 0; i < Math.min(visionLines.length, 3); i++) {
    doc.text(visionLines[i], margin + 15, yPosition + 25 + (i * 6));
  }

  return yPosition + 50;
};

const addModernProjectOverview = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Modern card-based layout
  const cards = [
    { title: 'Project Scope', content: data.project.scope, icon: '🎯' },
    { title: 'Deliverables', content: data.project.deliverables, icon: '📦' },
    { title: 'Timeline', content: data.project.timeline, icon: '⏰' }
  ];

  cards.forEach((card, index) => {
    const cardY = yPosition + (index * 35);
    
    // Modern card styling
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, cardY, pageWidth - 2 * margin, 30, 4, 4, 'F');
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, cardY, pageWidth - 2 * margin, 30, 4, 4, 'S');

    // Card header
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${card.icon} ${card.title}`, margin + 10, cardY + 12);

    // Card content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const cardLines = doc.splitTextToSize(card.content, pageWidth - 2 * margin - 20);
    
    for (let i = 0; i < Math.min(cardLines.length, 2); i++) {
      doc.text(cardLines[i], margin + 10, cardY + 20 + (i * 5));
    }
  });

  return yPosition + (cards.length * 35);
};

const addMinimalSection = (
  doc: jsPDF,
  title: string,
  content: string,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(title, margin, yPosition);

  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition + 2, margin + doc.getTextWidth(title), yPosition + 2);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
  
  for (let i = 0; i < contentLines.length; i++) {
    doc.text(contentLines[i], margin, yPosition + 15 + (i * 6));
  }

  return yPosition + 15 + (contentLines.length * 6);
};

const addEnhancedTerms = (
  doc: jsPDF,
  terms: string,
  yPosition: number,
  margin: number,
  pageWidth: number
): number => {
  // Enhanced terms formatting
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const termLines = doc.splitTextToSize(terms, pageWidth - 2 * margin - 10);
  for (let i = 0; i < termLines.length; i++) {
    doc.text(termLines[i], margin + 5, yPosition + (i * 5));
  }

  return yPosition + termLines.length * 5;
};

const addWatermarkToAllPages = (doc: jsPDF): void => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    
    doc.text('DEMO VERSION', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center'
    });
  }
};

const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$'
  };
  
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};