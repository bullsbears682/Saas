import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { ProposalData } from '../types';

export const addProjectChart = async (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): Promise<number> => {
  // Create a simple project breakdown chart using canvas
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return yPosition;

  // Chart background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 300, 200);

  // Chart data (simulate project phases)
  const phases = [
    { name: 'Planning', percentage: 20, color: '#3b82f6' },
    { name: 'Development', percentage: 50, color: '#10b981' },
    { name: 'Testing', percentage: 20, color: '#f59e0b' },
    { name: 'Delivery', percentage: 10, color: '#8b5cf6' }
  ];

  // Draw pie chart
  const centerX = 100;
  const centerY = 100;
  const radius = 60;
  let currentAngle = -Math.PI / 2;

  phases.forEach((phase) => {
    const sliceAngle = (phase.percentage / 100) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = phase.color;
    ctx.fill();
    
    // Add labels
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
    
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${phase.name}`, labelX, labelY);
    ctx.fillText(`${phase.percentage}%`, labelX, labelY + 15);
    
    currentAngle += sliceAngle;
  });

  // Legend
  let legendY = 20;
  phases.forEach((phase) => {
    ctx.fillStyle = phase.color;
    ctx.fillRect(220, legendY, 15, 15);
    
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(phase.name, 245, legendY + 12);
    
    legendY += 25;
  });

  // Convert canvas to image and add to PDF
  const chartImage = canvas.toDataURL('image/png');
  
  // Add chart section header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 PROJECT BREAKDOWN', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Add chart image
  doc.addImage(chartImage, 'PNG', margin + 20, yPosition, 80, 53);

  return yPosition + 65;
};

export const addQRCode = async (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number
): Promise<number> => {
  try {
    // Create contact vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.branding.yourName}
ORG:${data.branding.companyName}
EMAIL:${data.branding.yourEmail}
TEL:${data.branding.yourPhone || ''}
URL:${data.branding.companyName.toLowerCase().replace(/\s+/g, '')}.com
NOTE:Contact for ${data.project.title}
END:VCARD`;

    const qrCodeDataUrl = await QRCode.toDataURL(vCardData, {
      width: 80,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Add QR code section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('📱 Quick Contact', pageWidth - margin - 60, yPosition);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Scan to add contact', pageWidth - margin - 60, yPosition + 8);

    // Add QR code
    doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - margin - 25, yPosition + 12, 20, 20);

    return yPosition + 35;
  } catch (error) {
    console.warn('Could not generate QR code:', error);
    return yPosition;
  }
};

export const addProjectMetrics = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Metrics section header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('📈 PROJECT METRICS', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Calculate metrics based on project data
  const estimatedHours = Math.ceil(data.project.price / 100); // Rough estimate
  const teamSize = Math.max(1, Math.ceil(estimatedHours / 160)); // Assuming 160 hours per person per month
  const complexity = data.project.description.length > 200 ? 'High' : 
                    data.project.description.length > 100 ? 'Medium' : 'Low';

  const metrics = [
    { label: 'Estimated Hours', value: `${estimatedHours}h`, icon: '⏱️' },
    { label: 'Team Size', value: `${teamSize} ${teamSize === 1 ? 'person' : 'people'}`, icon: '👥' },
    { label: 'Complexity', value: complexity, icon: '🎯' },
    { label: 'Timeline', value: data.project.timeline, icon: '📅' }
  ];

  // Create metrics cards
  const cardWidth = (pageWidth - 2 * margin - 30) / 2;
  const cardHeight = 20;

  metrics.forEach((metric, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const cardX = margin + (col * (cardWidth + 10));
    const cardY = yPosition + (row * (cardHeight + 10));

    // Card background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'S');

    // Icon and label
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${metric.icon} ${metric.label}`, cardX + 5, cardY + 8);

    // Value
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, cardX + 5, cardY + 16);
  });

  return yPosition + Math.ceil(metrics.length / 2) * (cardHeight + 10) + 10;
};

export const addCompetitiveAdvantage = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Competitive advantage section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🏆 COMPETITIVE ADVANTAGE', margin + 8, yPosition + 8);
  
  yPosition += 20;

  const advantages = [
    {
      title: 'Proven Track Record',
      description: 'Successfully delivered 50+ similar projects with 98% client satisfaction',
      icon: '✅'
    },
    {
      title: 'Cutting-Edge Technology',
      description: 'Latest tools and frameworks ensuring future-proof solutions',
      icon: '🚀'
    },
    {
      title: 'Dedicated Support',
      description: '24/7 support during development and 6 months post-launch',
      icon: '🛠️'
    },
    {
      title: 'Transparent Process',
      description: 'Weekly progress reports and real-time project dashboard access',
      icon: '📊'
    }
  ];

  advantages.forEach((advantage, index) => {
    const advantageY = yPosition + (index * 25);
    
    // Icon circle
    doc.setFillColor(color.r, color.g, color.b);
    doc.ellipse(margin + 8, advantageY + 8, 6, 6, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(advantage.icon, margin + 8, advantageY + 10, { align: 'center' });

    // Title
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(advantage.title, margin + 20, advantageY + 6);

    // Description
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(advantage.description, pageWidth - margin - 30);
    for (let i = 0; i < descLines.length; i++) {
      doc.text(descLines[i], margin + 20, advantageY + 12 + (i * 5));
    }
  });

  return yPosition + (advantages.length * 25) + 10;
};

export const addTestimonial = (
  doc: jsPDF,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Testimonial section
  doc.setFillColor(color.r, color.g, color.b, 0.05);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 35);

  // Quote icon
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('"', margin + 10, yPosition + 15);

  // Testimonial text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const testimonialText = "Working with this team was exceptional. They delivered beyond our expectations, on time and within budget. The quality of work and attention to detail was outstanding.";
  const testimonialLines = doc.splitTextToSize(testimonialText, pageWidth - 2 * margin - 30);
  
  for (let i = 0; i < Math.min(testimonialLines.length, 3); i++) {
    doc.text(testimonialLines[i], margin + 20, yPosition + 10 + (i * 6));
  }

  // Attribution
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('— Sarah Johnson, CEO at TechStart Inc.', pageWidth - margin - 10, yPosition + 30, { align: 'right' });

  return yPosition + 45;
};

export const addProjectROI = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // ROI section header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('💹 RETURN ON INVESTMENT', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Calculate estimated ROI (simplified)
  const projectCost = data.project.price;
  const estimatedROI = projectCost * 2.5; // Assume 250% ROI
  const monthlyBenefit = estimatedROI / 12;

  const roiMetrics = [
    { label: 'Project Investment', value: formatCurrency(projectCost, data.project.currency), color: '#dc2626' },
    { label: 'Estimated 12-Month ROI', value: formatCurrency(estimatedROI, data.project.currency), color: '#10b981' },
    { label: 'Monthly Benefit', value: formatCurrency(monthlyBenefit, data.project.currency), color: '#3b82f6' },
    { label: 'Break-even Timeline', value: '4-6 months', color: '#f59e0b' }
  ];

  // ROI cards
  const cardWidth = (pageWidth - 2 * margin - 15) / 2;
  const cardHeight = 18;

  roiMetrics.forEach((metric, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const cardX = margin + (col * (cardWidth + 5));
    const cardY = yPosition + (row * (cardHeight + 8));

    // Card with colored left border
    doc.setFillColor(250, 250, 250);
    doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
    
    // Colored left border
    const borderColor = hexToRgb(metric.color);
    doc.setFillColor(borderColor.r, borderColor.g, borderColor.b);
    doc.rect(cardX, cardY, 3, cardHeight, 'F');

    // Label
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.label, cardX + 8, cardY + 8);

    // Value
    doc.setTextColor(borderColor.r, borderColor.g, borderColor.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, cardX + 8, cardY + 15);
  });

  return yPosition + Math.ceil(roiMetrics.length / 2) * (cardHeight + 8) + 15;
};

export const addProjectGallery = (
  doc: jsPDF,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Gallery section header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🖼️ PORTFOLIO SHOWCASE', margin + 8, yPosition + 8);
  
  yPosition += 20;

  // Create mock portfolio items
  const portfolioItems = [
    { title: 'E-commerce Platform', tech: 'React, Node.js', result: '300% sales increase' },
    { title: 'Mobile App', tech: 'React Native', result: '50k+ downloads' },
    { title: 'Dashboard System', tech: 'Vue.js, Python', result: '80% efficiency gain' }
  ];

  portfolioItems.forEach((item, index) => {
    const itemY = yPosition + (index * 20);
    
    // Item background
    doc.setFillColor(248, 250, 252);
    doc.rect(margin + 5, itemY, pageWidth - 2 * margin - 10, 18, 'F');
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.3);
    doc.rect(margin + 5, itemY, pageWidth - 2 * margin - 10, 18);

    // Mock image placeholder
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(margin + 10, itemY + 3, 12, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('IMG', margin + 16, itemY + 10, { align: 'center' });

    // Project details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, margin + 28, itemY + 8);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(item.tech, margin + 28, itemY + 13);

    // Result
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(item.result, pageWidth - margin - 15, itemY + 10, { align: 'right' });
  });

  return yPosition + (portfolioItems.length * 20) + 15;
};

export const addNextSteps = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Next steps section
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 NEXT STEPS', margin + 8, yPosition + 8);
  
  yPosition += 20;

  const steps = [
    { step: '1', action: 'Review and approve this proposal', timeline: 'Within 3 business days' },
    { step: '2', action: 'Sign contract and process initial payment', timeline: '1 business day' },
    { step: '3', action: 'Project kickoff meeting', timeline: 'Within 1 week' },
    { step: '4', action: 'Begin development phase', timeline: 'Immediately after kickoff' }
  ];

  steps.forEach((stepItem, index) => {
    const stepY = yPosition + (index * 18);
    
    // Step number circle
    doc.setFillColor(color.r, color.g, color.b);
    doc.ellipse(margin + 8, stepY + 6, 5, 5, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(stepItem.step, margin + 8, stepY + 8, { align: 'center' });

    // Step action
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(stepItem.action, margin + 18, stepY + 6);

    // Timeline
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Timeline: ${stepItem.timeline}`, margin + 18, stepY + 12);

    // Connecting line
    if (index < steps.length - 1) {
      doc.setDrawColor(color.r, color.g, color.b);
      doc.setLineWidth(1);
      doc.line(margin + 8, stepY + 11, margin + 8, stepY + 18);
    }
  });

  return yPosition + (steps.length * 18) + 10;
};

export const addContactCard = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Professional contact card
  doc.setFillColor(color.r, color.g, color.b, 0.1);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 5, 5, 'F');
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 5, 5, 'S');

  // Header
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📞 LET\'S GET STARTED', margin + 15, yPosition + 15);

  // Contact info in columns
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const leftColumn = [
    `👤 ${data.branding.yourName}`,
    `📧 ${data.branding.yourEmail}`,
  ];

  const rightColumn = [
    `🏢 ${data.branding.companyName}`,
    data.branding.yourPhone ? `📱 ${data.branding.yourPhone}` : '',
  ].filter(Boolean);

  leftColumn.forEach((item, index) => {
    doc.text(item, margin + 15, yPosition + 22 + (index * 6));
  });

  rightColumn.forEach((item, index) => {
    doc.text(item, margin + (pageWidth - 2 * margin) / 2, yPosition + 22 + (index * 6));
  });

  // Call to action
  doc.setTextColor(color.r, color.g, color.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to transform your vision into reality? Contact us today!', 
    pageWidth / 2, yPosition + 35, { align: 'center' });

  return yPosition + 50;
};

export const addSignaturePage = (
  doc: jsPDF,
  data: ProposalData,
  color: { r: number; g: number; b: number }
): void => {
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  let yPosition = margin + 20;

  // Header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRACT SIGNATURE', pageWidth / 2, 20, { align: 'center' });

  yPosition = 60;

  // Agreement text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPOSAL ACCEPTANCE', margin, yPosition);

  yPosition += 20;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const agreementText = `By signing below, ${data.client.company || data.client.name} agrees to the terms and conditions outlined in this proposal for "${data.project.title}". This agreement is valid until ${new Date(data.validUntil).toLocaleDateString()}.`;
  
  const agreementLines = doc.splitTextToSize(agreementText, pageWidth - 2 * margin);
  for (let i = 0; i < agreementLines.length; i++) {
    doc.text(agreementLines[i], margin, yPosition + (i * 6));
  }

  yPosition += agreementLines.length * 6 + 30;

  // Signature blocks
  const signatureBlocks = [
    {
      title: 'CLIENT SIGNATURE',
      name: data.client.name,
      company: data.client.company,
      role: 'Authorized Representative'
    },
    {
      title: 'SERVICE PROVIDER',
      name: data.branding.yourName,
      company: data.branding.companyName,
      role: 'Project Lead'
    }
  ];

  signatureBlocks.forEach((block, index) => {
    const blockX = margin + (index * ((pageWidth - 2 * margin) / 2));
    const blockWidth = (pageWidth - 2 * margin) / 2 - 10;

    // Signature box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(blockX, yPosition, blockWidth, 60);

    // Title
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(block.title, blockX + 5, yPosition + 12);

    // Signature line
    doc.setDrawColor(0, 0, 0);
    doc.line(blockX + 5, yPosition + 35, blockX + blockWidth - 5, yPosition + 35);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Signature', blockX + 5, yPosition + 40);

    // Name and details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(block.name, blockX + 5, yPosition + 48);
    
    doc.setFont('helvetica', 'normal');
    doc.text(block.company, blockX + 5, yPosition + 54);
    doc.text(block.role, blockX + 5, yPosition + 58);

    // Date line
    doc.setDrawColor(0, 0, 0);
    doc.line(blockX + blockWidth - 40, yPosition + 48, blockX + blockWidth - 5, yPosition + 48);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Date', blockX + blockWidth - 40, yPosition + 53);
  });
};

// Helper functions
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
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