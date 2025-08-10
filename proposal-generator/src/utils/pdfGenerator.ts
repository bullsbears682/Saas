import jsPDF from 'jspdf';
import { ProposalData } from '../types';
import { SubscriptionManager } from './subscriptionManager';

export const generateProposalPDF = (data: ProposalData): void => {
  // Check usage limits
  const canGenerate = SubscriptionManager.canGenerateProposal();
  if (!canGenerate.allowed) {
    alert(`You've reached your monthly limit of ${canGenerate.limit} proposals. Please upgrade your plan to continue.`);
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  
  // Check if watermark should be added (free tier)
  const plan = SubscriptionManager.getCurrentPlan();
  const shouldAddWatermark = plan.limits.watermark;

  // Set primary color from branding
  const primaryColor = data.branding.primaryColor || '#3b82f6';
  const rgbColor = hexToRgb(primaryColor);

  // Header with branding
  doc.setFillColor(rgbColor.r, rgbColor.g, rgbColor.b);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company logo (if available)
  if (data.branding.logoUrl) {
    try {
      doc.addImage(data.branding.logoUrl, 'JPEG', margin, 10, 30, 20);
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }

  // Company name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, data.branding.logoUrl ? margin + 40 : margin, 25);

  yPosition = 60;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT PROPOSAL', margin, yPosition);
  yPosition += 20;

  // Project title
  doc.setFontSize(18);
  doc.setTextColor(rgbColor.r, rgbColor.g, rgbColor.b);
  doc.text(data.project.title, margin, yPosition);
  yPosition += 20;

  // Date and validity
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Prepared on: ${currentDate}`, margin, yPosition);
  doc.text(`Valid until: ${new Date(data.validUntil).toLocaleDateString()}`, pageWidth - margin - 50, yPosition);
  yPosition += 20;

  // Client Information Section
  yPosition = addSection(doc, 'CLIENT INFORMATION', yPosition, margin, pageWidth, rgbColor);
  yPosition = addText(doc, `Name: ${data.client.name}`, yPosition, margin);
  if (data.client.company) {
    yPosition = addText(doc, `Company: ${data.client.company}`, yPosition, margin);
  }
  yPosition = addText(doc, `Email: ${data.client.email}`, yPosition, margin);
  if (data.client.phone) {
    yPosition = addText(doc, `Phone: ${data.client.phone}`, yPosition, margin);
  }
  if (data.client.address) {
    yPosition = addText(doc, `Address: ${data.client.address}`, yPosition, margin);
  }
  yPosition += 10;

  // Project Description Section
  yPosition = addSection(doc, 'PROJECT DESCRIPTION', yPosition, margin, pageWidth, rgbColor);
  yPosition = addWrappedText(doc, data.project.description, yPosition, margin, pageWidth - 2 * margin);
  yPosition += 10;

  // Project Scope Section
  yPosition = addSection(doc, 'PROJECT SCOPE', yPosition, margin, pageWidth, rgbColor);
  yPosition = addWrappedText(doc, data.project.scope, yPosition, margin, pageWidth - 2 * margin);
  yPosition += 10;

  // Deliverables Section
  yPosition = addSection(doc, 'DELIVERABLES', yPosition, margin, pageWidth, rgbColor);
  yPosition = addWrappedText(doc, data.project.deliverables, yPosition, margin, pageWidth - 2 * margin);
  yPosition += 10;

  // Timeline and Pricing Section
  yPosition = addSection(doc, 'TIMELINE & PRICING', yPosition, margin, pageWidth, rgbColor);
  yPosition = addText(doc, `Timeline: ${data.project.timeline}`, yPosition, margin);
  yPosition = addText(doc, `Total Investment: ${formatCurrency(data.project.price, data.project.currency)}`, yPosition, margin);
  yPosition += 10;

  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  // Terms and Conditions Section
  yPosition = addSection(doc, 'TERMS & CONDITIONS', yPosition, margin, pageWidth, rgbColor);
  yPosition = addWrappedText(doc, data.terms, yPosition, margin, pageWidth - 2 * margin);
  yPosition += 20;

  // Footer with your contact information
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
  
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Information:', margin + 10, yPosition);
  
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${data.branding.yourName} | ${data.branding.yourEmail}`, margin + 10, yPosition);
  if (data.branding.yourPhone) {
    doc.text(`Phone: ${data.branding.yourPhone}`, margin + 10, yPosition + 6);
  }
  if (data.branding.yourAddress) {
    doc.text(`Address: ${data.branding.yourAddress}`, margin + 10, yPosition + 12);
  }

  // Add watermark for free users
  if (shouldAddWatermark) {
    addWatermark(doc, pageWidth, pageHeight);
  }

  // Increment usage after successful generation
  SubscriptionManager.incrementUsage();

  // Save the PDF
  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf`;
  doc.save(fileName);
};

// Helper functions
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 }; // Default blue
};

const addSection = (
  doc: jsPDF, 
  title: string, 
  yPosition: number, 
  margin: number, 
  pageWidth: number, 
  color: { r: number; g: number; b: number }
): number => {
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 5, yPosition + 6);
  
  return yPosition + 15;
};

const addText = (doc: jsPDF, text: string, yPosition: number, margin: number): number => {
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(text, margin, yPosition);
  return yPosition + 8;
};

const addWrappedText = (
  doc: jsPDF, 
  text: string, 
  yPosition: number, 
  margin: number, 
  maxWidth: number
): number => {
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const lines = doc.splitTextToSize(text, maxWidth);
  
  for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], margin, yPosition);
    yPosition += 6;
  }
  
  return yPosition;
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

const addWatermark = (doc: jsPDF, pageWidth: number, pageHeight: number): void => {
  // Add semi-transparent watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  
  // Rotate and add watermark text
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  doc.text('DEMO VERSION', centerX, centerY, {
    angle: 45,
    align: 'center'
  });
  
  // Add small footer watermark
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated with Proposal Generator - Upgrade to remove watermark', 
    pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
};