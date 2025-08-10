import jsPDF from 'jspdf';
import { ProposalData } from '../types';
import { PDFTemplate } from '../types/templates';
import { SubscriptionManager } from './subscriptionManager';
import { PDFDesigner, PDFTypography, ColorPalettes, LayoutUtils, Spacing } from './pdfStyling';
import { addQRCode } from './premiumPdfFeatures';

export const generateStyledPDF = async (data: ProposalData, template: PDFTemplate = 'modern'): Promise<void> => {
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
      await generateStyledCorporateTemplate(data, shouldAddWatermark);
      break;
    case 'creative':
      await generateStyledCreativeTemplate(data, shouldAddWatermark);
      break;
    case 'minimal':
      await generateStyledMinimalTemplate(data, shouldAddWatermark);
      break;
    default:
      await generateStyledModernTemplate(data, shouldAddWatermark);
  }

  SubscriptionManager.incrementUsage();
};

// Styled Corporate Template
const generateStyledCorporateTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const designer = new PDFDesigner(doc, 'corporate');
  const palette = ColorPalettes.corporate;
  let yPosition = margin;

  // 1. Enhanced Cover Page
  addStyledCoverPage(doc, data, 'corporate', designer, palette);

  // 2. Executive Summary Page
  doc.addPage();
  yPosition = margin + 20;

  // Page header with gradient
  yPosition = designer.addSectionHeader('EXECUTIVE SUMMARY', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '📋',
    subtitle: 'Strategic overview and key highlights'
  });

  // Executive summary in callout box
  const summaryText = `This proposal outlines the development of ${data.project.title} for ${data.client.company || data.client.name}. Our comprehensive approach ensures delivery of a high-quality solution that meets your specific requirements while providing exceptional value and long-term growth potential.`;
  
  yPosition = designer.addCalloutBox(margin, yPosition, pageWidth - 2 * margin, {
    title: 'Project Overview',
    text: summaryText,
    type: 'info',
    icon: '🎯'
  });

  // Project metrics in styled cards
  const layout = LayoutUtils.getTwoColumnLayout(pageWidth, margin);
  
  designer.addMetricCard(layout.leftColumn.x, yPosition, layout.leftColumn.width, 40, {
    icon: '💰',
    label: 'Total Investment',
    value: formatCurrency(data.project.price, data.project.currency)
  });

  designer.addMetricCard(layout.rightColumn.x, yPosition, layout.rightColumn.width, 40, {
    icon: '⏱️',
    label: 'Timeline',
    value: data.project.timeline
  });

  yPosition += 55;

  // Client information with enhanced styling
  yPosition = designer.addSectionHeader('CLIENT INFORMATION', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '👤'
  });

  yPosition = addStyledClientInfo(doc, data.client, yPosition, margin, pageWidth, designer);

  // 3. Project Details Page
  doc.addPage();
  yPosition = margin;

  yPosition = designer.addSectionHeader('PROJECT SPECIFICATIONS', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '🎯',
    subtitle: 'Detailed scope and deliverables'
  });

  yPosition = addStyledProjectDetails(doc, data.project, yPosition, margin, pageWidth, designer);

  // Enhanced timeline
  const timelineItems = [
    { title: 'Discovery & Planning', description: 'Requirements gathering and project planning', duration: '2-3 weeks', status: 'upcoming' as const },
    { title: 'Design & Architecture', description: 'UI/UX design and system architecture', duration: '3-4 weeks', status: 'upcoming' as const },
    { title: 'Development', description: 'Core development and implementation', duration: '6-8 weeks', status: 'upcoming' as const },
    { title: 'Testing & Launch', description: 'Quality assurance and deployment', duration: '2-3 weeks', status: 'upcoming' as const }
  ];

  yPosition = designer.addSectionHeader('PROJECT TIMELINE', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '📅'
  });

  yPosition = designer.addTimeline(margin, yPosition, pageWidth - 2 * margin, timelineItems);

  // 4. Investment Analysis Page
  doc.addPage();
  yPosition = margin;

  yPosition = designer.addSectionHeader('INVESTMENT ANALYSIS', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '💹',
    subtitle: 'Detailed breakdown and ROI projections'
  });

  // Enhanced investment breakdown
  const breakdown = [
    { category: 'Development & Engineering', percentage: 55, amount: data.project.price * 0.55, description: 'Core development and technical implementation' },
    { category: 'UI/UX Design', percentage: 20, amount: data.project.price * 0.20, description: 'User interface and experience design' },
    { category: 'Quality Assurance', percentage: 15, amount: data.project.price * 0.15, description: 'Testing and quality control' },
    { category: 'Project Management', percentage: 10, amount: data.project.price * 0.10, description: 'Coordination and delivery management' }
  ];

  yPosition = designer.addPricingBreakdown(margin, yPosition, pageWidth - 2 * margin, breakdown, data.project.currency);

  // ROI Analysis
  yPosition = addStyledROIAnalysis(doc, data, yPosition, margin, pageWidth, designer);

  // 5. Value Proposition Page
  doc.addPage();
  yPosition = margin;

  yPosition = designer.addSectionHeader('VALUE PROPOSITION', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '🏆'
  });

  yPosition = addStyledValueProposition(doc, data, yPosition, margin, pageWidth, designer);

  // Testimonial
  yPosition = designer.addQuoteBox(
    "Working with this team was exceptional. They delivered beyond our expectations, on time and within budget. The quality of work and attention to detail was outstanding.",
    "Sarah Johnson, CEO at TechStart Inc.",
    margin, yPosition, pageWidth - 2 * margin
  );

  // 6. Terms & Signature Page
  doc.addPage();
  yPosition = margin;

  yPosition = designer.addSectionHeader('TERMS & CONDITIONS', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '📜'
  });

  yPosition = addStyledTerms(doc, data.terms, yPosition, margin, pageWidth, designer);

  // Add QR code
  await addQRCode(doc, data, yPosition, margin, pageWidth);

  // Enhanced footer
  addStyledFooter(doc, data, pageWidth, pageHeight, designer);

  if (addWatermark) {
    addStyledWatermark(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_styled_corporate_proposal.pdf`;
  doc.save(fileName);
};

// Styled Creative Template
const generateStyledCreativeTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const designer = new PDFDesigner(doc, 'creative');
  const palette = ColorPalettes.creative;
  let yPosition = margin;

  // Creative cover with artistic elements
  addStyledCoverPage(doc, data, 'creative', designer, palette);

  // Content with creative styling
  doc.addPage();
  yPosition = margin;

  // Artistic header
  designer.addGradientBackground(0, yPosition, pageWidth, 60, palette.primary, palette.secondary);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDFTypography.sizes.title);
  doc.setFont('helvetica', 'bold');
  doc.text('✨ CREATIVE PROPOSAL', pageWidth / 2, yPosition + 35, { align: 'center' });

  yPosition += 75;

  // Project vision
  yPosition = designer.addCalloutBox(margin, yPosition, pageWidth - 2 * margin, {
    title: 'Project Vision',
    text: data.project.description,
    type: 'info',
    icon: '💡'
  });

  // Creative metrics layout
  const columns = LayoutUtils.getThreeColumnLayout(pageWidth, margin);
  
  designer.addMetricCard(columns[0].x, yPosition, columns[0].width, 35, {
    icon: '🎨',
    label: 'Design Focus',
    value: 'Premium'
  });

  designer.addMetricCard(columns[1].x, yPosition, columns[1].width, 35, {
    icon: '⚡',
    label: 'Delivery',
    value: data.project.timeline
  });

  designer.addMetricCard(columns[2].x, yPosition, columns[2].width, 35, {
    icon: '💎',
    label: 'Investment',
    value: formatCurrency(data.project.price, data.project.currency)
  });

  yPosition += 50;

  // Enhanced project details
  yPosition = designer.addSectionHeader('PROJECT DETAILS', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '📊'
  });

  yPosition = addStyledProjectDetails(doc, data.project, yPosition, margin, pageWidth, designer);

  if (addWatermark) {
    addStyledWatermark(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_styled_creative_proposal.pdf`;
  doc.save(fileName);
};

// Styled Modern Template
const generateStyledModernTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const designer = new PDFDesigner(doc, 'modern');
  const palette = ColorPalettes.modern;
  let yPosition = margin;

  // Modern cover
  addStyledCoverPage(doc, data, 'modern', designer, palette);

  // Content with modern styling
  doc.addPage();
  yPosition = margin;

  // Modern header with company branding
  designer.addGradientBackground(0, yPosition, pageWidth, 50, palette.primary, palette.secondary);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDFTypography.sizes.heading1);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, margin, yPosition + 30);

  yPosition += 65;

  // Project overview with modern cards
  yPosition = designer.addSectionHeader('PROJECT OVERVIEW', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '🚀'
  });

  yPosition = addModernProjectCards(doc, data, yPosition, margin, pageWidth, designer);

  // Investment summary
  yPosition = designer.addSectionHeader('INVESTMENT SUMMARY', yPosition, margin, pageWidth, {
    style: 'gradient',
    icon: '💰'
  });

  const layout = LayoutUtils.getTwoColumnLayout(pageWidth, margin);
  
  // Investment card
  designer.addCard(layout.leftColumn.x, yPosition, layout.leftColumn.width, 50, {
    backgroundColor: palette.light,
    borderColor: palette.accent
  });

  doc.setTextColor(palette.primary.r, palette.primary.g, palette.primary.b);
  doc.setFontSize(PDFTypography.sizes.heading1);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.project.price, data.project.currency), 
    layout.leftColumn.x + layout.leftColumn.width / 2, yPosition + 25, { align: 'center' });

  doc.setFontSize(PDFTypography.sizes.caption);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Investment', layout.leftColumn.x + layout.leftColumn.width / 2, yPosition + 35, { align: 'center' });

  // Timeline card
  designer.addCard(layout.rightColumn.x, yPosition, layout.rightColumn.width, 50, {
    backgroundColor: palette.light,
    borderColor: palette.accent
  });

  doc.setTextColor(palette.accent.r, palette.accent.g, palette.accent.b);
  doc.setFontSize(PDFTypography.sizes.heading1);
  doc.setFont('helvetica', 'bold');
  doc.text(data.project.timeline, 
    layout.rightColumn.x + layout.rightColumn.width / 2, yPosition + 25, { align: 'center' });

  doc.setFontSize(PDFTypography.sizes.caption);
  doc.setFont('helvetica', 'normal');
  doc.text('Project Timeline', layout.rightColumn.x + layout.rightColumn.width / 2, yPosition + 35, { align: 'center' });

  yPosition += 65;

  // Add QR code
  await addQRCode(doc, data, yPosition, margin, pageWidth);

  if (addWatermark) {
    addStyledWatermark(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_styled_modern_proposal.pdf`;
  doc.save(fileName);
};

// Styled Minimal Template
const generateStyledMinimalTemplate = async (data: ProposalData, addWatermark: boolean): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const designer = new PDFDesigner(doc, 'minimal');
  const palette = ColorPalettes.minimal;
  let yPosition = margin + 30;

  // Minimal cover
  addStyledCoverPage(doc, data, 'minimal', designer, palette);

  // Content with minimal styling
  doc.addPage();
  yPosition = margin + 30;

  // Simple header line
  designer.addDivider(margin, margin, pageWidth - 2 * margin, 'solid');

  // Company name
  doc.setTextColor(palette.primary.r, palette.primary.g, palette.primary.b);
  doc.setFontSize(PDFTypography.sizes.caption);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.companyName.toUpperCase(), margin, margin + 15);

  // Content sections with minimal styling
  yPosition = addMinimalStyledSection(doc, 'Project', data.project.title, yPosition, margin, pageWidth, designer);
  yPosition += Spacing.xl;

  yPosition = addMinimalStyledSection(doc, 'Client', data.client.company || data.client.name, yPosition, margin, pageWidth, designer);
  yPosition += Spacing.xl;

  yPosition = addMinimalStyledSection(doc, 'Investment', formatCurrency(data.project.price, data.project.currency), yPosition, margin, pageWidth, designer);
  yPosition += Spacing.xl;

  yPosition = addMinimalStyledSection(doc, 'Timeline', data.project.timeline, yPosition, margin, pageWidth, designer);

  // Contact at bottom
  const footerY = pageHeight - 80;
  designer.addDivider(margin, footerY, pageWidth - 2 * margin, 'solid');
  
  doc.setTextColor(palette.neutral.r, palette.neutral.g, palette.neutral.b);
  doc.setFontSize(PDFTypography.sizes.body);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.yourName, margin, footerY + 15);
  doc.text(data.branding.yourEmail, margin, footerY + 25);

  if (addWatermark) {
    addStyledWatermark(doc);
  }

  const fileName = `${data.project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_styled_minimal_proposal.pdf`;
  doc.save(fileName);
};

// Helper functions for styled content
const addStyledCoverPage = (
  doc: jsPDF,
  data: ProposalData,
  template: string,
  designer: PDFDesigner,
  palette: any
): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (template === 'corporate') {
    // Corporate cover with professional gradient
    designer.addGradientBackground(0, 0, pageWidth, pageHeight / 2, palette.primary, palette.secondary);
    
    // Company logo area
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(30, 30, 60, 60, 8, 8, 'F');
    
    // Title section
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDFTypography.sizes.title);
    doc.setFont('helvetica', 'bold');
    doc.text('BUSINESS PROPOSAL', pageWidth / 2, pageHeight / 3, { align: 'center' });
    
    doc.setFontSize(PDFTypography.sizes.heading1);
    doc.setFont('helvetica', 'normal');
    doc.text(data.project.title, pageWidth / 2, pageHeight / 3 + 20, { align: 'center' });

  } else if (template === 'creative') {
    // Creative cover with artistic elements
    designer.addGradientBackground(0, 0, pageWidth, pageHeight, palette.primary, palette.secondary);
    
    // Artistic shapes
    doc.setFillColor(255, 255, 255, 0.1);
    doc.ellipse(pageWidth - 50, 50, 60, 60, 'F');
    doc.ellipse(50, pageHeight - 50, 40, 40, 'F');

    // Creative typography
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('CREATIVE', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
    doc.text('PROPOSAL', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

  } else if (template === 'modern') {
    // Modern geometric design
    designer.addGradientBackground(0, 0, pageWidth, pageHeight / 3, palette.primary, palette.secondary);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight / 3, pageWidth, pageHeight * 2 / 3, 'F');

    // Modern typography
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDFTypography.sizes.title);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSAL', pageWidth / 2, pageHeight / 6, { align: 'center' });

    doc.setTextColor(palette.primary.r, palette.primary.g, palette.primary.b);
    doc.setFontSize(PDFTypography.sizes.heading1);
    doc.text(data.project.title, pageWidth / 2, pageHeight / 2, { align: 'center' });

  } else {
    // Minimal cover
    designer.addDivider(40, 40, pageWidth - 80, 'solid');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'normal');
    doc.text('Proposal', 40, pageHeight / 2 - 20);
    
    doc.setFontSize(PDFTypography.sizes.heading2);
    doc.setTextColor(palette.neutral.r, palette.neutral.g, palette.neutral.b);
    doc.text(data.project.title, 40, pageHeight / 2 + 10);
  }

  // Date and company info
  doc.setTextColor(template === 'minimal' ? palette.neutral.r : 255, 
                   template === 'minimal' ? palette.neutral.g : 255, 
                   template === 'minimal' ? palette.neutral.b : 255);
  doc.setFontSize(PDFTypography.sizes.body);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for: ${data.client.company || data.client.name}`, pageWidth / 2, pageHeight - 60, { align: 'center' });
  doc.text(`By: ${data.branding.companyName}`, pageWidth / 2, pageHeight - 45, { align: 'center' });
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
};

const addStyledClientInfo = (
  doc: jsPDF,
  client: any,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const layout = LayoutUtils.getTwoColumnLayout(pageWidth, margin);
  
  // Client details card
  designer.addCard(layout.leftColumn.x, yPosition, layout.leftColumn.width, 60, {
    backgroundColor: ColorPalettes.corporate.light,
    borderColor: ColorPalettes.corporate.accent
  });

  const clientInfo = [
    { label: 'Contact Name', value: client.name, icon: '👤' },
    { label: 'Company', value: client.company || 'Individual', icon: '🏢' },
    { label: 'Email', value: client.email, icon: '📧' },
    { label: 'Phone', value: client.phone || 'Not provided', icon: '📱' }
  ];

  clientInfo.forEach((info, index) => {
    const infoY = yPosition + 10 + (index * 12);
    
    designer.addIconBadge(layout.leftColumn.x + 10, infoY + 3, info.icon, { size: 6 });
    
    doc.setTextColor(ColorPalettes.corporate.primary.r, ColorPalettes.corporate.primary.g, ColorPalettes.corporate.primary.b);
    doc.setFontSize(PDFTypography.sizes.caption);
    doc.setFont('helvetica', 'bold');
    doc.text(`${info.label}:`, layout.leftColumn.x + 25, infoY + 5);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, layout.leftColumn.x + 25, infoY + 10);
  });

  return yPosition + 75;
};

const addStyledProjectDetails = (
  doc: jsPDF,
  project: any,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const sections = [
    { title: 'Project Description', content: project.description, icon: '📝' },
    { title: 'Scope of Work', content: project.scope, icon: '🎯' },
    { title: 'Key Deliverables', content: project.deliverables, icon: '📦' }
  ];

  sections.forEach((section, index) => {
    yPosition = designer.addCalloutBox(margin, yPosition, pageWidth - 2 * margin, {
      title: section.title,
      text: section.content,
      type: 'info',
      icon: section.icon
    });
    yPosition += Spacing.md;
  });

  return yPosition;
};

const addStyledROIAnalysis = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const projectCost = data.project.price;
  const estimatedROI = projectCost * 2.5;
  const monthlyBenefit = estimatedROI / 12;

  const layout = LayoutUtils.getTwoColumnLayout(pageWidth, margin);

  // ROI metrics
  designer.addMetricCard(layout.leftColumn.x, yPosition, layout.leftColumn.width, 40, {
    icon: '📈',
    label: 'Estimated 12-Month ROI',
    value: formatCurrency(estimatedROI, data.project.currency)
  });

  designer.addMetricCard(layout.rightColumn.x, yPosition, layout.rightColumn.width, 40, {
    icon: '💵',
    label: 'Monthly Benefit',
    value: formatCurrency(monthlyBenefit, data.project.currency)
  });

  return yPosition + 55;
};

const addStyledValueProposition = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const valueProps = [
    { title: 'Proven Expertise', text: 'Track record of 50+ successful projects with 98% client satisfaction', icon: '🏆' },
    { title: 'Modern Technology', text: 'Latest frameworks and tools ensuring future-proof solutions', icon: '🚀' },
    { title: 'Dedicated Support', text: '24/7 support during development and 6 months post-launch', icon: '🛠️' },
    { title: 'Transparent Process', text: 'Weekly reports and real-time project dashboard access', icon: '📊' }
  ];

  valueProps.forEach((prop, index) => {
    yPosition = designer.addCalloutBox(margin, yPosition, pageWidth - 2 * margin, {
      title: prop.title,
      text: prop.text,
      type: 'success',
      icon: prop.icon
    });
    yPosition += Spacing.sm;
  });

  return yPosition;
};

const addModernProjectCards = (
  doc: jsPDF,
  data: ProposalData,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const cards = [
    { title: 'Project Scope', content: data.project.scope, icon: '🎯', color: ColorPalettes.modern.accent },
    { title: 'Deliverables', content: data.project.deliverables, icon: '📦', color: ColorPalettes.modern.secondary },
    { title: 'Timeline', content: data.project.timeline, icon: '⏰', color: ColorPalettes.modern.success }
  ];

  cards.forEach((card, index) => {
    const cardY = yPosition + (index * 45);
    
    designer.addCard(margin, cardY, pageWidth - 2 * margin, 35, {
      backgroundColor: ColorPalettes.modern.light,
      borderColor: card.color
    });

    // Icon badge
    designer.addIconBadge(margin + 15, cardY + 17, card.icon, {
      backgroundColor: card.color,
      size: 10
    });

    // Title
    doc.setTextColor(ColorPalettes.modern.primary.r, ColorPalettes.modern.primary.g, ColorPalettes.modern.primary.b);
    doc.setFontSize(PDFTypography.sizes.heading3);
    doc.setFont('helvetica', 'bold');
    doc.text(card.title, margin + 35, cardY + 15);

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(PDFTypography.sizes.body);
    doc.setFont('helvetica', 'normal');
    const cardLines = doc.splitTextToSize(card.content, pageWidth - 2 * margin - 50);
    
    for (let i = 0; i < Math.min(cardLines.length, 2); i++) {
      doc.text(cardLines[i], margin + 35, cardY + 22 + (i * 6));
    }
  });

  return yPosition + (cards.length * 45);
};

const addMinimalStyledSection = (
  doc: jsPDF,
  title: string,
  content: string,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  const palette = ColorPalettes.minimal;
  
  doc.setTextColor(palette.primary.r, palette.primary.g, palette.primary.b);
  doc.setFontSize(PDFTypography.sizes.heading3);
  doc.setFont('helvetica', 'normal');
  doc.text(title, margin, yPosition);

  designer.addDivider(margin, yPosition + 3, doc.getTextWidth(title), 'solid');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(PDFTypography.sizes.body);
  doc.setFont('helvetica', 'normal');
  const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
  
  for (let i = 0; i < contentLines.length; i++) {
    doc.text(contentLines[i], margin, yPosition + 20 + (i * 7));
  }

  return yPosition + 20 + (contentLines.length * 7);
};

const addStyledTerms = (
  doc: jsPDF,
  terms: string,
  yPosition: number,
  margin: number,
  pageWidth: number,
  designer: PDFDesigner
): number => {
  // Terms in a professional box
  const termsHeight = 60;
  
  designer.addCard(margin, yPosition, pageWidth - 2 * margin, termsHeight, {
    backgroundColor: ColorPalettes.corporate.light,
    borderColor: ColorPalettes.corporate.neutral
  });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(PDFTypography.sizes.caption);
  doc.setFont('helvetica', 'normal');
  
  const termLines = doc.splitTextToSize(terms, pageWidth - 2 * margin - 20);
  for (let i = 0; i < Math.min(termLines.length, 8); i++) {
    doc.text(termLines[i], margin + 10, yPosition + 12 + (i * 6));
  }

  return yPosition + termsHeight + 15;
};

const addStyledFooter = (
  doc: jsPDF,
  data: ProposalData,
  pageWidth: number,
  pageHeight: number,
  designer: PDFDesigner
): void => {
  const footerY = pageHeight - 40;
  const palette = ColorPalettes.corporate;
  
  // Footer background
  designer.addGradientBackground(0, footerY, pageWidth, 40, palette.light, { r: 255, g: 255, b: 255 });

  // Company info
  doc.setTextColor(palette.primary.r, palette.primary.g, palette.primary.b);
  doc.setFontSize(PDFTypography.sizes.body);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, 25, footerY + 15);

  doc.setFontSize(PDFTypography.sizes.caption);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.branding.yourEmail} • ${data.branding.yourPhone || 'Contact for phone'}`, 25, footerY + 25);

  // Page number
  doc.setTextColor(palette.neutral.r, palette.neutral.g, palette.neutral.b);
  doc.text(`Page ${(doc as any).internal.getCurrentPageInfo().pageNumber}`, pageWidth - 25, footerY + 20, { align: 'right' });
};

const addStyledWatermark = (doc: jsPDF): void => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    
    doc.text('DEMO VERSION', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center'
    });
  }
};

const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$', EUR: '€', GBP: '£', CAD: '$'
  };
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};