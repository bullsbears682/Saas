import jsPDF from 'jspdf';
import { ProposalData } from '../types';

export const addExecutiveSummary = (
  doc: jsPDF, 
  data: ProposalData, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Executive Summary Box with enhanced styling
  doc.setFillColor(250, 250, 255);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 50);

  // Header with icon
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 EXECUTIVE SUMMARY', margin + 10, yPosition + 15);

  // Summary content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const summaryText = `This proposal outlines ${data.project.title} for ${data.client.company || data.client.name}. ` +
    `The project involves ${data.project.description.substring(0, 150)}... ` +
    `With an estimated timeline of ${data.project.timeline}, this initiative represents a ` +
    `strategic investment in ${data.client.company ? data.client.company + "'s" : "your"} future growth.`;
    
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 2 * margin - 20);
  
  for (let i = 0; i < Math.min(summaryLines.length, 4); i++) {
    doc.text(summaryLines[i], margin + 10, yPosition + 25 + (i * 6));
  }

  return yPosition + 60;
};

export const addProjectTimeline = (
  doc: jsPDF, 
  data: ProposalData, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Timeline section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('📅 PROJECT TIMELINE', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Timeline phases (simulate based on project info)
  const phases = [
    { name: 'Discovery & Planning', duration: '1-2 weeks', status: 'upcoming' },
    { name: 'Design & Development', duration: '60% of timeline', status: 'upcoming' },
    { name: 'Testing & Refinement', duration: '20% of timeline', status: 'upcoming' },
    { name: 'Delivery & Launch', duration: '1 week', status: 'upcoming' }
  ];

  phases.forEach((phase, index) => {
    const phaseY = yPosition + (index * 15);
    
    // Phase indicator (using ellipse instead of circle)
    doc.setFillColor(color.r, color.g, color.b);
    doc.ellipse(margin + 8, phaseY + 5, 3, 3, 'F');
    
    // Phase line
    if (index < phases.length - 1) {
      doc.setDrawColor(color.r, color.g, color.b);
      doc.setLineWidth(1);
      doc.line(margin + 8, phaseY + 8, margin + 8, phaseY + 15);
    }
    
    // Phase details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(phase.name, margin + 20, phaseY + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(phase.duration, margin + 20, phaseY + 12);
  });

  return yPosition + (phases.length * 15) + 10;
};

export const addInvestmentBreakdown = (
  doc: jsPDF, 
  data: ProposalData, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Investment breakdown section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('💰 INVESTMENT BREAKDOWN', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Create a simple breakdown table
  const breakdown = [
    { item: 'Project Development', percentage: 70, amount: data.project.price * 0.7 },
    { item: 'Project Management', percentage: 15, amount: data.project.price * 0.15 },
    { item: 'Quality Assurance', percentage: 10, amount: data.project.price * 0.1 },
    { item: 'Documentation & Support', percentage: 5, amount: data.project.price * 0.05 }
  ];

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', margin + 5, yPosition + 8);
  doc.text('Allocation', pageWidth - margin - 40, yPosition + 8);
  doc.text('Amount', pageWidth - margin - 5, yPosition + 8, { align: 'right' });

  yPosition += 12;

  // Table rows
  breakdown.forEach((item, index) => {
    const rowY = yPosition + (index * 10);
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, rowY, pageWidth - 2 * margin, 10, 'F');
    }
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.item, margin + 5, rowY + 7);
    doc.text(`${item.percentage}%`, pageWidth - margin - 40, rowY + 7);
    doc.text(formatCurrency(item.amount, data.project.currency), pageWidth - margin - 5, rowY + 7, { align: 'right' });
  });

  yPosition += breakdown.length * 10 + 10;

  // Total box
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15);
  
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PROJECT INVESTMENT', margin + 5, yPosition + 10);
  doc.text(formatCurrency(data.project.price, data.project.currency), pageWidth - margin - 5, yPosition + 10, { align: 'right' });

  return yPosition + 25;
};

export const addValueProposition = (
  doc: jsPDF, 
  data: ProposalData, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Value proposition section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('✨ VALUE PROPOSITION', margin + 8, yPosition + 8);
  
  yPosition += 20;

  const valuePoints = [
    '🎯 Tailored solution designed specifically for your needs',
    '⚡ Efficient delivery with proven methodologies',
    '🔒 Secure, reliable, and scalable implementation',
    '📞 Dedicated support throughout the project lifecycle',
    '🚀 Future-proof technology stack and best practices'
  ];

  valuePoints.forEach((point, index) => {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(point, margin + 5, yPosition + (index * 8));
  });

  return yPosition + (valuePoints.length * 8) + 10;
};

export const addRiskMitigation = (
  doc: jsPDF, 
  data: ProposalData, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Risk mitigation section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🛡️ RISK MITIGATION', margin + 8, yPosition + 8);
  
  yPosition += 20;

  const riskPoints = [
    'Regular milestone reviews and client feedback sessions',
    'Comprehensive testing at each development phase',
    'Backup and recovery procedures for all project assets',
    'Clear communication channels and project management tools',
    'Contingency planning for potential scope changes'
  ];

  riskPoints.forEach((point, index) => {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• ${point}`, margin + 5, yPosition + (index * 7));
  });

  return yPosition + (riskPoints.length * 7) + 10;
};

// Helper function for currency formatting
const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$'
  };
  
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};